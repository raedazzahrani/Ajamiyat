const express = require("express");
const router = new express.Router();
const submissionsController = require("../controllers/submissions");
const auth = require("../middleware/auth");

//public 
router.post('/', submissionsController.add);

//require auth
router.use(auth.checkAdmin);
router.get('/:submission_id', submissionsController.fetch);
router.post('/:submission_id/approve', submissionsController.approve);


module.exports = router;