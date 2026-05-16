const express = require("express");
const router = express.Router();
const {
  getAllCustomers,
  getCustomerByPhone,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getStats,
} = require("../controllers/customerController");
const {
  validateCustomerCreate,
  validateCustomerUpdate,
} = require("../middleware/validation");

// Stats — must come before /:phone to avoid conflict
router.get("/stats", getStats);

// CRUD
router.get("/", getAllCustomers);
router.get("/:phone", getCustomerByPhone);
router.post("/", validateCustomerCreate, createCustomer);
router.put("/:id", validateCustomerUpdate, updateCustomer);
router.delete("/:id", deleteCustomer);

module.exports = router;
