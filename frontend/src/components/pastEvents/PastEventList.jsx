import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardMedia,
    Grid,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Rating
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const PastEventList = ({ organizationId, onClose }) => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
    const [newReview, setNewReview] = useState({ rating: 0, comment: '' });

    useEffect(() => {
        fetchEvents();
    }, [organizationId]);

    const fetchEvents = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/api/past-events/organization/${organizationId}`);
            setEvents(response.data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const handleDeleteClick = (event) => {
        setSelectedEvent(event);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`http://localhost:3001/api/past-events/${selectedEvent._id}`);
            fetchEvents();
            setIsDeleteDialogOpen(false);
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    const handleReviewSubmit = async () => {
        try {
            await axios.post(`http://localhost:3001/api/past-events/${selectedEvent._id}/reviews`, newReview);
            fetchEvents();
            setIsReviewDialogOpen(false);
            setNewReview({ rating: 0, comment: '' });
        } catch (error) {
            console.error('Error adding review:', error);
        }
    };

    return (
        <Box sx={{ p: 3, height: '100%', overflowY: 'auto', backgroundColor: '#EAEFFB' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Past Events</Typography>
                <IconButton onClick={onClose}>×</IconButton>
            </Box>

            <Grid container spacing={3}>
                {events.map((event) => (
                    <Grid item xs={12} key={event._id}>
                        <Card>
                            <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box>
                                    <Typography variant="h7">{event.schoolName} | </Typography>
                                    <Typography variant="h7" color="textSecondary"> {event.location}</Typography>

                                    {/* Row for Grade, Subject, Date */}
                                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                        <Typography variant="body2">Grade: {event.grade} |</Typography>
                                        <Typography variant="body2">Subject: {event.subject} |</Typography>
                                        <Typography variant="body2">Date: {new Date(event.seminarDate).toLocaleDateString()}</Typography>
                                    </Box>
                                </Box>

                                <IconButton onClick={() => handleDeleteClick(event)} color="error">
                                    <DeleteIcon />
                                </IconButton>
                            </Box>


                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="subtitle1">Images:</Typography>
                                    <Box sx={{ display: 'flex', gap: 1, mt: 1, overflowX: 'auto', pb: 1 }}>
                                        {event.images.map((image, index) => (
                                            <CardMedia
                                                key={index}
                                                component="img"
                                                image={image}
                                                sx={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 1 }}
                                            />
                                        ))}
                                    </Box>
                                </Box>

                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="subtitle1">Reviews:</Typography>
                                    {event.reviews && event.reviews.length > 0 ? (
                                        event.reviews.map((review, index) => (
                                            <Box key={index} sx={{ mt: 1 }}>
                                                <Rating value={review.rating} readOnly size="small" />
                                                <Typography variant="body2">{review.comment}</Typography>
                                            </Box>
                                        ))
                                    ) : (
                                        <Typography variant="body2" color="textSecondary">No reviews yet</Typography>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
                <DialogTitle>Delete Event</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this event?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
                </DialogActions>
            </Dialog>

            {/* Add Review Dialog */}
            <Dialog open={isReviewDialogOpen} onClose={() => setIsReviewDialogOpen(false)}>
                <DialogTitle>Add Review</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <Rating
                            value={newReview.rating}
                            onChange={(_, value) => setNewReview({ ...newReview, rating: value })}
                            size="large"
                        />
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Comment"
                            value={newReview.comment}
                            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                            sx={{ mt: 2 }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsReviewDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleReviewSubmit} variant="contained">Submit Review</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

PastEventList.propTypes = {
    organizationId: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired
};

export default PastEventList; 