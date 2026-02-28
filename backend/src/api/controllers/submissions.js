const utils = require("../../utils/utils");
const submissionsRepo = require("../repo/submissions");
const inputValidator = require("../../utils/validator");
const inputCleanser = require("../../utils/cleanser");



// :submission_id
async function approve(req, res){
    const submission_id = utils.parseStrictInt(req.params.submission_id);
    if(submission_id === null){
        return res.status(400).json({error: "invalid submission identifier"});
    }
    try{
        const result = await submissionsRepo.approve(submission_id);
        affectedRows = result.affected_rows;
        if(affectedRows == 0) return res.status(404).json({error: "Submission does not exist"});
        return res.status(200).json({status: "Approved"});
    }
    catch (err){
        console.error(`Failed to approve submission: ${err}`);
        return res.status(500).json({error: "Internal server error"});
    }
}

async function fetch(req, res){
    const submission_id = utils.parseStrictInt(req.params.submission_id);
    if (submission_id === null)
        return res.status(400).json({error: "Invalid submission identifier"});
    try{
        const submission = await submissionsRepo.fetch(submission_id, null, null);
        if (submission.length === 0)
            return res.status(404).json({error: "Submission does not exist"});
        return res.status(200).json(submission[0]);
    }
    catch (err){
        console.error(err);
        return res.status(500).json({error: "Internal server error"});
    }
}

async function remove(req, res){
    const submission_id = utils.parseStrictInt(req.params.submission_id);
    if (submission_id === null)
        return res.status(400).json({error: "Invalid submission identifier"});
    try{
        const result = await submissionsRepo.delete(submission_id);
        affectedRows = result.affected_rows;
        if(affectedRows == 0) return res.status(404).json({error: "Submission does not exist"});
        return res.status(200).json({status: "Deleted"});
    }
    catch (err){
        console.error(err);
        return res.status(500).json({error: "Internal server error"});
    }
}

async function add(req, res){
    let {
        entry_id,
        origin,
        original,
        categories,
        forms,
        sources,
        meanings,
        examples
    } = req.body;

    const validationErrors = [];

    //validation
    const entry_idError = inputValidator.validateOptionalString(entry_id, "entry_id");
    if(entry_idError) validationErrors.push({field: "entry_id", message: entry_idError});

    const originError = inputValidator.validateRequiredString(origin, "origin");
    if(originError) validationErrors.push({field: "origin", message: originError});
    
    const originalError = inputValidator.validateOptionalString(original, "original");
    if(originalError) validationErrors.push({field: "original", message: originalError});
        
    const categoriesError = inputValidator.validateOptionalStringArray(categories, "categories");
    if(categoriesError) validationErrors.push({field: "categories", message: categoriesError});

    const formsError = inputValidator.validateRequiredStringArray(forms, "forms");
    if(formsError) validationErrors.push({field: "forms", message: formsError});
    
    const sourcesError = inputValidator.validateOptionalStringArray(sources, "sources");
    if(sourcesError) validationErrors.push({field: "sources", message: sourcesError});

    const meaningsError = inputValidator.validateOptionalStringArray(meanings, "meanings");
    if(meaningsError) validationErrors.push({field: "meanings", message: meaningsError});
    
    const examplesError = inputValidator.validateOptionalStringArray(examples, "examples");
    if(examplesError) validationErrors.push({field: "examples", message: examplesError});
    
    if (validationErrors.length > 0) return res.status(400).json({errors: validationErrors});
    
    entry_id = inputCleanser.cleanString(entry_id);
    origin = inputCleanser.cleanString(origin);
    original = inputCleanser.cleanString(original);
    examples = inputCleanser.cleanStringArray(examples);
    meanings = inputCleanser.cleanStringArray(meanings);
    categories = inputCleanser.cleanStringArray(categories);
    forms = inputCleanser.cleanStringArray(forms);
    sources = inputCleanser.cleanStringArray(sources);


    //this line is extremely important, undefined entry_id means that this is a new entry
    // not just a submission, we define entry id to be the first element of the array "forms"
    //the reason why the first element of the forms was picked as an identifier is because
    //entry id is being used in the url, and it is much cleaner if the url contains the word itself
    //however, there are edge cases when a new entry has the same spelling as another entry but
    //with different meaning, this is extremely rare and unlikely to ever happen
    //but if it does it will result in a painful bug, as two completly different entries
    //will be treated as one
    if(entryData.entry_id === undefined) entryData.entry_id = entryData.forms[0];

    try {
       const result = await submissionsRepo.insert(entryData);
       if(result.submission_id == null) throw new Error("An unknown database error has occured");
       return res.status(200).json({status: "Submitted"});
    }
    catch (err){
        console.error(err);
        return res.status(500).json({error: "Internal server error"});
    }
}



module.exports = {approve, fetch, remove, add};