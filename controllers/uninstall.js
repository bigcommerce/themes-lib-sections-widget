const BigCommerce = require('node-bigcommerce');
const { remove } = require('./db');

const bc = new BigCommerce({
  secret: process.env.SECRET,
  responseType: 'json',
  apiVersion: 'v3'
});

/**
 * Using the node-bigcommerce libary, this function removes info from database
 *
 * @param {Object} req - Request sent from server {@link https://expressjs.com/en/api.html#req}
 * @param {Object} res - Used to send a response back to the server and render page {@link https://expressjs.com/en/api.html#res}
 */
module.exports = async (req, res, next) => {
  try {
    const data = bc.verify(req.query['signed_payload']);

    await remove('stores', 'hash', data.store_hash);

    res.status(200).send('App has been uninstalled');
  } catch(err) {
    console.log(err);
    res.send(400);
  };
};
