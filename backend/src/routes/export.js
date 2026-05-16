const express = require("express");
const router = express.Router();
const { exportToExcel } = require("../controllers/exportController");

router.get("/excel", exportToExcel);

module.exports = router;
