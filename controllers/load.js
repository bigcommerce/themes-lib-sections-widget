const BigCommerce = require('node-bigcommerce');

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
module.exports = (req, res, next) => {
  try {
    const data = bc.verify(req.query['signed_payload']);
    res.render('welcome', { title: 'Welcome!', data: data });
  } catch(err) {
    console.log(err);
    res.send(400);
  };
};
