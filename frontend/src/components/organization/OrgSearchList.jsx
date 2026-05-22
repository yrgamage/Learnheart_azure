import OrgProfileCard from "./OrgSearchCard";
import axios from "axios";
import { Typography } from "@mui/material";
import { useState, useEffect } from "react";

export default function OrgSearchList() {
  const [organizations, setOrganizations] = useState([]);
  const [allSeminars, setAllSeminars] = useState([]);
  const [allVolunteers, setAllVolunteers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  console.log(organizations);
  console.log(allSeminars);
  console.log(allVolunteers);
  
  useEffect(() => {
    const fetchData = async (apiUrl) => {
      try {
        const response = await axios.get(apiUrl);
        switch (apiUrl) {
          case "http://localhost:3001/api/organizations":
            setOrganizations(response.data);
            break;
          case "http://localhost:3001/api/volunteers":
            setAllVolunteers(response.data);
            break;
          case "http://localhost:3001/api/seminars":
            setAllSeminars(response.data);
            break;
          default:
            console.warn("Unexpected API URL:", apiUrl);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        console.log("Data fetched successfully");
      }
    };

    fetchData(
      "http://localhost:3001/api/organizations"
    );
    fetchData("http://localhost:3001/api/volunteers");
    fetchData("http://localhost:3001/api/seminars");
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter organizations based on search term
  const filteredOrganizations = organizations.filter((organization) => {
    return organization.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      <div className="flex items-center justify-between px-4 py-2 mb-2 border-b">
        <Typography variant="h8" gutterBottom color="textPrimary">
          Explore Available Organizations
        </Typography>
        <input
          type="text"
          placeholder="Search For Organizations"
          className="px-4 py-2 bg-gray-100 rounded-md outline-none ml-[11%]"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      {/* Show all organizations when search term is empty */}
      {searchTerm === "" ? (
        <div></div>
      ) : (
        filteredOrganizations
          .slice(0, 3)
          .map((organization) => (
            <OrgProfileCard
              key={organization._id}
              organization={organization}
              allSeminars={allSeminars}
              allVolunteers={allVolunteers}
            />
          ))
      )}
    </div>
  );
}
