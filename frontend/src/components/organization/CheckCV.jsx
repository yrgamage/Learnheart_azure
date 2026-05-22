import { useState } from "react";
import {
  Button,
  CircularProgress,
  Container,
  Typography,
  Box,
  Paper,
  Grid,
} from "@mui/material";
import { styled } from "@mui/system";

const Input = styled("input")({
  display: "none",
});

const CheckCV = () => {
  const [file, setFile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("cv", file);

    // Local API = http://127.0.0.1:5000/upload
    try {
      const response = await fetch("https://learnheart-skill-server.onrender.com/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to extract skills");
      }

      if (data.skills && data.skills.length > 0) {
        setSkills(data.skills);
      } else {
        throw new Error("No skills found in the CV.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "Failed to extract skills. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 2, textAlign: "center" }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Upload Your CV
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          Please upload CV to extract relevant skills.
        </Typography>
        <Box sx={{ mt: 3 }}>
          <label htmlFor="upload-cv">
            <Input
              id="upload-cv"
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
            />
            <Button variant="contained" component="span" sx={{ mr: 2 }}>
              Choose File
            </Button>
          </label>
          {file && (
            <Typography variant="body1" sx={{ mt: 2 }}>
              Selected File: <strong>{file.name}</strong>
            </Typography>
          )}
        </Box>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 3, mb: 2 }}
          onClick={handleUpload}
          disabled={!file || loading}
          fullWidth
        >
          {loading ? <CircularProgress size={24} /> : "Proceed"}
        </Button>
        {error && (
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        {skills.length > 0 && (
          <Box sx={{ mt: 4, textAlign: "left" }}>
            <Typography variant="h6" gutterBottom>
              Extracted Skills:
            </Typography>
            <Grid container spacing={2}>
              {skills.map((skill, index) => (
                <Grid item xs={6} sm={4} md={3} key={index}>
                  <Paper elevation={1} sx={{ p: 1, textAlign: "center" }}>
                    {skill}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default CheckCV;
