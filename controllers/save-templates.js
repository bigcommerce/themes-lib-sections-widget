const BigCommerce = require('node-bigcommerce');
const accordionTemplate = require('../widget-templates/accordion');

/**
 * Using the node-bigcommerce libary and wigets API,
 * POST or PUT a widget template
 * @param {string} accessToken - Permanent access token received from client store
 * @param {string} storeHash - Unique identifier for client store
 * @param {string} [uuid] - UUID for the widget templage
 */
module.exports = async (accessToken, storeHash, uuid) => {
  const bc = new BigCommerce({
    clientId: process.env.CLIENT_ID,
    accessToken: accessToken,
    storeHash: storeHash,
    responseType: 'json',
    apiVersion: 'v3'
  });

  try {
    const addedTemplate =
      uuid ?
      await bc.put(`/content/widget-templates/${uuid}`, accordionTemplate) :
      await bc.post('/content/widget-templates', accordionTemplate);
    return {
      'uuid': addedTemplate.data.uuid,
      'name': addedTemplate.data.name
    }
  }
  catch(err) {
    console.log('Error posting widgets:', err);
  };
}
