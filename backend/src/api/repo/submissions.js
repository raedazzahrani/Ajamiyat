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
    throw new Error(`Failed to fetch submissions: ${err}`);
  }
}

async function insert(entryData){
  try{
    const [[[result]]] = await pool.query( "CALL insert_submission_json(?)", [JSON.stringify(entryData)]);
    return result;
  }
  catch (err){
    throw new Error(`Failed to insert submission: ${err}`);
  }
}

module.exports = {approve, fetchSubmissions: fetch, insert};