const {pool} = require("./connection");

async function approve(submissionId){
    try{
        const [result] = await pool.query("CALL approve_submission(?);", [submissionId]);
        return result[0][0];
    }
    catch (err){
        throw err;
    }
}

//returns a submission, or all submissions with filters applied
async function fetch(submissionId){
  try {
    const [result] = await pool.query(
    "CALL fetch_aggregated(?, ?);",
    [submissionId, null]
    );
    const rows = result[0];
    return rows;
  }
  catch (err) {
    console.error("Failed to fetch submissions");
    throw err;
  }
}

async function insert(entryData){
  try{
    const [[[result]]] = await pool.query( "CALL insert_submission_json(?)", [JSON.stringify(entryData)]);
    return result;
  }
  catch (err){
    console.error("Failed to insert submission");
    throw err;
  }
}

module.exports = {approve, fetch, insert};