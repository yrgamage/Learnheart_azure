import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import VolunteerRequestCard from './VolunteerRequestCard';
import PropTypes from 'prop-types';
import axios from 'axios';
import RefreshIcon from '@mui/icons-material/Refresh';

const VolunteerRequest = ({ clarkUser }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log("Clark User", clarkUser);
  console.log("Organization Id: ", clarkUser?._id);

  const fetchVolunteerRequests = async () => {
    setLoading(true); // Set loading to true before fetching data
    try {
      const response = await axios.post('http://localhost:3001/api/volunteers/volunteer-requests', {
        isPending: true,
        organizationId: clarkUser?._id,
      });
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching volunteer requests:", error);
    } finally {
      setLoading(false); // Set loading to false after data is fetched or error occurs
    }
  };

  useEffect(() => {
    fetchVolunteerRequests();

    // Set up an interval to fetch data every 5 minutes (300,000 milliseconds)
    const intervalId = setInterval(fetchVolunteerRequests, 300000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [clarkUser?._id]);

  console.log("Requests: ", requests);

  return (
    <Box sx={{ backgroundColor: "#4db6ac", p: 3, borderRadius: 2 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'right',
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ lineHeight: 1.8 }}>
          Volunteer Requests
        </Typography>
        <Box sx={{ flex: 1 }} />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            variant="text"
            color="black"
            onClick={fetchVolunteerRequests}
            disabled={loading}
          >
            <RefreshIcon/>
          </Button>
        </Box>
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <CircularProgress size={40} />
        </Box>
      ) : requests.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <Typography variant="body2" color="text.secondary" textAlign="center" fontWeight="bold">
            No volunteer requests found.
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            maxHeight: 400,
            overflowY: "auto",
            p: 1,
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}
        >
          {requests.map((request, index) => (
            <VolunteerRequestCard key={index} request={request} refreshRequests={fetchVolunteerRequests} />
          ))}
        </Box>
      )}
    </Box>
  );
};

VolunteerRequest.propTypes = {
  clarkUser: PropTypes.shape({
    _id: PropTypes.string.isRequired,
  }).isRequired,
};

export default VolunteerRequest;