const express = require("express");
const router = express.Router();

router.post("/register", require("../controllers/auth/register"));
router.post("/login", require("../controllers/auth/login"));

module.exports = router;
