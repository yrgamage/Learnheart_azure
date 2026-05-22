/* eslint-disable react/prop-types */

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Collapse,
  Box,
} from "@mui/material";
import { Building } from "lucide-react";

export default function OrgSearchCard({
  organization,
  allSeminars,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [seminars, setSeminars] = useState([]);

  useEffect(() => {
    if (allSeminars.length > 0) {
      const specificSeminars = allSeminars.filter(
        (seminar) => seminar.organizationId === organization._id
      );
      const pastSeminars = specificSeminars.filter(
        (seminar) => new Date(seminar.expDate) < new Date()
      );
      setSeminars(pastSeminars);
    }
  }, [allSeminars, organization._id]);

  return (
    <Card
      sx={{
        maxWidth: 500,
        margin: "20px auto",
        boxShadow: 3,
        borderRadius: 3,
        cursor: "pointer",
      }}
      onClick={() => setIsOpen(!isOpen)}
    >
      <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar
          sx={{ width: 50, height: 50, border: 2, bgcolor: "primary.main" }}
        >
          <Building fontSize="large" />
        </Avatar>
        <Typography variant="h7">{organization.name}</Typography>
      </CardContent>
      <Collapse in={isOpen} timeout="auto">
        <CardContent>
          <Typography variant="body2" color="textSecondary" textAlign="center">
            {organization.description}
          </Typography>
          <Box mt={2}>
            <Typography variant="body2">
              <strong>Contact Number:</strong> {organization.phone}
            </Typography>
            <Typography variant="body2">
              <strong>Email:</strong> {organization.email}
            </Typography>
            <Typography variant="body2">
              <strong>Website:</strong> {organization.website}
            </Typography>
            <Typography variant="body2">
              <strong>Completed Seminars:</strong> {seminars.length}
            </Typography>
            <Typography variant="body2">
              <strong>Seminar Conduct Provinces:</strong>{" "}
              {organization.seminarLocations}
            </Typography>
          </Box>
        </CardContent>
      </Collapse>
    </Card>
  );
}

/* eslint-enable react/prop-types */
