import { useState, useEffect } from 'react';
import { useUser } from "@clerk/clerk-react";
import axios from 'axios';
import { Typography, Box, Button, Paper, Modal, IconButton, CircularProgress } from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddResource from "../../pages/resourceBankPages/AddResource";
import RequestCard from './RequestCard';

function VolLastbar() {
    const [requests, setRequests] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const user = useUser().user;
    const clarkId = user?.id;  
    console.log("Request Card Clark: ", clarkId);

    const fetchVolunteerRequestsByUserId = async () => {
        setLoading(true); // Set loading to true before fetching data
        try {
          const response = await axios.post('http://localhost:3001/api/volunteers/volunteer-requestsByUser', {
            userId: clarkId,
            isClosed: false,
          });
          setRequests(response.data);
        } catch (error) {
          console.error("Error fetching volunteer requests:", error);
        } finally {
          setLoading(false); // Set loading to false after data is fetched or error occurs
        }
    };

    useEffect(() => {
        fetchVolunteerRequestsByUserId();
    
        // Set up an interval to fetch data every 5 minutes (300,000 milliseconds)
        const intervalId = setInterval(fetchVolunteerRequestsByUserId, 300000);
    
        // Clean up the interval on component unmount
        return () => clearInterval(intervalId);
    }, [clarkId]);
    
    return (
        <Box className="flex flex-col gap-4">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    paddingY: 2,
                    paddingX: 3,
                    backgroundColor: '#4db6ac',
                    borderRadius: 2,
                    width: '100%',
                }}
            >
                <Box
                    sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'right',
                    }}
                >
                    <Typography variant="h6" sx={{ textAlign: 'center', color: 'black'}}>
                        Pending Requests
                    </Typography>
                    <Box sx={{ flex: 1 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <Button
                        variant="text"
                        color="black"
                        onClick={fetchVolunteerRequestsByUserId}
                        disabled={loading}
                    >
                        <RefreshIcon/>
                    </Button>
                    </Box>
                </Box>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                        <CircularProgress color="primary" />
                    </Box>
                ): requests.length === 0 ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                        <Typography variant="body1">No Requests Found</Typography>
                    </Box>
                ) : (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            maxHeight: 400,
                            maxWidth: 600,
                            overflowY: "auto",
                            '&::-webkit-scrollbar': {
                                display: 'none',
                            },
                            msOverflowStyle: 'none',
                            scrollbarWidth: 'none',
                        }}
                    >
                        {requests.map((request, index) => (
                            <RequestCard key={index} request={request} refreshRequests={fetchVolunteerRequestsByUserId} />
                        ))}
                    </Box>
                )}
            </Box>


            <Paper elevation={3} sx={{ p: 3, borderRadius: 2, textAlign: "center", bgcolor: "#4db6ac" }}>
                <Typography variant="h6">Add Resources</Typography>
                <Typography variant="body2" mt={2} style={{ fontStyle: 'italic' }}>
                Contribute educational resources to LearnHeart, enhancing access and opportunities for students worldwide.
                </Typography>
                <Button variant="contained" color="warning" sx={{ mt: 2 }} onClick={() => setIsModalOpen(true)}>
                Publish
                </Button>
            </Paper>
            
            <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <Box
                position="absolute"
                top="50%"
                left="50%"
                sx={{
                    transform: "translate(-50%, -50%)",
                    bgcolor: "#EAEFFB",
                    p: 3,
                    borderRadius: 2,
                    width: { xs: "90%", sm: "70%", md: "50%" }, // Responsive width
                    maxWidth: "800px", // Optional: Set a max-width for very large screens
                    overflowY: "auto",
                    scrollbarWidth: "none",
                    "&::-webkit-scrollbar": { display: "none" },
                }}
                >
                <IconButton
                    sx={{ position: "absolute", top: 8, right: 8 }}
                    onClick={() => setIsModalOpen(false)}
                >
                    <CloseIcon />
                </IconButton>
                <AddResource />
                </Box>
            </Modal>
        </Box>
    );
}

export default VolLastbar;