const BigCommerce = require('node-bigcommerce');
const accordionTemplate = require('../widget-templates/accordion');
const postTemplates = require('./post-templates');

const bc = new BigCommerce({
  clientId: process.env.CLIENT_ID,
  secret: process.env.SECRET,
  callback: `${process.env.APP_URL}/auth`,
  responseType: 'json',
  apiVersion: 'v3'
});

/**
 * Using the node-bigcommerce libary, this function authorizes
 * the app to be installed on a user's store
 * @param {Object} req - Request received from server {@link https://expressjs.com/en/api.html#req}
 * @param {Object} res - Used to send a response back to the server {@link https://expressjs.com/en/api.html#res}
 */
module.exports = async (req, res) => {
  try {
    const data = await bc.authorize(req.query);
    const storeHash = data.context.slice(data.context.indexOf('/') + 1);

    await postTemplates(data.access_token, storeHash);

    res.sendStatus(200);
  } catch(err) {
    console.log(err);
    res.send(400);
  };
}
