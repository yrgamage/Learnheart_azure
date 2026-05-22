import { SignIn } from "@clerk/clerk-react";
import loginImg from "../../assets/images/home-img/login.png";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function Login() {
  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-[90vh] p-4 bg-custom-page">
        <div className="flex flex-col items-center w-full max-w-4xl overflow-hidden bg-custom-page md:flex-row">
          {/* Left Section: Image */}
          <div className="hidden w-1/2 h-full md:block">
            <img
              src={loginImg}
              alt="Login Illustration"
              className="object-cover w-full h-full"
            />
          </div>
          {/* Right Section: Login Form */}
          <div className="flex flex-col items-center justify-center w-full p-8 md:w-1/2">
            <SignIn
              redirectUrl={"/next"}
              signUpUrl="/sign-up"
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

