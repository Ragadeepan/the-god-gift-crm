const { body, validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

const validateWhatsAppNumber = (field = "whatsappNumber") =>
  body(field)
    .trim()
    .notEmpty()
    .withMessage("WhatsApp number is required")
    .matches(/^\+?[1-9]\d{6,14}$/)
    .withMessage(
      "Enter a valid WhatsApp number (7-15 digits, optional + prefix)"
    );

const validateCustomerCreate = [
  validateWhatsAppNumber(),
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Customer name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("instagramLink")
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .custom((value) => {
      if (!value) return true;
      const igRegex =
        /^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9_.]+\/?$/;
      if (!igRegex.test(value)) {
        throw new Error(
          "Enter a valid Instagram URL (e.g. https://instagram.com/yourpage)"
        );
      }
      return true;
    }),
  handleValidationErrors,
];

const validateCustomerUpdate = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Name cannot be empty")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("instagramLink")
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .custom((value) => {
      if (!value) return true;
      const igRegex =
        /^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9_.]+\/?$/;
      if (!igRegex.test(value)) {
        throw new Error(
          "Enter a valid Instagram URL (e.g. https://instagram.com/yourpage)"
        );
      }
      return true;
    }),
  handleValidationErrors,
];

module.exports = {
  validateCustomerCreate,
  validateCustomerUpdate,
  handleValidationErrors,
};
