import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/Spinner";

const LoadingScreen = () => {
  const navigate = useNavigate();
  const [nextPageComponent, setNextPageComponent] = useState("");
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    if (isSignedIn) {
      const userType = user?.unsafeMetadata?.Type;

      switch (userType) {
        case "Volunteer":
          setNextPageComponent("/volunteer/overview/");
          break;
        case "School":
          setNextPageComponent("/school/overview");
          break;
        case "Organization":
          setNextPageComponent("/organization/overview");
          break;
        default:
          console.error(`Unhandled UserType: ${userType}`);
      }
    }
  }, [isSignedIn, user]);

  useEffect(() => {
    if (nextPageComponent) {
      navigate(nextPageComponent);
    }
  }, [nextPageComponent, navigate]);

  return (
    <div>
      {!isSignedIn ? (
        <>
          <Spinner />
        </>
      ) : null}
    </div>
  );
};

export default LoadingScreen;
