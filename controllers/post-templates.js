const BigCommerce = require('node-bigcommerce');
const accordionTemplate = require('../widget-templates/accordion');

module.exports = (accessToken, storeHash) => {
  const bigCommercePost = new BigCommerce({
    clientId: process.env.CLIENT_ID,
    accessToken: accessToken,
    storeHash: storeHash,
    responseType: 'json',
    apiVersion: 'v3'
  });

  bigCommercePost.post('/content/widget-templates', accordionTemplate)
  .then(data => {
    console.log('Widget template pushed to store');
  })
  .catch(err => {
    console.log('Post error:', err);
  });
}
