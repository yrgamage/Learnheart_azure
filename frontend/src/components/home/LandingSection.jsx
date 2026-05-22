import img from '../../assets/images/home-img/cover.png';
import { Link } from 'react-router-dom';

export default function LandingSection() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-custom-page">
      {/* Background Image Section */}
      <div className="relative">
        <img 
          className="object-cover w-full h-[95vh] sm:h-[85vh] md:h-[90vh] lg:h-screen" 
          src={img} 
          alt="Landing Cover" 
        />
      </div>
      {/* Text Section */}
      <div className="absolute px-6 text-center transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 sm:px-8 md:px-12">
        <p className="font-serif text-2xl font-bold text-transparent sm:text-3xl md:text-4xl lg:text-6xl bg-clip-text bg-gradient-to-br from-white/100 to-[#a0c4ff75] leading-tight sm:leading-snug md:leading-normal">
          Connecting Schools <br />
          with Volunteers, <br /> Sparking Brighter Futures!
        </p>
        <br />
        <Link to="/about-us">
          <button className="px-6 py-3 font-serif font-bold text-white duration-300 bg-transparent border border-white rounded-2xl hover:scale-110">
            About Us
          </button>
        </Link>
      </div>
    </div>
  );
}
