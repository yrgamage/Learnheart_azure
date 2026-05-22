import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    Rating,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
    IconButton,
    InputAdornment,
    Alert,
    Snackbar,
} from '@mui/material';
import { format } from 'date-fns';
import CommentIcon from '@mui/icons-material/Comment';
import CloseIcon from '@mui/icons-material/Close';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import Spinner from '../components/Spinner';
import ReviewList from '../components/ReviewList';
import ImageGallery from '../components/ImageGallery';
import { LocationOn, Event, School, Group } from '@mui/icons-material';

const PastEventsPage = () => {
    const { user } = useUser();
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [reviewDialog, setReviewDialog] = useState(false);
    const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
    const [loading, setLoading] = useState(true);
    const [noResults, setNoResults] = useState(false);
    const [galleryOpen, setGalleryOpen] = useState(false);
    const [selectedEventImages, setSelectedEventImages] = useState([]);
    const [initialImageIndex, setInitialImageIndex] = useState(0);
    const [successMessage, setSuccessMessage] = useState(false);
    const [reviewsDialog, setReviewsDialog] = useState(false);
    const [warningMessage, setWarningMessage] = useState(false); // New state for warning message

    const [searchParams, setSearchParams] = useState({
        date: '',
        location: '',
        host: '',
        grade: '',
    });

    useEffect(() => {
        fetchEvents();
    }, [user]);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:3001/api/past-events');
            setEvents(response.data);
            setFilteredEvents(response.data);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchParams((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSearch = () => {
        // Check if all search fields are empty
        if (!searchParams.date && !searchParams.location && !searchParams.host && !searchParams.grade) {
            setWarningMessage(true); // Show warning message
            return; // Exit the function early
        }

        let filtered = events;

        if (searchParams.date) {
            filtered = filtered.filter((event) =>
                format(new Date(event.seminarDate), 'yyyy-MM-dd').includes(searchParams.date)
            );
        }

        if (searchParams.location) {
            filtered = filtered.filter((event) =>
                event.location.toLowerCase().includes(searchParams.location.toLowerCase())
            );
        }

        if (searchParams.host) {
            filtered = filtered.filter((event) =>
                event.organizationName.toLowerCase().includes(searchParams.host.toLowerCase())
            );
        }

        if (searchParams.grade) {
            filtered = filtered.filter((event) =>
                event.grade.toLowerCase().includes(searchParams.grade.toLowerCase())
            );
        }

        setFilteredEvents(filtered);
        setNoResults(filtered.length === 0);
    };

    const handleClearSearch = () => {
        setSearchParams({
            date: '',
            location: '',
            host: '',
            grade: '',
        });
        setFilteredEvents(events);
        setNoResults(false);
    };

    const handleAddReview = (event) => {
        setSelectedEvent(event);
        setReviewDialog(true);
    };

    const handleSubmitReview = async () => {
        try {
            const userFullName = user.fullName || `${user.firstName} ${user.lastName}`.trim();
            const reviewData = {
                ...newReview,
                userId: user.id,
                userName: user.username || userFullName,
                userImage: user.imageUrl || user.profileImageUrl,
                createdAt: new Date().toISOString(),
            };

            await axios.post(
                `http://localhost:3001/api/past-events/${selectedEvent._id}/reviews`,
                reviewData
            );
            setReviewDialog(false);
            setNewReview({ rating: 0, comment: '' });
            setSuccessMessage(true);
            fetchEvents();
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    const calculateAverageRating = (reviews) => {
        if (!reviews || reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        return sum / reviews.length;
    };

    const handleImageClick = (images, clickedImageIndex) => {
        setSelectedEventImages(images);
        setInitialImageIndex(clickedImageIndex);
        setGalleryOpen(true);
    };

    const handleViewMore = (event) => {
        setSelectedEvent(event);
        setReviewsDialog(true);
    };

    return (
        <div className='bg-custom-page'>
            <Navbar />
            <Container
                maxWidth="xl"
                sx={{
                    py: 12,
                    ...(loading && {
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: 'calc(100vh - 64px - 96px)',
                    }),
                    width: '95%',
                    maxWidth: '1200px',
                }}
            >
                {/* Success Message Snackbar */}
                <Snackbar
                    open={successMessage}
                    autoHideDuration={3000}
                    onClose={() => setSuccessMessage(false)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert
                        onClose={() => setSuccessMessage(false)}
                        severity="success"
                        sx={{ width: '100%' }}
                    >
                        Review added successfully!
                    </Alert>
                </Snackbar>

                {/* Warning Message Snackbar */}
                <Snackbar
                    open={warningMessage}
                    autoHideDuration={3000}
                    onClose={() => setWarningMessage(false)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert
                        onClose={() => setWarningMessage(false)}
                        severity="warning"
                        sx={{ width: '100%' }}
                    >
                        Please fill at least one search field before searching.
                    </Alert>
                </Snackbar>

                {loading ? (
                    <Spinner />
                ) : (
                    <>
                        <Box
                            sx={{
                                mb: 4,
                                backgroundColor: '#5EA9A9',
                                p: 2,
                                borderRadius: '16px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                border: '1px solid #e0e7ff',
                            }}
                        >
                            <Grid container spacing={3} alignItems="center">
                                {/* Date Input */}
                                <Grid item xs={12} sm={6} md={3}>
                                    <Typography variant="subtitle2" sx={{ mb: 1, color: '#1B2336', fontWeight: 600 }}>
                                        Date
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        name="date"
                                        type="date"
                                        value={searchParams.date}
                                        onChange={handleSearchChange}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Event color="primary" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            backgroundColor: 'white',
                                            borderRadius: '12px',
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '12px',
                                            },
                                        }}
                                    />
                                </Grid>

                                {/* Location Input */}
                                <Grid item xs={12} sm={6} md={3}>
                                    <Typography variant="subtitle2" sx={{ mb: 1, color: '#1B2336', fontWeight: 600 }}>
                                        Location
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        name="location"
                                        value={searchParams.location}
                                        onChange={handleSearchChange}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LocationOn color="primary" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            backgroundColor: 'white',
                                            borderRadius: '12px',
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '12px',
                                            },
                                        }}
                                    />
                                </Grid>

                                {/* Host Input */}
                                <Grid item xs={12} sm={6} md={3}>
                                    <Typography variant="subtitle2" sx={{ mb: 1, color: '#1B2336', fontWeight: 600 }}>
                                        Host Organization
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        name="host"
                                        value={searchParams.host}
                                        onChange={handleSearchChange}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Group color="primary" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            backgroundColor: 'white',
                                            borderRadius: '12px',
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '12px',
                                            },
                                        }}
                                    />
                                </Grid>

                                {/* Grade Input */}
                                <Grid item xs={12} sm={6} md={3}>
                                    <Typography variant="subtitle2" sx={{ mb: 1, color: '#1B2336', fontWeight: 600 }}>
                                        Grade
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        name="grade"
                                        value={searchParams.grade}
                                        onChange={handleSearchChange}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <School color="primary" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            backgroundColor: 'white',
                                            borderRadius: '12px',
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '12px',
                                            },
                                        }}
                                    />
                                </Grid>

                                {/* Action Buttons */}
                                <Grid item xs={12} sx={{ mt: 1 }}>
                                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                        <Button
                                            variant="outlined"
                                            onClick={handleClearSearch}
                                            sx={{
                                                borderRadius: '10px',
                                                borderColor: '#1a237e',
                                                color: '#1a237e',
                                                px: 4,
                                                '&:hover': {
                                                    borderColor: '#0d47a1',
                                                    backgroundColor: 'rgba(26, 35, 126, 0.04)',
                                                },
                                            }}
                                        >
                                            Clear
                                        </Button>
                                        <Button
                                            variant="contained"
                                            onClick={handleSearch}
                                            sx={{
                                                borderRadius: '10px',
                                                backgroundColor: '#F97316',
                                                px: 4,
                                                '&:hover': {
                                                    backgroundColor: '#ea580c',
                                                },
                                            }}
                                        >
                                            Search
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>

                            {/* No Results Message */}
                            {noResults && (
                                <Alert severity="info" sx={{ mt: 3, borderRadius: '10px' }}>
                                    No events found matching your search criteria.
                                </Alert>
                            )}
                        </Box>

                        <Grid container spacing={3} sx={{ mt: 2 }}>
                            {filteredEvents.map((event) => (
                                <Grid item xs={12} sm={6} md={4} key={event._id}>
                                    <Card
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            transition: 'transform 0.2s, box-shadow 0.2s',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                                            },
                                            borderRadius: '16px',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        {/* Card Content */}
                                        <Box
                                            sx={{
                                                position: 'relative',
                                                paddingTop: '56.25%',
                                                cursor: 'pointer',
                                                overflow: 'hidden',
                                                backgroundColor: '#ffffff',
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    width: '100%',
                                                    height: '100%',
                                                    display: 'grid',
                                                    gap: '4px',
                                                    padding: '4px',
                                                    gridTemplateColumns:
                                                        event.images.length === 1
                                                            ? '1fr'
                                                            : event.images.length === 2
                                                            ? '2fr 1fr'
                                                            : event.images.length === 3
                                                            ? '2fr 1fr'
                                                            : '2fr 1fr',
                                                    gridTemplateRows:
                                                        event.images.length <= 2
                                                            ? '1fr'
                                                            : event.images.length === 3
                                                            ? '1fr 1fr'
                                                            : '1fr 1fr',
                                                    gridAutoFlow: 'dense',
                                                }}
                                                onClick={() => handleImageClick(event.images, 0)}
                                            >
                                                {/* Main large image */}
                                                <Box
                                                    sx={{
                                                        position: 'relative',
                                                        gridColumn: '1 / 2',
                                                        gridRow: '1 / 3',
                                                        overflow: 'hidden',
                                                        borderRadius: '4px',
                                                        '&:hover img': {
                                                            transform: 'scale(1.05)',
                                                        },
                                                    }}
                                                >
                                                    <img
                                                        src={event.images[0]}
                                                        alt={`Event main`}
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover',
                                                            transition: 'transform 0.3s ease-in-out',
                                                        }}
                                                    />
                                                </Box>

                                                {/* Side images */}
                                                {event.images.slice(1, 3).map((image, index) => (
                                                    <Box
                                                        key={index}
                                                        sx={{
                                                            position: 'relative',
                                                            gridColumn: '2 / 3',
                                                            gridRow: index === 0 ? '1 / 2' : '2 / 3',
                                                            overflow: 'hidden',
                                                            borderRadius: '4px',
                                                            '&:hover img': {
                                                                transform: 'scale(1.05)',
                                                            },
                                                        }}
                                                    >
                                                        <img
                                                            src={image}
                                                            alt={`Event ${index + 2}`}
                                                            style={{
                                                                width: '100%',
                                                                height: '100%',
                                                                objectFit: 'cover',
                                                                transition: 'transform 0.3s ease-in-out',
                                                            }}
                                                        />
                                                        {index === 1 && event.images.length > 3 && (
                                                            <Box
                                                                sx={{
                                                                    position: 'absolute',
                                                                    top: 0,
                                                                    left: 0,
                                                                    right: 0,
                                                                    bottom: 0,
                                                                    bgcolor: 'rgba(0, 0, 0, 0.5)',
                                                                    color: 'white',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    fontSize: '1.25rem',
                                                                    fontWeight: 'bold',
                                                                    cursor: 'pointer',
                                                                    '&:hover': {
                                                                        bgcolor: 'rgba(0, 0, 0, 0.6)',
                                                                    },
                                                                }}
                                                            >
                                                                +{event.images.length - 3}
                                                            </Box>
                                                        )}
                                                    </Box>
                                                ))}
                                            </Box>
                                        </Box>

                                        <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                            {/* Event Details */}
                                            <Typography
                                                variant="h5"
                                                component="h2"
                                                gutterBottom
                                                sx={{
                                                    fontWeight: 'bold',
                                                    mb: 1,
                                                    color: 'text.primary',
                                                }}
                                            >
                                                {event.schoolName}
                                            </Typography>

                                            <Typography
                                                variant="subtitle1"
                                                sx={{
                                                    mb: 2,
                                                    color: '#0277bd',
                                                    fontWeight: 500,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                }}
                                            >
                                                <Group sx={{ fontSize: 20 }} />
                                                Hosted by: {event.organizationName}
                                            </Typography>

                                            <Divider sx={{ my: 2 }} />

                                            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1.5 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Event sx={{ color: 'primary.main' }} />
                                                    <Typography variant="body2">
                                                        {format(new Date(event.seminarDate), 'MMMM dd, yyyy')}
                                                    </Typography>
                                                </Box>

                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <LocationOn sx={{ color: 'primary.main' }} />
                                                    <Typography variant="body2">
                                                        {event.location}
                                                    </Typography>
                                                </Box>

                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <School sx={{ color: 'primary.main' }} />
                                                    <Typography variant="body2">
                                                        Grade {event.grade}
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Rating
                                                        value={calculateAverageRating(event.reviews)}
                                                        precision={0.5}
                                                        readOnly
                                                        size="small"
                                                    />
                                                    <Typography variant="body2" color="text.secondary">
                                                        ({event.reviews?.length || 0})
                                                    </Typography>
                                                </Box>
                                                <Button
                                                    variant="text"
                                                    size="small"
                                                    onClick={() => handleViewMore(event)}
                                                    sx={{
                                                        color: '#1a237e',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(26, 35, 126, 0.04)'
                                                        }
                                                    }}
                                                >
                                                    View More
                                                </Button>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </>
                )}

                {/* Review Dialog */}
                <Dialog open={reviewDialog} onClose={() => setReviewDialog(false)}>
                    <DialogTitle>Add Review</DialogTitle>
                    <DialogContent>
                        <Box sx={{ pt: 2 }}>
                            <Typography component="legend">Rating</Typography>
                            <Rating
                                value={newReview.rating}
                                onChange={(_, value) => setNewReview({ ...newReview, rating: value })}
                                size="large"
                            />
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Your Review"
                                value={newReview.comment}
                                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                sx={{ mt: 2 }}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setReviewDialog(false)}>Cancel</Button>
                        <Button onClick={handleSubmitReview} variant="contained">
                            Submit Review
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Image Gallery */}
                <ImageGallery
                    images={selectedEventImages}
                    open={galleryOpen}
                    onClose={() => setGalleryOpen(false)}
                    initialImageIndex={initialImageIndex}
                />

                {/* Reviews Dialog */}
                <Dialog
                    open={reviewsDialog}
                    onClose={() => setReviewsDialog(false)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6">
                                Reviews & Ratings for {selectedEvent?.schoolName}
                            </Typography>
                            <IconButton onClick={() => setReviewsDialog(false)}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{ mt: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Rating
                                        value={calculateAverageRating(selectedEvent?.reviews)}
                                        readOnly
                                        precision={0.5}
                                        size="large"
                                    />
                                    <Typography variant="h6" sx={{ ml: 2 }}>
                                        {calculateAverageRating(selectedEvent?.reviews).toFixed(1)} ({selectedEvent?.reviews?.length || 0} reviews)
                                    </Typography>
                                </Box>
                                {user && (
                                    <Button
                                        variant="outlined"
                                        startIcon={<CommentIcon />}
                                        onClick={() => handleAddReview(selectedEvent)}
                                        sx={{
                                            borderColor: '#1a237e',
                                            color: '#1a237e',
                                            '&:hover': {
                                                borderColor: '#0d47a1',
                                                backgroundColor: 'rgba(26, 35, 126, 0.04)'
                                            }
                                        }}
                                    >
                                        Add Review
                                    </Button>
                                )}
                            </Box>
                            {selectedEvent?.reviews && selectedEvent.reviews.length > 0 ? (
                                <ReviewList reviews={selectedEvent.reviews} />
                            ) : (
                                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                                    No reviews yet. Be the first to review!
                                </Typography>
                            )}
                        </Box>
                    </DialogContent>
                </Dialog>
            </Container>
            <Footer />
        </div>
    );
};

export default PastEventsPage;