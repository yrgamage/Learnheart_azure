import { Modal, Box, Typography, TextField, InputLabel, CardActions, Button, IconButton } from "@mui/material";
import { CheckCircle, Cancel, Close } from "@mui/icons-material";
import PropTypes from "prop-types";

const VolunteerRequestModal = ({ open, handleClose, selectedRequest, handleAccept, handleReject }) => {

  const handleViewCV = () => {
    if (selectedRequest && selectedRequest.cv) {
      const cvUrl = `http://localhost:3001/${selectedRequest.cv.replace(/\\/g, '/')}`;
      window.open(cvUrl, '_blank');
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 800,
        height: 'fit-content',
        bgcolor: 'background.paper',
        borderRadius: 5,
        p: 4,
        boxShadow: 24,
        overflowY: 'auto',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
      }}>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>

        {selectedRequest && (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mt: 1, fontWeight: 600 }}>
              {selectedRequest.volunteerDetails.name}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              Address: {selectedRequest.volunteerDetails.address}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              Contact No: {selectedRequest.volunteerDetails.phoneNumber}
            </Typography>

            <Box sx={{ width: '100%', mb: 2, mt: 2 }}>
              <InputLabel sx={{ color: 'black', fontSize: '1rem', fontWeight: 600, mb: 1, ml: 1 }}>Education / Work Qualifications</InputLabel>
              <TextField
                variant="outlined"
                value={selectedRequest.qualifications}
                disabled
                fullWidth
                InputProps={{ style: { height: 40 } }}
                sx={{ '& .MuiInputBase-input.Mui-disabled': { color: 'black', WebkitTextFillColor: 'black' } }}
              />
            </Box>

            <Box sx={{ width: '100%', mb: 2 }}>
              <InputLabel sx={{ color: 'black', fontSize: '1rem', fontWeight: 600, mb: 1, ml: 1 }}>Language Proficiency</InputLabel>
              <TextField
                variant="outlined"
                value={selectedRequest.language}
                disabled
                fullWidth
                InputProps={{ style: { height: 40 } }}
                sx={{ '& .MuiInputBase-input.Mui-disabled': { color: 'black', WebkitTextFillColor: 'black' } }}
              />
            </Box>

            <Box sx={{ width: '100%', mb: 2 }}>
              <InputLabel sx={{ color: 'black', fontSize: '1rem', fontWeight: 600, mb: 1, ml: 1 }}>Teaching Subjects</InputLabel>
              <TextField
                variant="outlined"
                value={selectedRequest.subjects}
                disabled
                fullWidth
                InputProps={{ style: { height: 40 } }}
                sx={{ '& .MuiInputBase-input.Mui-disabled': { color: 'black', WebkitTextFillColor: 'black' } }}
              />
            </Box>

            <Box sx={{ width: '100%', mb: 2 }}>
              <InputLabel sx={{ color: 'black', fontSize: '1rem', fontWeight: 600, mb: 1, ml: 1 }}>Available Dates</InputLabel>
              <TextField
                variant="outlined"
                value={selectedRequest.availableDates.join(", ")}
                disabled
                fullWidth
                InputProps={{ style: { height: 40 } }}
                sx={{ '& .MuiInputBase-input.Mui-disabled': { color: 'black', WebkitTextFillColor: 'black' } }}
              />
            </Box>

            <Box sx={{ width: '100%', mb: 2 }}>
              <InputLabel sx={{ color: 'black', fontSize: '1rem', fontWeight: 600, mb: 1, ml: 1 }}>System-Verified Skills</InputLabel>
              <TextField
                variant="outlined"
                value={selectedRequest.volunteerDetails.skills.join(", ")}
                disabled
                fullWidth
                multiline
                sx={{ '& .MuiInputBase-input.Mui-disabled': { color: 'black', WebkitTextFillColor: 'black' } }}
              />
            </Box>

            <CardActions sx={{ justifyContent: "flex-end", gap: 1, mt: 2 }}>
              <Button size="small" variant="contained" color="primary" onClick={handleViewCV}>
                View and Download CV
              </Button>
              <Button size="small" variant="contained" color="success" startIcon={<CheckCircle />} onClick={handleAccept}>
                Accept
              </Button>
              <Button size="small" variant="contained" color="error" startIcon={<Cancel />} onClick={handleReject}>
                Reject
              </Button>
            </CardActions>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

VolunteerRequestModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  selectedRequest: PropTypes.shape({
    qualifications: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    subjects: PropTypes.string.isRequired,
    availableDates: PropTypes.arrayOf(PropTypes.string).isRequired,
    skills: PropTypes.arrayOf(PropTypes.string),
    cv: PropTypes.string.isRequired,
    volunteerDetails: PropTypes.shape({
      name: PropTypes.string.isRequired,
      phoneNumber: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      skills: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
  }),
  handleAccept: PropTypes.func.isRequired,
  handleReject: PropTypes.func.isRequired,
};

export default VolunteerRequestModal;
