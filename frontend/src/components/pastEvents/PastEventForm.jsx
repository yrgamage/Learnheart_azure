import { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Box, TextField, Button, Typography, Grid } from '@mui/material';
import { useUser } from '@clerk/clerk-react';

const PastEventForm = ({ onClose }) => {
    const { user } = useUser();
    const [formData, setFormData] = useState({
        schoolName: '',
        location: '',
        grade: '',
        subject: '',
        seminarDate: '',
        images: []
    });
    const [previewImages, setPreviewImages] = useState([]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const newImages = [];
        const newPreviews = [];

        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                newImages.push(reader.result);
                newPreviews.push(URL.createObjectURL(file));
                if (newImages.length === files.length) {
                    setFormData(prev => ({
                        ...prev,
                        images: newImages
                    }));
                    setPreviewImages(newPreviews);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/api/past-events', {
                ...formData,
                organizationId: user.id
            });
            console.log('Event created successfully:', response.data);
            onClose();
        } catch (error) {
            console.error('Error creating event:', error);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 3, backgroundColor: 'white' }}>
            <Typography variant="h6" gutterBottom>
                Share Past Event
            </Typography>
            
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="School Name"
                        name="schoolName"
                        value={formData.schoolName}
                        onChange={handleInputChange}
                        required
                    />
                </Grid>
                
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        required
                    />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Grade"
                        name="grade"
                        value={formData.grade}
                        onChange={handleInputChange}
                        required
                    />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                    />
                </Grid>
                
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        type="date"
                        label="Seminar Conduct Date"
                        name="seminarDate"
                        value={formData.seminarDate}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                        required
                    />
                </Grid>
                
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        component="label"
                        fullWidth
                        sx={{ mb: 2 }}
                    >
                        Upload Images
                        <input
                            type="file"
                            hidden
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </Button>
                    
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        {previewImages.map((preview, index) => (
                            <Box
                                key={index}
                                component="img"
                                src={preview}
                                sx={{
                                    width: 100,
                                    height: 100,
                                    objectFit: 'cover',
                                    borderRadius: 1,
                                    border: '1px solid #ddd'
                                }}
                            />
                        ))}
                    </Box>
                </Grid>
                
                <Grid item xs={12}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Submit Event
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

PastEventForm.propTypes = {
    onClose: PropTypes.func.isRequired
};

export default PastEventForm; 