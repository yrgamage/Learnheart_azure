import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useOrganization } from "@clerk/clerk-react";
import axios from "axios";
import registerImg from "../../assets/images/home-img/register.png";

const provinces = [
  "Western", "Central", "Southern", "Northern", "Eastern",
  "North Western", "North Central", "Uva", "Sabaragamuwa"
];

function OrgDetForm() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { organization } = useOrganization();

  const Name = organization?.name;
  const OrgID = organization?.id;
  const UserID = user?.id;
  const ProfPic = organization?.imageUrl;
  const Email = user?.primaryEmailAddress?.emailAddress;

  const [Description, setDescription] = useState("");
  const [phnNbr, setPhnNbr] = useState("");
  const [WebSite, setWebSite] = useState("");
  const [SeminarLocations, setSeminarLocations] = useState("");
  const [selectedProvinces, setSelectedProvinces] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleProvinceChange = (province) => {
    if (selectAll) {
      setSelectAll(false);
    }
    setSelectedProvinces((prev) =>
      prev.includes(province)
        ? prev.filter((p) => p !== province)
        : [...prev, province]
    );
    setSeminarLocations([...selectedProvinces, province].join(", "));
  };

  const handleSelectAll = () => {
    if (!selectAll) {
      setSelectedProvinces(provinces);
      setSeminarLocations(provinces.join(", "));
    } else {
      setSelectedProvinces([]);
      setSeminarLocations("");
    }
    setSelectAll(!selectAll);
  };

  async function submitForm(e) {
    e.preventDefault();

    console.log("Submitting form: ", {
      OrgID,
      Name,
      Description,
      phone: phnNbr,
      email: Email,
      website: WebSite,
      seminarLocations: SeminarLocations,
      userID: UserID,
      profilePic: ProfPic,
    });

    try {
      await axios.post("http://localhost:3001/api/organizations/", {
        orgID: OrgID,
        name: Name,
        description: Description,
        phone: phnNbr,
        email: Email,
        website: WebSite,
        seminarLocations: SeminarLocations,
        userID: UserID,
        profilePic: ProfPic,
      });
      navigate("/organization/overview");
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  }

  return (
    <div className="flex flex-col-reverse items-center justify-center min-h-screen px-4 lg:flex-row bg-custom-page lg:px-16">
      {/* Image Section */}
      <div className="w-full lg:w-2/5">
        <img
          src={registerImg}
          alt="Register"
          className="object-contain w-full h-auto max-h-[400px] lg:max-h-[500px]"
        />
      </div>

      {/* Form Section */}
      <form
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
          placeholder="Phone Number"
          value={phnNbr}
          onChange={(e) => setPhnNbr(e.target.value)}
          className="w-full px-4 py-3 text-base text-gray-600 border rounded-lg focus:ring-2 focus:ring-orange-600 focus:outline-none"
        />
        <input
          type="text"
          placeholder="Website"
          value={WebSite}
          onChange={(e) => setWebSite(e.target.value)}
          className="w-full px-4 py-3 text-base text-gray-600 border rounded-lg focus:ring-2 focus:ring-orange-600 focus:outline-none"
        />
        <div className="flex flex-col space-y-2">
          <label className="font-semibold text-gray-900">Seminar Conduct Locations</label>
          <div className="flex flex-wrap gap-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
              />
              <span>Select All Provinces</span>
            </label>
            {provinces.map((province) => (
              <label key={province} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedProvinces.includes(province)}
                  onChange={() => handleProvinceChange(province)}
                  value={SeminarLocations}
                  className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <span>{province}</span>
              </label>
            ))}
          </div>
        </div>
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

export default OrgDetForm;
