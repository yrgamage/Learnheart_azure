import { useState } from 'react';
import PropTypes from 'prop-types';
import {
    Dialog,
    DialogContent,
    IconButton,
    Box,
} from '@mui/material';
import {
    Close as CloseIcon,
    KeyboardArrowLeft,
    KeyboardArrowRight,
    ZoomIn as ZoomInIcon,
    ZoomOut as ZoomOutIcon,
} from '@mui/icons-material';

const ImageGallery = ({ images, open, onClose, initialImageIndex = 0 }) => {
    const [activeStep, setActiveStep] = useState(initialImageIndex);
    const [zoom, setZoom] = useState(1);

    const handleNext = () => {
        setActiveStep((prevStep) => prevStep + 1);
        setZoom(1); // Reset zoom when changing images
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
        setZoom(1); // Reset zoom when changing images
    };

    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev + 0.5, 3));
    };

    const handleZoomOut = () => {
        setZoom(prev => Math.max(prev - 0.5, 1));
    };

    // Handle keyboard navigation
    const handleKeyDown = (event) => {
        if (event.key === 'ArrowRight' && activeStep < images.length - 1) {
            handleNext();
        } else if (event.key === 'ArrowLeft' && activeStep > 0) {
            handleBack();
        } else if (event.key === 'Escape') {
            onClose();
        }
    };

    if (!images || images.length === 0) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth={false}
            PaperProps={{
                sx: {
                    bgcolor: 'background.paper',
                    position: 'relative',
                    maxHeight: '80vh',
                    maxWidth: '90vw !important',
                    width: 'auto',
                    minWidth: '600px',
                    margin: 2,
                }
            }}
            onKeyDown={handleKeyDown}
        >
            <IconButton
                onClick={onClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: 'white',
                    bgcolor: 'rgba(0, 0, 0, 0.5)',
                    '&:hover': {
                        bgcolor: 'rgba(0, 0, 0, 0.7)',
                    },
                    zIndex: 2,
                }}
            >
                <CloseIcon />
            </IconButton>

            <DialogContent sx={{ 
                p: 0, 
                position: 'relative', 
                height: '75vh',
                display: 'flex', 
                flexDirection: 'column',
                overflow: 'hidden'
            }}>
                {/* Zoom Controls */}
                <Box
                    sx={{
                        position: 'absolute',
                        left: 16,
                        top: 16,
                        display: 'flex',
                        gap: 1,
                        bgcolor: 'rgba(0, 0, 0, 0.5)',
                        borderRadius: 1,
                        p: 0.5,
                        zIndex: 2,
                    }}
                >
                    <IconButton onClick={handleZoomOut} sx={{ color: 'white' }}>
                        <ZoomOutIcon />
                    </IconButton>
                    <IconButton onClick={handleZoomIn} sx={{ color: 'white' }}>
                        <ZoomInIcon />
                    </IconButton>
                </Box>

                {/* Main Image Display */}
                <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        bgcolor: 'black',
                        overflow: 'hidden',
                        position: 'relative',
                        height: 'calc(100% - 80px)',
                    }}
                >
                    <img
                        src={images[activeStep]}
                        alt={`Event image ${activeStep + 1}`}
                        style={{
                            maxHeight: '100%',
                            maxWidth: '100%',
                            objectFit: 'contain',
                            transform: `scale(${zoom})`,
                            transition: 'transform 0.3s ease',
                        }}
                    />
                </Box>

                {/* Thumbnails */}
                <Box
                    sx={{
                        height: '80px',
                        bgcolor: 'black',
                        display: 'flex',
                        alignItems: 'center',
                        px: 2,
                        gap: 1,
                        overflowX: 'auto',
                    }}
                >
                    {images.map((image, index) => (
                        <Box
                            key={index}
                            onClick={() => {
                                setActiveStep(index);
                                setZoom(1);
                            }}
                            sx={{
                                width: '70px',
                                height: '70px',
                                flexShrink: 0,
                                cursor: 'pointer',
                                border: index === activeStep ? '2px solid white' : '2px solid transparent',
                                borderRadius: 1,
                                overflow: 'hidden',
                                opacity: index === activeStep ? 1 : 0.6,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    opacity: 1,
                                },
                            }}
                        >
                            <img
                                src={image}
                                alt={`Thumbnail ${index + 1}`}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                }}
                            />
                        </Box>
                    ))}
                </Box>

                {/* Navigation Buttons */}
                {activeStep > 0 && (
                    <IconButton
                        onClick={handleBack}
                        sx={{
                            position: 'absolute',
                            left: 16,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'white',
                            bgcolor: 'rgba(0, 0, 0, 0.5)',
                            '&:hover': {
                                bgcolor: 'rgba(0, 0, 0, 0.7)',
                            },
                        }}
                    >
                        <KeyboardArrowLeft />
                    </IconButton>
                )}
                {activeStep < images.length - 1 && (
                    <IconButton
                        onClick={handleNext}
                        sx={{
                            position: 'absolute',
                            right: 16,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'white',
                            bgcolor: 'rgba(0, 0, 0, 0.5)',
                            '&:hover': {
                                bgcolor: 'rgba(0, 0, 0, 0.7)',
                            },
                        }}
                    >
                        <KeyboardArrowRight />
                    </IconButton>
                )}
            </DialogContent>
        </Dialog>
    );
};
ImageGallery.propTypes = {
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    initialImageIndex: PropTypes.number,
};

export default ImageGallery;