import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Link } from "react-router-dom";
import CardSliderImage1 from "../../assets/images/home-img/CardSliderImage1.jpg";
import CardSliderImage2 from "../../assets/images/home-img/CardSliderImage2.jpeg";
import CardSliderImage3 from "../../assets/images/home-img/CardSliderImage3.jpg";
import CardSliderImage4 from "../../assets/images/home-img/CardSliderImage4.jpg";

function CardSlider() {
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };
  return (
    <div className="w-full p-4 space-x-4 bg-custom-page ">
      <Carousel
        responsive={responsive}
        infinite
        autoPlay
        autoPlaySpeed={3000}
        transitionDuration={500}
        className="mt-4"
      >
        {/* Carousel Items */}
        <div className="p-6 mx-2 transition-transform duration-300 border rounded-lg shadow-lg hover:scale-105 h-80 border-custom-blue">
          <Link to={"/past-events"}>
            <img src={CardSliderImage1} alt="Feature 1" className="w-full h-64" />
          </Link>
        </div>
        <div className="p-6 mx-2 transition-transform duration-300 border rounded-lg shadow-lg hover:scale-105 h-80 border-custom-blue">
          <Link to={"/past-events"}>
            <img src={CardSliderImage2} alt="Feature 2" className="w-full h-64" />
          </Link>
        </div>
        <div className="p-6 mx-2 transition-transform duration-300 border rounded-lg shadow-lg hover:scale-105 h-80 border-custom-blue">
          <Link to={"/past-events"}>
            <img src={CardSliderImage3} alt="Feature 3" className="w-full h-64" />
          </Link>
        </div>
        <div className="p-6 mx-2 transition-transform duration-300 border rounded-lg shadow-lg hover:scale-105 h-80 border-custom-blue">
          <Link to={"/past-events"}>
            <img src={CardSliderImage4} alt="Feature 4" className="w-full h-64" />
          </Link>
        </div>
      </Carousel>
    </div>
  );
}

export default CardSlider;
