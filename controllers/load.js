const BigCommerce = require('node-bigcommerce');
const { retrieve } = require('./db');
const saveWidgets = require('./save-widgets');

const bc = new BigCommerce({
  secret: process.env.SECRET,
  responseType: 'json',
  apiVersion: 'v3'
});

/**
 * Using the node-bigcommerce libary, this function runs verification with
 * Bigcommerce and redirects to app landing page
 * @param {Object} req - Request sent from server {@link https://expressjs.com/en/api.html#req}
 * @param {Object} res - Used to send a response back to the server and render page {@link https://expressjs.com/en/api.html#res}
 */
module.exports = async (req, res, next) => {
  try {
    const data = bc.verify(req.query['signed_payload']);
    const storeHash = data.context.slice(data.context.indexOf('/') + 1);
    const storeInfo = await retrieve('stores', 'hash', storeHash);

    const savedWidgets = await saveWidgets(storeInfo[0].access_token, storeHash);

    res.render('welcome', { savedWidgets: savedWidgets });
  } catch(err) {
    console.log(err);
    res.send(400);
  };
};
