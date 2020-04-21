const BigCommerce = require('node-bigcommerce');
const accordionTemplate = require('../widget-templates/accordion');
const postTemplates = require('./post-templates');

const clientId = process.env.CLIENT_ID;
const secret = process.env.SECRET;
const appUrl = process.env.APP_URL;

const bigCommerceAuth = new BigCommerce({
  clientId: clientId,
  secret: secret,
  callback: `${appUrl}/auth`,
  responseType: 'json',
  apiVersion: 'v3'
});

module.exports = (req, res, next) => {
  bigCommerceAuth.authorize(req.query).then(async data => {
    const storeHash = data.context.slice(data.context.indexOf('/') + 1);

    await postTemplates(data.access_token, storeHash);
  })
  .then(() => {
    res.send(200);
  })
  .catch(next => {console.log(next)});
}
