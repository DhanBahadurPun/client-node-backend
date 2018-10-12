const express = require("express");
const router = express.Router();



// @route GET api/posts/test
// @desc Test posts route
// @access Public
router.get("/test", (req, res, next) => res.json({ message: "Posts Works" }));


module.exports = router;