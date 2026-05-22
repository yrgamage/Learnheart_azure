import Footer from "../../components/Footer";
import VolHeader from "../../components/volunteer/VolHeader";
import VolMidbar from "../../components/volunteer/VolMidbar";
import VolProfilebar from "../../components/volunteer/VolProfilebar";
import VolLastbar from "../../components/volunteer/VolLastbar";

function VolDashboard() {
  return (
    <div className="h-screen bg-custom-page">
      <div className="flex flex-col min-h-screen bg-custom-page">
        <VolHeader />
        <div className="container flex-1 py-20 mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <VolProfilebar />
            <VolMidbar />
            <VolLastbar />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default VolDashboard;
