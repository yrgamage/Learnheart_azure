import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useUser, UserButton, SignedIn, SignedOut } from "@clerk/clerk-react";
import logo from "../assets/images/logo-icon-white.png";

function SignedInContent() {
  return (
    <div className="flex items-center space-x-4">
      <Link
        to="/sign-in"
        className="text-base text-white transition duration-300 hover:text-custom-orange"
        style={{ fontFamily: "Saira" }}
      >
        Sign in
      </Link>
      <Link
        to="/sign-up"
        className="px-4 py-2 text-base text-white transition duration-300 rounded-lg bg-custom-orange hover:bg-orange-600 hover:text-black"
        style={{ fontFamily: "Saira" }}
      >
        Sign up
      </Link>
    </div>
  );
}

function SignedOutContent(){
  const UserType = useUser().user?.unsafeMetadata.Type;
  let UserLink;
  if (UserType == "Volunteer"){
    UserLink = "/volunteer/overview"
  }else if (UserType == "Organization"){
    UserLink = "/organization/overview"
  }else if (UserType == "School"){
    UserLink = "/school/overview"
  }
  return(
    <div className="flex items-center space-x-3">
      <Link
        to={UserLink}
        className="px-3 py-2 mr-5 text-sm text-white rounded bg-custom-purple hover:bg-orange-600 hover:text-black hover:border border-custom-orange"
        style={{ fontFamily: "Saira" }}
      >
        Go To Page
      </Link>
        <UserButton signInUrl={"/sign-in"} afterSignOutUrl= {"/"}/>   
    </div>
  )
}

export default function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="fixed z-10 w-full shadow-lg bg-custom-blue">
      <div className="container flex items-center justify-between px-6 py-4 mx-auto">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Logo" className="w-auto h-8" />
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="items-center hidden space-x-8 md:flex">
          <Link
            to="/"
            className={`text-base ${
              isActive("/") ? "text-custom-orange" : "text-white"
            } hover:text-custom-orange transition duration-300`}
          >
            Home
          </Link>
          <Link
            to="/about-us"
            className={`text-base ${
              isActive("/about-us") ? "text-custom-orange" : "text-white"
            } hover:text-custom-orange transition duration-300`}
          >
            About Us
          </Link>
          <Link
            to="/resource-bank"
            className={`text-base ${
              isActive("/resource-bank") ? "text-custom-orange" : "text-white"
            } hover:text-custom-orange transition duration-300`}
          >
            Resource Bank
          </Link>
          <Link
            to="/past-events"
            className={`text-base ${
              isActive("/past-events") ? "text-custom-orange" : "text-white"
            } hover:text-custom-orange transition duration-300`}
          >
            Past Events
          </Link>
          <Link
            to="/posts"
            className={`text-base ${
              isActive("/posts") ? "text-custom-orange" : "text-white"
            } hover:text-custom-orange transition duration-300`}
          >
            Announcements
          </Link>
        </div>

        {/* Authentication Links */}
        <div className="items-center hidden space-x-4 md:flex">
          <SignedIn>
            <SignedOutContent />
          </SignedIn>
          <SignedOut>
            <SignedInContent />
          </SignedOut>
        </div>

        {/* Hamburger Menu for Mobile */}
        <div className="flex items-center md:hidden">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M4 6h16a1 1 0 110 2H4a1 1 0 110-2zm0 5h16a1 1 0 110 2H4a1 1 0 110-2zm0 5h16a1 1 0 110 2H4a1 1 0 110-2z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="text-white md:hidden bg-custom-blue">
          <div className="flex flex-col px-6 py-4 space-y-2">
            <Link
              to="/"
              className={`text-base ${
                isActive("/") ? "text-custom-orange" : "text-white"
              } hover:text-custom-orange transition duration-300`}
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about-us"
              className={`text-base ${
                isActive("/about-us") ? "text-custom-orange" : "text-white"
              } hover:text-custom-orange transition duration-300`}
              onClick={() => setIsOpen(false)}
            >
              About Us
            </Link>
            <Link
              to="/resource-bank"
              className={`text-base ${
                isActive("/resource-bank") ? "text-custom-orange" : "text-white"
              } hover:text-custom-orange transition duration-300`}
              onClick={() => setIsOpen(false)}
            >
              Resource Bank
            </Link>
            <Link
              to="/past-events"
              className={`text-base ${
                isActive("/past-events") ? "text-custom-orange" : "text-white"
              } hover:text-custom-orange transition duration-300`}
              onClick={() => setIsOpen(false)}
            >
              Past Events
            </Link>
            <Link
              to="/contact-us"
              className={`text-base ${
                isActive("/contact-us") ? "text-custom-orange" : "text-white"
              } hover:text-custom-orange transition duration-300`}
              onClick={() => setIsOpen(false)}
            >
              Contact Us
            </Link>
            <Link
              to="/posts"
              className={`text-base ${
                isActive("/posts") ? "text-custom-orange" : "text-white"
              } hover:text-custom-orange transition duration-300`}
              onClick={() => setIsOpen(false)}
            >
              Announcements
            </Link>
          </div>
          <div className="flex flex-col px-6 py-4 space-y-4 border-t border-gray-700">
            <SignedIn>
              <SignedOutContent />
            </SignedIn>
            <SignedOut>
              <SignedInContent />
            </SignedOut>
          </div>
        </div>
      )}
    </nav>
  );
}
