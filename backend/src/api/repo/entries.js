const {pool} = require("./connection");


//returns an entry, or all entries with filters applied
async function fetchLatestApproved(entryId, offset, limit){
  try {
    const [[result]] = await pool.query(
    "CALL fetch_latest_approved_entries_aggregated(?, ?, ?);",
    [entryId, offset, limit]
    );
    const rows = result;
    return rows;
  }
  catch (err) {
    throw new Error(`Failed to fetch entries: ${err}`);
  }
}

//returns an entry, or all entries with filters applied
async function fetch(entryId){
  try {
    const [result] = await pool.query(
    "CALL fetch_aggregated(?, ?);",
    [null, entryId]
    );
    const rows = result[0];
    return rows;
  }
  catch (err) {
    throw new Error(`Failed to fetch entries: ${err}`);
  }
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
    throw new Error(`Failed to update entries: ${err}`);
  }
}

module.exports = {fetchLatestApproved, updateID, fetch};