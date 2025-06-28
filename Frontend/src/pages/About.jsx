import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import HourglassImage from "../image/clock.jpg";
import ScheduleImage from "../image/schedule.jpg";
import TailwindImage from "../image/tailwind.jpg";

const AboutPage = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div className="p-8 md:p-16 bg-gray-100">
      {/* About Us Section */}
      <div className="flex flex-col md:flex-row md:items-center md:gap-8 mb-16">
        {/* Text Content */}
        <div data-aos="fade-up" className="md:w-1/2 order-2 md:order-1">
          <h2
            className="text-4xl font-bold text-blue-500 mb-6 relative inline-block group"
          >
            About Us
            <span className="absolute bottom-[-6px] left-1/2 h-[4px] w-0 bg-blue-500 transition-all duration-500 group-hover:left-0 group-hover:w-full"></span>
          </h2>
          <p className="text-lg text-gray-700">
            Welcome to our Clock & Schedule Manager! Our mission is to help you
            manage your time effectively and achieve your goals with ease. We
            combine simplicity and efficiency to make daily planning enjoyable.
          </p>
        </div>
        {/* Image */}
        <div
          className="relative group md:w-1/2 order-1 md:order-2 mb-4 md:mb-0 w-full max-w-md mx-auto"
          data-aos="zoom-in"
        >
          <img
            src={HourglassImage}
            alt="Clock and Hourglass"
            className="rounded-lg shadow-lg w-full transition-all duration-300 ease-in-out group-hover:scale-105"
          />
        </div>
      </div>

      {/* Our Project Section */}
      <div className="flex flex-col md:flex-row md:items-center md:gap-8 mb-16">
        {/* Image */}
        <div
          className="relative group md:w-1/2 mb-4 md:mb-0 w-full max-w-md mx-auto"
          data-aos="zoom-in"
        >
          <img
            src={ScheduleImage}
            alt="Schedule"
            className="rounded-lg shadow-lg w-full transition-all duration-300 ease-in-out group-hover:scale-105"
          />
        </div>
        {/* Text Content */}
        <div data-aos="fade-up" className="md:w-1/2">
          <h2
            className="text-4xl font-bold text-blue-500 mb-6 relative inline-block group"
          >
            Our Project
            <span className="absolute bottom-[-6px] left-1/2 h-[4px] w-0 bg-blue-500 transition-all duration-500 group-hover:left-0 group-hover:w-full"></span>
          </h2>
          <p className="text-lg text-gray-700">
            Our project empowers users to:
          </p>
          <ul className="list-disc list-inside text-lg text-gray-700 mt-4">
            <li>Set and manage goals with customizable deadlines.</li>
            <li>Create unique schedules tailored to each goal.</li>
            <li>Track time effectively and monitor progress.</li>
          </ul>
        </div>
      </div>

      {/* Technologies Section */}
      <div className="text-center mt-16">
        <h2
          className="text-4xl font-bold text-blue-500 mb-6 relative inline-block group"
          data-aos="fade-up"
        >
          Technologies We Use
          <span className="absolute bottom-[-6px] left-1/2 h-[4px] w-0 bg-blue-500 transition-all duration-500 group-hover:left-0 group-hover:w-full"></span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div
            className="bg-white p-4 shadow-lg rounded-lg group"
            data-aos="fade-up"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg"
              alt="Node.js"
              className="h-16 mx-auto transition-all duration-300 ease-in-out transform group-hover:scale-110"
            />
            <p className="mt-2 text-lg text-gray-700">Node.js</p>
          </div>
          <div
            className="bg-white p-4 shadow-lg rounded-lg group"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/4/47/React.svg"
              alt="React"
              className="h-16 mx-auto transition-all duration-300 ease-in-out transform group-hover:scale-110"
            />
            <p className="mt-2 text-lg text-gray-700">React</p>
          </div>
          <div
            className="bg-white p-4 shadow-lg rounded-lg group"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <img
              src="https://www.mongodb.com/assets/images/global/favicon.ico"
              alt="MongoDB"
              className="h-16 mx-auto transition-all duration-300 ease-in-out transform group-hover:scale-110"
            />
            <p className="mt-2 text-lg text-gray-700">MongoDB</p>
          </div>
          <div
            className="bg-white p-4 shadow-lg rounded-lg group"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <img
              src={TailwindImage}
              alt="TailwindCSS"
              className="h-16 mx-auto transition-all duration-300 ease-in-out transform group-hover:scale-110"
            />
            <p className="mt-2 text-lg text-gray-700">Tailwind CSS</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;