import { Link } from 'react-router-dom';
import Logo from '../assets/images/logo.png';
import { BsGlobe } from "react-icons/bs";

export default function Footer() {
    return (
      <footer className="text-center text-white bg-custom-blue lg:text-left">
        {/* <!-- Main container div: holds the entire content of the footer --> */}
        <div className="py-10 mx-1 text-center md:text-left">
          <div className="grid gap-8 grid-1 md:grid-cols-2 lg:grid-cols-5">
            {/* <!-- TW Elements section --> */}
            <div className="">
                <img src={Logo} alt="logo" />
            </div>
            {/* <!-- Products section --> */}
            <div className="">
              <h6 className="justify-center mb-4 font-semibold uppercase md:justify-start">Quick Links</h6>
              <p className="mb-4">
                <a className="text-white hover:text-gray-300"><Link to={'/'}>Home Page</Link></a>
              </p>
              <p className="mb-4">
                <a className="text-white hover:text-gray-300"><Link to={'/about-us'}>About Us</Link></a>
              </p>
              <p className="mb-4">
                <a className="text-white hover:text-gray-300"><Link to={'/resource-bank'}>Resource Bank</Link></a>
              </p>
              <p>
                <a className="text-white hover:text-gray-300"><Link to={'/past-events'}>Past Events</Link></a>
              </p>
            </div>
            {/* <!-- Useful links section --> */}
            <div className="">
              <h6 className="justify-center mb-4 font-semibold uppercase md:justify-start">Useful links</h6>
              <p className="mb-4">
                <a className="text-white hover:text-gray-300"><Link to={'/team'}>Our Team</Link></a>
              </p>
              <p className="mb-4">
                <a className="text-white hover:text-gray-300"><Link to={'/contact-us'}>Contact Us</Link></a>
              </p>
              <p className="mb-4">
                <a className="text-white hover:text-gray-300"><Link to={'/posts'}>Announcements</Link></a>
              </p>
              <p>
                <a className="text-white hover:text-gray-300"><Link to={'/sign-up'}>Join With Us</Link></a>
              </p>
            </div>
            {/* <!-- Contact section --> */}
            <div>
              <h6 className="flex justify-center mb-4 font-semibold uppercase md:justify-start">Contact</h6>
              <p className="flex items-center justify-center mb-4 md:justify-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 mr-3">
                  <path
                    d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                  <path
                    d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
                </svg>
                <a href='https://maps.app.goo.gl/hAABWvvgwVzfxkCH7' target='_blank' rel='noreferrer' className='text-white hover:text-gray-300'>Colombo, Sri Lanka</a>
                
              </p>
              <p className="flex items-center justify-center mb-4 md:justify-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 mr-3">
                  <path
                    d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                  <path
                    d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                </svg>
                <a href='mailto:learnheart@info.lk' target='_blank' rel='noreferrer' className='text-white hover:text-gray-300'>learnheart@info.lk</a>
              </p>
              <p className="flex items-center justify-center mb-4 md:justify-start">
                <svg xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 mr-3">
                  <path
                    fillRule="evenodd"
                    d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
                    clipRule="evenodd" />
                </svg>
                <a href='tel:+94762573095' target='_blank' rel='noreferrer' className='text-white hover:text-gray-300'>(+94) 76 257 3095</a>
              </p>
              <p className="flex items-center justify-center md:justify-start"><BsGlobe />
                <a href='https://learnheart-marketing.vercel.app/' target='_blank' rel='noreferrer' className='text-white hover:text-gray-300'>&nbsp;&nbsp;&nbsp;www.learnheart.live</a>
              </p>
            </div>
            {/* <!-- Authentication section --> */}
            <div className=''>
                <div className='flex flex-col items-center justify-center mt-3'>
                  <h6 className='font-serif text-3xl font-semibold text-white-400'>Join Us Today !</h6>
                  <Link to='/sign-up'>
                    <button className="py-3 mt-4 font-bold text-black duration-300 border px-7 rounded-3xl hover:scale-110 bg-custom-orange hover:bg-orange-600">Sign up</button>
                  </Link>
                </div>
                <hr className="my-4 border-gray-400" />
                <div className='flex items-center justify-between'>
                  <h3 className='text-gray-400 text-l'>Signed up already?</h3>
                  <Link to='/sign-in'>
                    <button className="w-full px-4 py-1 font-bold text-white duration-300 bg-transparent border border-white rounded-2xl hover:scale-110">Sign in</button>
                  </Link>
                </div>
            </div>
          </div>
        </div>
  
        {/* <!--Copyright section--> */}
        <div className="p-6 text-center bg-custom-blue">
          <span>© 2025 LearnHeart. All rights reserved. | Developed by </span>
            <Link to="/team"className={'font-semibold  text-natural-200 hover:text-gray-300'}>
              Team CodeNova
            </Link>
        </div>
      </footer>
    );
  }