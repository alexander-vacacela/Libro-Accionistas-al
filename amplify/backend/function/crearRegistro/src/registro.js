const { getQldbDriver } = require('./connetLedger');
const Log = require('@dazn/lambda-powertools-logger');
const LicenceNotFoundError = require('./LicenceNotFoundError');


/**
 * Helper function to retrieve the current state of a licence record
 * @param id The document id of the document to retrieve
 * @returns The JSON document to return to the client
 */
 const getLicence = async (licenceId) => {
    Log.debug(`In getLicence function with licenceId ${licenceId}`);
  
    let licence;
    // Get a QLDB Driver instance
    const qldbDriver = await getQldbDriver();
    await qldbDriver.executeLambda(async (txn) => {
      // Get the current record
      const result = await getLicenceRecordById(txn, licenceId);
      const resultList = result.getResultList();
  
      if (resultList.length === 0) {
        throw new LicenceNotFoundError(400, 'Licence Not Found Error', `Licence record with licenceId ${licenceId} does not exist`);
      } else {
        licence = JSON.stringify(resultList[0]);
      }
    });
    return licence;
  };


  /**
 * Helper function to get the latest revision of document by document Id
 * @param txn The {@linkcode TransactionExecutor} for lambda execute.
 * @param id The document id of the document to retrieve
 * @returns The Result from executing the statement
 */
async function getLicenceRecordById(txn, id) {
    Log.debug('In getLicenceRecordById function');
    //const query = 'SELECT * FROM BicycleLicence AS b WHERE b.licenceId = ?';
    const query = 'SELECT * FROM Favourite';
    return txn.execute(query, id);
  }


  module.exports = {
    //createLicence,
    //updateLicence,
    getLicence,
    //getLicenceHistory,
    //updateContact,
    //deleteLicence,
  };