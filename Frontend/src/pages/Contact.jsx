import { useState } from "react";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import { useTheme } from "../contexts/ThemeContext.jsx";
import ScrollAnimation from "../components/ScrollAnimation.jsx";
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  PaperAirplaneIcon,
  UserIcon,
  BuildingOfficeIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import "react-toastify/dist/ReactToastify.css";


   const ContactPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    expertise: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { themeClasses } = useTheme();

 const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: import.meta.env.VITE_WEB3FORM_KEY, // ✅ put your key in .env
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        expertise: formData.expertise,
        message: formData.message,
      }),
    });

    const result = await response.json();

    if (result.success) {
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        location: "",
        expertise: "",
        message: "",
      });
    } else {
      toast.error(result.message || "Failed to send message. Please try again.");
    }
  } catch (error) {
    console.error("Error submitting contact form:", error);
    toast.error("Network error. Please check your connection and try again.");
  } finally {
    setIsSubmitting(false);
  }
};


  const contactInfo = [
    {
      icon: PhoneIcon,
      title: "Phone",
      value: "+91-7723847760",
      description: "Mon-Fri from 8am to 5pm",
      color: "from-green-500 to-teal-500",
    },
    {
      icon: EnvelopeIcon,
      title: "Email",
      value: "akshaykapsse@gmail.com",
      description: "We'll respond within 24 hours",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: MapPinIcon,
      title: "Location",
      value: "India",
      description: "Remote-first company",
      color: "from-purple-500 to-pink-500",
    },
  ];

  const expertiseOptions = [
    "Time Management",
    "Goal Scheduling",
    "Project Planning",
    "Productivity Consulting",
    "Team Coordination",
    "Other",
  ];

  return (
    <div
      className={`min-h-screen ${themeClasses.bg} pt-20 transition-all duration-500 relative`}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Top Right Blob */}
        <div
          className={`absolute -top-40 -right-40 w-80 h-80 bg-purple-500rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse 
        ${themeClasses.blob1}`}
        ></div>

        {/* Bottom Left Blob */}
        <div
          className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000
        ${themeClasses.blob2}`}
        ></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <ScrollAnimation>
            <div className="text-center mb-16">
              <motion.div
                className="flex items-center justify-center gap-3 mb-6"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                  <PhoneIcon className="w-8 h-8 text-purple-300" />
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                  Get In Touch
                </h1>
              </motion.div>
              <p
                className={`${themeClasses.textSecondary} text-lg sm:text-xl max-w-3xl mx-auto`}
              >
                Have questions about ClockSchedule? Need help with time
                management? We're here to help you succeed.
              </p>
            </div>
            {/* </div> */}
          </ScrollAnimation>

          {/* Contact Info Cards */}
          <ScrollAnimation>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  className="glass-card rounded-2xl p-6 text-center card-hover"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <div
                    className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${info.color} mb-4`}
                  >
                    <info.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {info.title}
                  </h3>
                  <p className="text-purple-300 font-medium mb-1">
                    {info.value}
                  </p>
                  <p className="text-gray-400 text-sm">{info.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </ScrollAnimation>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <ScrollAnimation>
              <motion.div
                className={`${themeClasses.glass} rounded-3xl border p-8 shadow-2xl`}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center gap-3 mb-8">
                  <PaperAirplaneIcon
                    className={`w-6 h-6 ${themeClasses.accent}`}
                  />
                  <h2 className={`text-2xl font-bold ${themeClasses.text}`}>
                    Send us a Message
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="form-label">
                        <UserIcon className="w-4 h-4 inline mr-2" />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="form-input"
                        required
                      />
                    </div>
                    <div>
                      <label className="form-label">
                        <EnvelopeIcon className="w-4 h-4 inline mr-2" />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="form-input"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="form-label">
                        <PhoneIcon className="w-4 h-4 inline mr-2" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 123-4567"
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="form-label">
                        <MapPinIcon className="w-4 h-4 inline mr-2" />
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="City, Country"
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label">
                      <BuildingOfficeIcon className="w-4 h-4 inline mr-2" />
                      Area of Interest
                    </label>
                    <select
                      name="expertise"
                      value={formData.expertise}
                      onChange={handleChange}
                      className="form-input"
                      required
                    >
                      <option value="">Select an option</option>
                      {expertiseOptions.map((option) => (
                        <option
                          key={option}
                          value={option}
                          className="bg-gray-800"
                        >
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="form-label">
                      <ClockIcon className="w-4 h-4 inline mr-2" />
                      Tell Us About Your Needs *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="5"
                      placeholder="Describe how we can help you with time management and scheduling..."
                      className="form-input resize-none"
                      required
                    ></textarea>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full px-6 py-4 ${themeClasses.button} ${themeClasses.buttonHover} text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="spinner"></div>
                        Sending Message...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <PaperAirplaneIcon className="w-5 h-5" />
                        Send Message
                      </div>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            </ScrollAnimation>

            {/* Additional Info */}
            <ScrollAnimation>
              <motion.div
                className="space-y-8"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                {/* Why Contact Us */}
                <div
                  className={`${themeClasses.glass} rounded-2xl border p-6 shadow-lg`}
                >
                  <h3
                    className={`text-xl font-semibold ${themeClasses.text} mb-4`}
                  >
                    Why Contact Us?
                  </h3>
                  <ul className={`space-y-3 ${themeClasses.textSecondary}`}>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Get personalized time management advice</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Learn advanced scheduling techniques</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Request new features or improvements</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Get technical support and troubleshooting</span>
                    </li>
                  </ul>
                </div>

                {/* Response Time */}
                <div
                  className={`${themeClasses.glass} rounded-2xl border p-6 shadow-lg`}
                >
                  <h3
                    className={`text-xl font-semibold ${themeClasses.text} mb-4`}
                  >
                    Response Time
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div>
                        <p className={`${themeClasses.text} font-medium`}>
                          Email Inquiries
                        </p>
                        <p className={`${themeClasses.textSecondary} text-sm`}>
                          Within 24 hours
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className={`${themeClasses.text} font-medium`}>
                          Technical Support
                        </p>
                        <p className={`${themeClasses.textSecondary} text-sm`}>
                          Within 48 hours
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <div>
                        <p className={`${themeClasses.text} font-medium`}>
                          Partnership Inquiries
                        </p>
                        <p className={`${themeClasses.textSecondary} text-sm`}>
                          Within 3-5 business days
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* FAQ Link */}
                <div
                  className={`${themeClasses.glass} rounded-2xl border p-6 text-center shadow-lg`}
                >
                  <h3
                    className={`text-xl font-semibold ${themeClasses.text} mb-3`}
                  >
                    Need Quick Answers?
                  </h3>
                  <p className={`${themeClasses.textSecondary} mb-4`}>
                    Check out our frequently asked questions for instant
                    solutions.
                  </p>
                  <motion.a
                    href="/about"
                    className={`${themeClasses.bgSecondary} backdrop-blur-md border ${themeClasses.border} ${themeClasses.text} font-semibold rounded-xl px-6 py-3 ${themeClasses.cardHover} transition-all duration-300 inline-flex items-center gap-2`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Learn More About Us
                  </motion.a>
                </div>
              </motion.div>
            </ScrollAnimation>
          </div>
        </motion.div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={themeClasses.theme === "light" ? "light" : "dark"}
      />
    </div>
  );
};

export default ContactPage;
