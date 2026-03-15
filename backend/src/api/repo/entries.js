const {pool} = require("./connection");


//returns an entry, or all entries with filters applied
async function fetchAllLatestApproved(optionalParams){
  try{
    const {searchTerm, offset, limit} = optionalParams;
    return await fetch({searchTerm, offset, limit});
  }
  catch (err) {
    console.error("Failed to fetch entries");
    throw err;
  }
}

async function fetchLatestApproved(entryId){
  try{
    const result = await fetch({entryId});
    return result[0];
  }
  catch (err) {
    console.error("Failed to fetch entry with ID " + entryId);
    throw err;
  }
}

//returns an entry, or all entries with filters applied
async function fetch(optionalParams){
  const {entryId, searchTerm, offset, limit} = optionalParams;
  const [result] = await pool.query(
    "CALL fetch_aggregated(?, ?, ?, ?, ?, ?);",
    [null, entryId, true, searchTerm, offset, limit]
    );
  const rows = result;
  return rows;
}


//returns the entry_id of all rows in the database with the new entry_id after checking that there is no conflict
async function updateID(oldEntryId, newEntryID){
  try {
    const [[[result]]] = await pool.query(
    "CALL update_entry_id(?, ?);",
    [oldEntryId, newEntryID]
    );
    return result;
  }
  catch (err) {
    console.error("Failed to update entry ID");
    throw err;
  }
}

module.exports = {fetchLatestApproved, fetchAllLatestApproved, updateID};