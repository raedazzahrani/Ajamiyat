const entriesRepo = require("../repo/entries")
const utils = require("../../utils/utils");
const inputValidator = require("../../utils/validator")


// ?offset=&limit=
async function fetchAllFiltered(req, res){

    const searchTerm = req.query.search;

    const parsedOffset = utils.parseStrictInt(req.query.offset);
    const parsedLimit = utils.parseStrictInt(req.query.limit);
    
    const unspecifiedOffset = req.query.offset === undefined || req.query.offset == "";
    const unspecifiedLimit = req.query.limit === undefined || req.query.limit == "";
    
    const nanOffset = parsedOffset === null;
    const nanLimit = parsedLimit === null;

    const validOffset = unspecifiedOffset || (!unspecifiedOffset && !nanOffset && parsedOffset >= 0);
    const validLimit = unspecifiedLimit || (!unspecifiedLimit && !nanLimit && parsedLimit > 0);
    
    if(!validOffset) return res.status(400).json({error: "Offset must be zero or a positive number"});
    if(!validLimit) return res.status(400).json({error: "Limit must be a positive number"});
    try{
        const entries = await entriesRepo.fetchAllLatestApproved({offset: parsedOffset, limit: parsedLimit, searchTerm});
        return res.status(200).json(entries);
    }
    catch (err){
        console.error(err);
        return res.status(500).json({error: "Internal server error"});
    }
}


// :entry_id 
async function fetchEntry(req, res){
    const entry_id = req.params.entry_id;
    if (entry_id === null)
        return res.status(400).json({error: "Invalid entry identifier"});
    try{
        const entry = await entriesRepo.fetchLatestApproved(entry_id);
        if (entry === null)
            return res.status(404).json({error: `Entry ${entry_id} does not exist`});
        //only fetch the top one (effectively the latest approved)
        return res.status(200).json(entry);
    }
    catch (err){
        console.error(err);
        return res.status(500).json({error: "Internal server error"});
    }
}


// :entry_id 
async function updateID(req, res){
    const old_entry_id = req.params.old_entry_id;
    const new_entry_id = req.body.new_entry_id;
    const oldError = inputValidator.validateRequiredString(old_entry_id, "old_entry_id");
    if(oldError) return res.status(400).json(oldError);
    const newError = inputValidator.validateRequiredString(new_entry_id, "new_entry_id");
    if(newError) return res.status(400).json(newError);

    const check = await entriesRepo.fetch(new_entry_id);
    if(check.length > 0) return res.status(400).json({error: `The new ID ${new_entry_id} conflicts with data that has the same ID, choose another one`});
    try{
        const result = await entriesRepo.updateID(old_entry_id, new_entry_id);
        if (result.affected_rows === 0)
            return res.status(404).json({error: `Entry ${old_entry_id} does not exist`});
        return res.status(200).json({status: "Updated"});
    }
    catch (err){
        console.error(err);
        return res.status(500).json({error: "Internal server error"});
    }
}




module.exports = {fetchAllFiltered, fetch: fetchEntry, updateID};