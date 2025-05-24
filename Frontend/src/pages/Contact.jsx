import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Importing the required styles


const ContactPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    expertise: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      fullName: document.getElementById("fullName").value,
      email: document.getElementById("email").value,
      phoneNumber: document.getElementById("phone").value,
      location: document.getElementById("location").value,
      expertise: document.getElementById("expertise").value,
      projectDetails: document.getElementById("message").value,
    };

    try {
      const response = await fetch("http://localhost:4001/api/contact/submit-contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        // Show success notification
        toast.success("Form submitted successfully!");
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          location: "",
          expertise: "",
          message: "",
        });
      } else {
        // Show error notification from backend response
        toast.error(result.message || "Error submitting form");
      }
    } catch (error) {
      console.error("Error in submitting contact form:", error);
      toast.error("An error occurred. Please try again.");
    }
  };


  return (
    <div className="p-8 md:p-16 bg-gray-100 flex justify-center items-center mt-16 md:mt-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
        {/* Left Section */}
        <div className="flex flex-col justify-center md:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-600 mb-4">
            Connect with Our Team of Experts
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            Contact our team of excellence-driven experts today to bring your
            project to life.
          </p>
          <ul className="text-gray-800 text-lg space-y-2">
            <li>
              📞 <span>7723847760</span>
            </li>
            <li>
              📧 <span>akshaykapsse@com.com</span>
            </li>
          </ul>
        </div>

        {/* Right Section - Form */}
        <div className="bg-blue-900 text-white mt-5 p-8 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fullName" className="block text-sm mb-1">
                  Full Name*
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="w-full p-3 rounded-lg text-gray-800"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm mb-1">
                  Email Address*
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="w-full p-3 rounded-lg text-gray-800"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className="block text-sm mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="w-full p-3 rounded-lg text-gray-800"
                />
              </div>
              <div>
                <label htmlFor="location" className="block text-sm mb-1">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Location"
                  className="w-full p-3 rounded-lg text-gray-800"
                />
              </div>
            </div>

            <div>
              <label htmlFor="expertise" className="block text-sm mb-1">
                What Expertise You're Interested In
              </label>
              <select
                id="expertise"
                name="expertise"
                value={formData.expertise}
                onChange={handleChange}
                className="w-full p-3 rounded-lg text-gray-800"
                required
              >
                <option value="">Select</option>
                <option value="Time Management">Time Management</option>
                <option value="Goal Scheduling">Goal Scheduling</option>
                <option value="Project Planning">Project Planning</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm mb-1">
                Tell Us About Your Project*
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                placeholder="Leave your message here"
                className="w-full p-3 rounded-lg text-gray-800"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700 transition-all"
            >
              SUBMIT →
            </button>
          </form>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default ContactPage;
