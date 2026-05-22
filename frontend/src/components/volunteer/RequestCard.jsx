import { Card, CardContent, Typography, Stack, Chip } from "@mui/material";
import PropTypes from "prop-types";
import CloseIcon from '@mui/icons-material/Close';

const RequestCard = ({ request, refreshRequests }) => {

    console.log("Request Card: ", request);

    const handleCloseRequest = async () => {
        try {
          const response = await fetch("http://localhost:3001/api/volunteers/close", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ requestId: request._id }),
          });
    
          if (response.ok) {
            const data = await response.json();
            console.log(data.message);
            console.log("Request closed successfully.");
            refreshRequests();
          } else {
            console.log("Failed to accept the request.");
          }
        } catch (error) {
          console.error("Error accepting the request:", error);
          console.log("An error occurred while accepting the request.");
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
      <Card sx={{ p: 1, backgroundColor: "white", borderRadius: 2, minHeight: 'fit-content', position: 'relative' }}>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center">
            <div>
              <Typography variant="h8" sx={{ fontWeight: 600, top:15, position: 'absolute' }}>
                {request.organizationDetails.name}
              </Typography>
              <Typography variant="body2" sx={{marginTop: 2}}color="text.secondary">
                {formatDateTime(request.createdAt)}
              </Typography>
              <Typography variant="body2" sx={{marginTop: 1}}color="text.secondary">
                Language: {request.language} | Subjects: {request.subjects}
              </Typography>
            </div>
            <CloseIcon 
                onClick={handleCloseRequest}
                sx={{
                    position: 'absolute', // Position it inside the Card
                    top: 10,
                    right: 8,
                    cursor: 'pointer',
                    color: '#3657ad',
                }}
            />
          </Stack>
          <Chip
            sx={{ marginTop: 1 }}
            size="small"
            variant="contained"
            label={
                request.isPending
                ? "Pending"
                : request.isAccepted
                ? "Accepted"
                : request.isRejected
                ? "Rejected"
                : "Unknown"
            }
            color={
                request.isPending
                ? "secondary"
                : request.isAccepted
                ? "success"
                : request.isRejected
                ? "error"
                : "default"
            }
           />
        </CardContent>
      </Card>
    </>
  );
};

RequestCard.propTypes = {
    refreshRequests: PropTypes.func.isRequired,
  request: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    qualifications: PropTypes.string.isRequired,
    cv: PropTypes.string.isRequired,
    isPending: PropTypes.bool.isRequired,
    isAccepted: PropTypes.bool.isRequired,
    isRejected: PropTypes.bool.isRequired,
    organizationDetails: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    language: PropTypes.string.isRequired,
    subjects: PropTypes.string.isRequired,
  }).isRequired,
};

export default RequestCard;