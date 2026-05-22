import { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

import axios from "axios";
import { useUser } from "@clerk/clerk-react";

export const RequestSession = () => {
  const [schools, setSchools] = useState([]);
  const [organizations, setOrganizations] = useState([]);

  const { user } = useUser();
  console.log("User:", user);

  const clarkId = schools.find((sch) => sch.userID === user?.id);
  console.log(clarkId);

  const [formData, setFormData] = useState({
    subject: "",
    grade: "",
    expDate: "",
    expStudentCount: "",
    expTeacherCount: "",
    organization: "",
    medium: "",
    additionalRequests: "",
  });

  const [status, setStatus] = useState({
    message: "",
    isError: false,
    loading: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const clearForm = () => {
    setFormData({
      subject: "",
      grade: "",
      expDate: "",
      expStudentCount: "",
      expTeacherCount: "",
      organization: "",
      medium: "",
      additionalRequests: "",
    });
    setStatus({ message: "", isError: false, loading: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ message: "", isError: false, loading: true });

    try {
      const response = await axios.post(
        "http://localhost:3001/api/seminars/",
        {
          name: clarkId?.name,
          description: `${formData.subject} for grade ${formData.grade} students` + (formData.medium ? ` in ${formData.medium}.` : ""),
          subject: formData.subject,
          grade: formData.grade,
          expDate: formData.expDate,
          location: clarkId?.address,
          expStudentCount: formData.expStudentCount,
          expTeacherCount: formData.expTeacherCount,
          phoneNumber: clarkId?.contact,
          organization: organizations.find((org) => org.name === formData.organization)?.name,
          medium: formData.medium,
          additionalRequests: formData.additionalRequests || "-",
          schoolId: clarkId?._id,
          organizationId: organizations.find((org) => org.name === formData.organization)?._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        setStatus({
          message: "Request successfully sent",
          isError: false,
          loading: false,
        });
        clearForm();
      }
    } catch (error) {
      setStatus({
        message: error.response?.data?.error || "Something went wrong. Please try again.",
        isError: true,
        loading: false,
      });
    }
  };

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/schools");
        setSchools(response.data);
      } catch (error) {
        console.log("Error:", error);
      }
    };

    const fetchOrganizations = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/organizations");
        setOrganizations(response.data);
      } catch (error) {
        console.log("Error fetching organizations:", error);
      }
    };

    fetchSchools();
    fetchOrganizations();
  }, []);

  return (
    <Paper elevation={3} sx={{ p: 3, backgroundColor: "#4db6ac" }}>
      <Typography variant="h6" sx={{ m: 2, textAlign: "center" }}>
        Request Seminar Session
      </Typography>

      {status.message && (
        <Alert severity={status.isError ? "error" : "success"} sx={{ mb: 2, textAlign: "center" }}>
          {status.message}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
          <TextField
            label="Subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Enter subject"
            fullWidth
            variant="outlined"
            size="small"
            required
          />

          <TextField
            label="Grade"
            name="grade"
            value={formData.grade}
            onChange={handleChange}
            placeholder="Enter grade"
            fullWidth
            variant="outlined"
            size="small"
            required
          />

          <FormControl fullWidth variant="outlined" size="small" required>
            <InputLabel>Medium</InputLabel>
            <Select
              name="medium"
              value={formData.medium}
              onChange={handleChange}
              label="Medium"
            >
              <MenuItem value="Sinhala">Sinhala</MenuItem>
              <MenuItem value="English">English</MenuItem>
              <MenuItem value="Tamil">Tamil</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Date"
            name="expDate"
            type="date"
            value={formData.expDate}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            size="small"
            InputLabelProps={{ shrink: true }}
            required
          />

          <TextField
            label="Total Students"
            name="expStudentCount"
            type="number"
            value={formData.expStudentCount}
            onChange={handleChange}
            placeholder="Enter number of students"
            fullWidth
            variant="outlined"
            size="small"
            inputProps={{ min: 1 }}
            required
          />

          <TextField
            label="Expected Teachers Count"
            name="expTeacherCount"
            type="number"
            value={formData.expTeacherCount}
            onChange={handleChange}
            placeholder="Enter expected teacher count"
            fullWidth
            variant="outlined"
            size="small"
            inputProps={{ min: 1 }}
          />

          <FormControl fullWidth variant="outlined" size="small" required>
            <InputLabel>Organization</InputLabel>
            <Select
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              label="Organization"
            >
              {organizations.map((org) => (
                <MenuItem key={org._id} value={org.name}>
                  {org.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Additional Information"
            name="additionalRequests"
            value={formData.additionalRequests}
            onChange={handleChange}
            placeholder="Enter additional information"
            fullWidth
            variant="outlined"
            size="medium"
          />

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="warning"
              fullWidth
              disabled={status.loading}
            >
              {status.loading ? "Request Sent" : "Send Request"}
            </Button>

            <Button
              type="button"
              variant="contained"
              color="primary"
              fullWidth
              onClick={clearForm}
            >
              Clear
            </Button>
          </Box>
        </Box>
      </form>
    </Paper>
  );
};
