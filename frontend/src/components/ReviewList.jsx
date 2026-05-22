import React from 'react';
import {
    Box,
    Typography,
    Rating,
    Divider,
    Avatar,
    List,
    ListItem,
} from '@mui/material';
import { format } from 'date-fns';
import PropTypes from 'prop-types';

const ReviewList = ({ reviews = [] }) => {
    if (reviews.length === 0) {
        return (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                No reviews yet. Be the first to review this event!
            </Typography>
        );
    }

    return (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {reviews.map((review, index) => (
                <React.Fragment key={review?._id || index}>
                    <ListItem 
                        alignItems="flex-start" 
                        sx={{ 
                            px: 0,
                            '&:hover': {
                                bgcolor: 'rgba(0, 0, 0, 0.04)'
                            }
                        }}
                    >
                        <Box sx={{ display: 'flex', width: '100%' }}>
                            <Avatar 
                                src={review?.user?.avatar || ''} 
                                alt={review?.user?.name || 'User Avatar'}
                                sx={{ width: 40, height: 40, mr: 2 }}
                            />
                            <Box sx={{ flex: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                    <Rating 
                                        value={review?.rating || 0} 
                                        readOnly 
                                        size="small"
                                    />
                                    <Typography 
                                        variant="caption" 
                                        sx={{ color: 'text.secondary' }}
                                    >
                                        {review?.createdAt ? format(new Date(review.createdAt), 'MMM dd, yyyy') : 'Unknown Date'}
                                    </Typography>
                                </Box>
                                <Typography 
                                    variant="body2" 
                                    color="text.primary"
                                    sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                                >
                                    {review?.comment || 'No comment provided.'}
                                </Typography>
                            </Box>
                        </Box>
                    </ListItem>
                    {index < reviews.length - 1 && (
                        <Divider sx={{ my: 1.5, borderColor: 'rgba(0, 0, 0, 0.08)' }} />
                    )}
                </React.Fragment>
            ))}
        </List>
    );
};
ReviewList.propTypes = {
    reviews: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string,
            user: PropTypes.shape({
                avatar: PropTypes.string,
                name: PropTypes.string,
            }),
            rating: PropTypes.number,
            createdAt: PropTypes.string,
            comment: PropTypes.string,
        })
    ),
};

export default ReviewList;