/* eslint-disable react/prop-types */

import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import volonteerImg from "../../assets/images/home-img/volunteer.webp";
import schoolImg from "../../assets/images/home-img/school.webp";
import organizationImg from "../../assets/images/home-img/organization.gif";

function RoleButton({ roleName, to, imageSrc }) {
  return (
    <Link
      to={to}
      className="flex flex-col items-center w-32 h-32 p-4 transition-transform transform bg-white border-2 rounded-lg text-m sm:w-36 sm:h-36 lg:w-40 lg:h-40 text-custom-blue hover:scale-105 hover:shadow-md border-custom-blue"
    >
      <img
        src={imageSrc}
        alt={roleName}
        className="w-12 h-12 mb-3 rounded-full sm:w-14 sm:h-14 lg:w-16 lg:h-16"
      />
      <span className="font-medium text-center">{roleName}</span>
    </Link>
  );
}

function ProfSelect() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const showShadow = windowWidth >= 640;

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-blue">
      {/* Overlay */}
      <div className="fixed inset-0 bg-opacity-90 bg-blue-950"></div>

      {/* Popup */}
      <div
        className={`relative z-10 w-full max-w-[90%] sm:max-w-[80%] md:max-w-[60%] lg:max-w-[50%] xl:max-w-[40%] h-auto p-6 sm:p-8 bg-custom-page rounded-lg ${
          showShadow ? "shadow-2xl" : ""
        } flex flex-col items-center`}
      >
        <button
          className="absolute flex items-center px-4 py-2 text-sm transition-colors rounded-md top-4 left-4 text-custom-blue hover:bg-gray-200"
          onClick={() => window.history.back()}
        >
          <svg
            className="w-4 h-4 mr-2"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5"></path>
            <path d="M12 19l-7-7 7-7"></path>
          </svg>
          Back
        </button>

        <h1 className="mt-10 text-lg font-bold text-center text-custom-blue sm:text-xl lg:text-2xl">
          Join as Organization, Volunteer or School
        </h1>

        <div className="flex flex-wrap justify-center gap-6 mt-6">
          <RoleButton
            roleName="Organization"
            to="/organization/owner-create"
            imageSrc={organizationImg}
          />
          <RoleButton
            roleName="Volunteer"
            to="/volunteer/sign-up"
            imageSrc={volonteerImg}
          />
          <RoleButton
            roleName="School"
            to="/school/sign-up"
            imageSrc={schoolImg}
          />
        </div>
      </div>
    </div>
  );
}

export default ProfSelect;

/* eslint-enable react/prop-types */