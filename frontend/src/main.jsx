import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider, } from "react-router-dom";
import { ClerkProvider } from '@clerk/clerk-react';

// Landing Pages
import AboutUs from './pages/AboutUs.jsx';
import Team from './pages/Team.jsx';
import ContactUs from './pages/ContactUs.jsx';
import Loading from './pages/authorizationPages/Loading.jsx';
import CommunityPage from './pages/CommunityPage.jsx';
import CreatePost from './components/communityForm/CreatePost.jsx';
import EditPost from './components/communityForm/EditPost.jsx';
import SinglePost from './components/communityForm/SinglePost.jsx';
import PastEventsPage from './pages/PastEventsPage.jsx';

// Authorization Pages
import Login from './pages/authorizationPages/Login.jsx';
import SignUP from './components/authorization/ProfSelect.jsx';
import SclSignUP from './pages/authorizationPages/SclSignUP.jsx';
import OrgSignUP from './pages/authorizationPages/OrgSignUP.jsx';
import VolSignUP from './pages/authorizationPages/VolSignUP.jsx';
import OrgOwnerCreate from './components/authorization/OrgOwner-Create.jsx';

// Organization Pages
import OrgDetForm from "./components/authorization/OrgDetForm.jsx";
import OrgDashboard from './pages/userPages/OrgDashboard.jsx';

// School Pages
import SclDetForm from "./components/authorization/SclDetForm.jsx";
import SclDashboard from './pages/userPages/SclDashboard.jsx';

// Volunteer Pages
import VolDetForm from "./components/authorization/VolDetForm.jsx";
import VolDashboard from './pages/userPages/VolDashboard.jsx';

// Resource Bank Pages
import ResourceBank from './pages/resourceBankPages/ResourceBank.jsx';
import AddResource from './pages/resourceBankPages/AddResource.jsx';

const { VITE_CLERK_PUBLISHABLE_KEY } = import.meta.env;
const PUBLISHABLE_KEY = VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

const router = createBrowserRouter([
  { path: "/", element: <App />, },
  { path: "/about-us", element: <AboutUs />, },
  { path: "/team", element: <Team />, },
  { path: "/contact-us", element: <ContactUs />, },
  { path: "/posts", element: <CommunityPage />, },
  { path: "/posts/create", element: <CreatePost />, },
  { path: "/post/edit/:id", element: <EditPost />, },
  { path: "/post/:id", element: <SinglePost />, },
  { path: "/next", element: <Loading />, },
  { path: "/sign-in", element: <Login />, },
  { path: "/sign-up", element: <SignUP />, },
  { path: "/school/sign-up", element: <SclSignUP />, },
  { path: "/organization/sign-up", element: <OrgSignUP />, },
  { path: "/volunteer/sign-up", element: <VolSignUP />, },
  { path: "/volunteer/sign-in", element: <Login />, },
  { path: "/organization/sign-in", element: <Login />, },
  { path: "/school/sign-in", element: <Login />, },
  { path: "/organization/owner-create", element: <OrgOwnerCreate />, },
  { path: "/organization/details", element: <OrgDetForm />, },
  { path: "/organization/overview", element: <OrgDashboard />, },
  { path: "/school/details", element: <SclDetForm />, },
  { path: "/school/overview", element: <SclDashboard />, },
  { path: "/volunteer/details", element: <VolDetForm />, },
  { path: "/volunteer/overview", element: <VolDashboard />, },
  { path: "/resource-bank", element: <ResourceBank />, },
  { path: "/resource-bank/add", element: <AddResource />, },
  { path: "/past-events", element: <PastEventsPage />, },
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <RouterProvider router={router} />
    </ClerkProvider>
  </StrictMode>
)
