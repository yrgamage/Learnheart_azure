import { useState } from "react";
import { Card, CardContent, CardActions, Button, Typography, Stack } from "@mui/material";
import { CheckCircle, Cancel, Visibility } from "@mui/icons-material";
import PropTypes from "prop-types";
import VolunteerRequestModal from './VolunteerRequestModal'; // Import the modal component

const VolunteerRequestCard = ({ request, refreshRequests }) => {
  const [open, setOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const handleOpen = (req) => {
    setSelectedRequest(req);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAccept = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/volunteers/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestId: request._id }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
        handleClose();
        refreshRequests();
      } else {
        alert("Failed to accept the request.");
      }
    } catch (error) {
      console.error("Error accepting the request:", error);
      alert("An error occurred while accepting the request.");
    }
  };

  const handleReject = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/volunteers/reject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestId: request._id }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        handleClose();
        refreshRequests();
      } else {
        alert("Failed to reject the request.");
      }
    } catch (error) {
      console.error("Error rejecting the request:", error);
      alert("An error occurred while rejecting the request.");
    }
  };

  // Function to format the date and time
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };
    const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: true };
    const formattedDate = date.toLocaleDateString(undefined, optionsDate);
    const formattedTime = date.toLocaleTimeString(undefined, optionsTime);
    return `${formattedDate} at ${formattedTime}`;
  };

  return (
    <>
      <Card sx={{ p: 2, backgroundColor: "white", borderRadius: 2, minHeight: 150 }}>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center">
            <div>
              <Typography variant="h8" sx={{ fontWeight: 600 }}>
                {request.volunteerDetails.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatDateTime(request.createdAt)}
              </Typography>
            </div>
          </Stack>
        </CardContent>
        <CardActions sx={{ gap: 1 }}>
          <Button
            size="small"
            variant="contained"
            color="info"
            startIcon={<Visibility />}
            onClick={() => handleOpen(request)}
          >
            View
          </Button>
          <Button
            size="small"
            variant="contained"
            color="success"
            startIcon={<CheckCircle />}
            onClick={handleAccept}
          >
            Accept
          </Button>
          <Button
            size="small"
            variant="contained"
            color="error"
            startIcon={<Cancel />}
            onClick={handleReject}
          >
            Reject
          </Button>
        </CardActions>
      </Card>

      <VolunteerRequestModal
        open={open}
        handleClose={handleClose}
        selectedRequest={selectedRequest}
        handleAccept={handleAccept}
        handleReject={handleReject}
      />
    </>
  );
};

VolunteerRequestCard.propTypes = {
  request: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    qualifications: PropTypes.string.isRequired,
    cv: PropTypes.string.isRequired,
    volunteerDetails: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  refreshRequests: PropTypes.func.isRequired,
};

export default VolunteerRequestCard;