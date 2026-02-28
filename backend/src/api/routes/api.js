const express = require("express");
const router = new express.Router();

const entriesRouter = require("./entries");
const submissionsRouter = require("./submissions");

router.use("/entries", entriesRouter);
router.use("/submissions", submissionsRouter);

module.exports = router;