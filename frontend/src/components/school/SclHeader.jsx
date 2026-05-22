import { Link } from "react-router-dom";
import { SignOutButton, UserButton } from "@clerk/clerk-react";
import headerLogo from "../../assets/images/logo-icon-white.png";

const SclHeader = () => {
  return (
    <header className="fixed z-10 w-full px-4 py-3 shadow-md bg-custom-blue">
      <div className="container flex items-center justify-between mx-auto max-w-7xl">
        <div className="flex items-center">
          <Link to="/">
            <img
              src={headerLogo}
              alt="Logo"
              className="w-auto h-10 mr-4"
            />
          </Link>
        </div>
        {/* Navigation and user actions */}
        <div className="flex items-center space-x-4">
          <UserButton />
          <SignOutButton>
            <Link
              to="/"
              className="px-4 py-2 text-sm font-medium text-white transition-all duration-200 border border-transparent rounded-lg bg-custom-orange hover:bg-orange-600"
            >
              Sign out
            </Link>
          </SignOutButton>
        </div>
      </div>
    </header>
  );
};

export default SclHeader;
