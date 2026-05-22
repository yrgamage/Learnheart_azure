import { SignUp } from "@clerk/clerk-react";
import registerImg from "../../assets/images/home-img/register.png";
import Navbar from "../Navbar";
import Footer from "../Footer";

export default function OrgOwinerCreate() {
  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-[100vh] p-4 py-20 bg-custom-page">
        <div className="flex flex-col items-center w-full max-w-4xl overflow-hidde md:flex-row">
          {/* Left Section: Image */}
          <div className="hidden w-1/2 h-full md:block">
            <img
              src={registerImg}
              alt="Register Illustration"
              className="object-cover w-full h-full"
            />
          </div>
          {/* Right Section: Register Form */}
          <div className="flex flex-col items-center justify-center w-full p-8 md:w-1/2">
            <SignUp
              unsafeMetadata={{ Type: "Organization", }}
              redirectUrl={"/organization/sign-up"}
              signInUrl={"/sign-in"}
              appearance={{
                elements: {
                  card: "shadow-md border border-gray-200 rounded-lg bg-custom-green text-custom-black",
                  logoBox: "hidden",
                  formButtonPrimary: "bg-custom-orange hover:bg-orange-600 text-white",
                  headerTitle: "text-custom-black",
                },
              }}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
