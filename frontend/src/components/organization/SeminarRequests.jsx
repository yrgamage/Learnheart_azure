import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Modal,
  IconButton,
  Divider
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { Visibility, Refresh as RefreshIcon } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { useUser } from "@clerk/clerk-react";

const SeminarRequests = () => {
  const [seminars, setSeminars] = useState([]);
  const [schools, setSchools] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const user = useUser().user;

  const fetchData = async () => {
    setLoading(true);
    try {
      const [orgResponse, schoolResponse, seminarResponse] = await Promise.all([
        axios.get("http://localhost:3001/api/organizations"),
        axios.get("http://localhost:3001/api/schools"),
        axios.get("http://localhost:3001/api/seminars")
      ]);

      setOrganizations(orgResponse.data);
      setSchools(schoolResponse.data);
      setSeminars(seminarResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!seminars.length || !schools.length || !organizations.length) return;

    const currentOrganization = organizations.find(org => org.userID === user?.id);
    if (!currentOrganization) return;

    const combinedSessions = seminars
      .filter(seminar => seminar.organizationId === currentOrganization._id && seminar.status === "pending")
      .map(seminar => {
        const school = schools.find(sch => sch._id === seminar.schoolId);
        return {
          ...seminar,
          schoolName: school?.schoolName,
          schoolAddress: school?.address,
          schoolEmail: school?.email,
          schoolWebsite: school?.website,
          schoolPhoneNumber: school?.contact
        };
      });

    setFilteredSessions(combinedSessions);
  }, [seminars, schools, organizations, user]);

  const handleAccept = async (seminarId) => {
    try {
      await axios.put(`http://localhost:3001/api/seminars/${seminarId}`, { status: "accepted" });
      setFilteredSessions(prev => prev.filter(seminar => seminar._id !== seminarId));
    } catch (error) {
      console.error("Error accepting seminar:", error);
    }
  };

  const handleReject = async (seminarId) => {
    try {
      await axios.put(`http://localhost:3001/api/seminars/${seminarId}`, { status: "rejected" });
      setFilteredSessions(prev => prev.filter(seminar => seminar._id !== seminarId));
    } catch (error) {
      console.error("Error rejecting seminar:", error);
    }
  };

  const handleView = (session) => {
    setSelectedSession(session);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSession(null);
  };

  return (
    <Paper elevation={3} sx={{ bgcolor: "#4db6ac", p: 3, borderRadius: 2 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
        <Typography variant="h6" sx={{ color: "black", mr: 1 }}>
          Requested Sessions
        </Typography>
        <IconButton onClick={fetchData} sx={{ color: 'black' }}>
          <RefreshIcon />
        </IconButton>
      </Box>
      <Box sx={{ maxHeight: 400, overflowY: "auto", scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}>
        {filteredSessions.length > 0 ? (
          filteredSessions.map((session) => (
            <Card key={session._id} variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="body1" fontWeight="bold">
                  {session.schoolName}
                </Typography>
                <Typography variant="body2">Subject: {session.subject}</Typography>
                <Typography variant="body2">Grade: {session.grade}</Typography>
                <Typography variant="body2">Date: {new Date(session.expDate).toLocaleDateString()}</Typography>
                <Box display="flex" gap={1} mt={2}>
                  <Button variant="contained" color="primary" size="small" startIcon={<Visibility />} onClick={() => handleView(session)}>
                    View
                  </Button>
                  <Button variant="contained" color="success" size="small" startIcon={<CheckCircleIcon />} onClick={() => handleAccept(session._id)}>
                    Accept
                  </Button>
                  <Button variant="contained" color="error" size="small" startIcon={<CancelIcon />} onClick={() => handleReject(session._id)}>
                    Reject
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))
        ) : (
          <Box textAlign="center" mt={2}>
            <Typography variant="body2" color="text.secondary" fontWeight="bold">
              No seminar requests available.
            </Typography>
            {loading && <CircularProgress size={40} sx={{ mt: 2 }} />}
          </Box>
        )}
      </Box>

      {/* Modal for Viewing Full Seminar Details */}
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "#ffffff",
            p: 4,
            borderRadius: 2,
            width: { xs: "70%", sm: "45%", md: "35%" },
            boxShadow: 24,
            maxHeight: "80vh",
            overflowY: "auto",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" }
          }}
        >
          <IconButton sx={{ position: "absolute", top: 8, right: 8 }} onClick={handleCloseModal}>
            <CloseIcon />
          </IconButton>
          {selectedSession && (
            <Box>
              <Typography variant="h5" mb={2} textAlign="center">
                {selectedSession.schoolName}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2"><strong>Address:</strong> {selectedSession.schoolAddress}</Typography>
              <Typography variant="body2"><strong>Email:</strong> {selectedSession.schoolEmail}</Typography>
              <Typography variant="body2"><strong>Website:</strong> {selectedSession.schoolWebsite}</Typography>
              <Typography variant="body2"><strong>Phone:</strong> {selectedSession.schoolPhoneNumber}</Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2"><strong>Subject:</strong> {selectedSession.subject}</Typography>
              <Typography variant="body2"><strong>Grade:</strong> {selectedSession.grade}</Typography>
              <Typography variant="body2"><strong>Medium:</strong> {selectedSession.medium}</Typography>
              <Typography variant="body2"><strong>Date:</strong> {new Date(selectedSession.expDate).toLocaleDateString()}</Typography>
              <Typography variant="body2"><strong>Expected Teachers:</strong> {selectedSession.expTeacherCount}</Typography>
              <Typography variant="body2"><strong>Expected Students:</strong> {selectedSession.expStudentCount}</Typography>
              <Typography variant="body2"><strong>Additional Requests:</strong> {selectedSession.additionalRequests}</Typography>
            </Box>
          )}
        </Box>
      </Modal>
    </Paper>
  );
};

export default SeminarRequests;
