import express from "express";
import { submitContactForm } from "../controller/contact.controller.js"; // Import the controller
const router = express.Router();

// Route for submitting the contact form
router.post("/submit-contact",submitContactForm);

export default router;
