const express = require("express");
const router = express.Router();
const { addTag, getTags } = require("../controllers/tagsController");

router.post("/", addTag);
router.get("/", getTags);

module.exports = router;
