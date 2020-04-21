const BigCommerce = require('node-bigcommerce');
const accordionTemplate = require('../widget-templates/accordion');

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
