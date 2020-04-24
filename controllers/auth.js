const BigCommerce = require('node-bigcommerce');
const { insert } = require('./db');
const saveWidget = require('./save-widget');

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
 * this function also calls logic to save widget to the db and post it to the store
 * todo: the save widget functionality will be moved to the load route when this one redirects to load on authorization success
 * @param {Object} req - Request received from server {@link https://expressjs.com/en/api.html#req}
 * @param {Object} res - Used to send a response back to the server {@link https://expressjs.com/en/api.html#res}
 */
module.exports = async (req, res) => {
  try {
    const data = await bc.authorize(req.query);
    await saveWidget(data);
    res.sendStatus(200);
  } catch(err) {
    console.log(err);
    res.send(400);
  }
}
