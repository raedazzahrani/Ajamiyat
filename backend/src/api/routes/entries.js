const express = require("express");
router = new express.Router();
entriesController = require("../controllers/entries");



router.get('/', entriesController.fetchAllFiltered);
router.get('/:entry_id', entriesController.fetch);
router.patch('/:old_entry_id', entriesController.updateID);

module.exports = router;