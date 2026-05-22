import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import registerImg from "../../assets/images/home-img/register.png";

function SclDetForm() {
  const Navigate = useNavigate();
  const { user } = useUser();
  
  const UserID = user?.id;
  const Name = user?.fullName;
  const Email = user?.primaryEmailAddress?.emailAddress;
  const [Description, setDescription] = useState("");
  const [Address, setAddress] = useState("");
  const [PhoneNumber, setPhoneNumber] = useState("");
  const [WebSite, setWebSite] = useState("");

  function submitForm(event) {
    event.preventDefault(); // Prevent default form submission

    // Log to check if data is ready to be sent
    console.log({
      userID: UserID,
      schoolName: Name,
      contact: PhoneNumber,
      email: Email,
      address: Address,
      website: WebSite,
      description: Description
    });

    // Send data to the server
    axios.post("http://localhost:3001/api/schools/", {
      userID: UserID,
      schoolName: Name,
      contact: PhoneNumber,
      email: Email,
      address: Address,
      website: WebSite,
      description: Description
    })
    .then((response) => {
      console.log(response.data);
      Navigate("/School/Overview");
    })
    .catch((error) => {
      console.error("There was an error sending the data:", error);
    });
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 lg:flex-row lg:px-16 bg-custom-page">
      {/* Image Section */}
      <div className="w-full mb-6 lg:w-2/5 lg:mb-0">
        <img
          src={registerImg}
          alt="Register"
          className="object-contain w-full h-auto max-h-[400px] lg:max-h-[500px]"
        />
      </div>

      {/* Form Section */}
      <form
        id="formSchool"
        onSubmit={submitForm}
        className="flex flex-col w-full max-w-lg p-6 space-y-6 border border-gray-300 shadow-lg lg:w-1/3 bg-custom-green rounded-xl lg:p-8"
      >
        <h1 className="text-2xl font-bold text-center text-gray-900">
          Sign Up as <span className="text-custom-black">{Name}</span>
        </h1>
        <input
          type="text"
          placeholder="Description"
          value={Description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-3 text-base text-gray-600 border rounded-lg focus:ring-2 focus:ring-orange-600 focus:outline-none"
        />
        <input
          type="text"
          placeholder="Address"
          value={Address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full px-4 py-3 text-base text-gray-600 border rounded-lg focus:ring-2 focus:ring-orange-600 focus:outline-none"
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={PhoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full px-4 py-3 text-base text-gray-600 border rounded-lg focus:ring-2 focus:ring-orange-600 focus:outline-none"
        />
        <input
          type="text"
          placeholder="Website"
          value={WebSite}
          onChange={(e) => setWebSite(e.target.value)}
          className="w-full px-4 py-3 text-base text-gray-600 border rounded-lg focus:ring-2 focus:ring-orange-600 focus:outline-none"
        />
        <button
          type="submit"
          className="w-full py-3 text-base font-semibold text-white transition duration-300 rounded-lg bg-custom-orange hover:bg-orange-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default SclDetForm;
  