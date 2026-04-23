const express = require("express");

const Message = require("../models/Message");
const { validateMessagePayload } = require("../utils/validation");

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { sanitized, errors, isValid } = validateMessagePayload(req.body);

    if (!isValid) {
      const error = new Error("Validation failed");
      error.statusCode = 400;
      error.details = errors;
      throw error;
    }

    const savedMessage = await Message.create(sanitized);

    return res.status(201).json({
      message: "Message submitted successfully.",
      data: {
        id: savedMessage._id,
        fullName: savedMessage.fullName,
        anonymousName: savedMessage.anonymousName,
        message: savedMessage.message,
        createdAt: savedMessage.createdAt,
      },
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
