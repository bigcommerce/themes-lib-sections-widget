const BigCommerce = require('node-bigcommerce');
const accordionTemplate = require('../widget-templates/accordion');

/**
 * Using the node-bigcommerce libary, this function runs verification with
 * Bigcommerce and renders the app landing page
 * @param {string} accessToken - Permanent access token received from client store
 * @param {string} storeHash - Unique identifier for client store
 */
module.exports = async (accessToken, storeHash) => {
  const bc = new BigCommerce({
    clientId: process.env.CLIENT_ID,
    accessToken: accessToken,
    storeHash: storeHash,
    responseType: 'json',
    apiVersion: 'v3'
  });

  try {
    await bc.post('/content/widget-templates', accordionTemplate);
  }
  catch(err) {
    console.log('Error posting widgets:', err);
  };
}
