import axios from 'axios';

export const submitContactForm = async (req, res) => {
  const { fullName, email, phoneNumber, location, expertise, projectDetails } = req.body;

  try {
    const response = await axios.post("https://api.web3forms.com/submit", {
      access_key: process.env.WEB3FORM_API_KEY,
      fullName,
      email,
      phoneNumber,
      location,
      expertise,
      projectDetails,
    });

    console.log('Web3Forms response:', response.data); // Log response
    if (response.status === 200) {
      return res.status(201).json({ message: "Form submitted successfully!" });
    } else {
      return res.status(500).json({ message: "Failed to send the form. Please try again later." });
    }
  } catch (error) {
    console.error("Error submitting form to Web3Form:", error.message);
    return res.status(500).json({ message: "Unable to connect to Web3Form. Check your network or API key." });
  }
};
