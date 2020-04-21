const BigCommerce = require('node-bigcommerce');

const bigCommerceLoad = new BigCommerce({
  secret: process.env.SECRET,
  responseType: 'json',
  apiVersion: 'v3'
});

module.exports = (req, res, next) => {
  try {
    const data = bigCommerceLoad.verify(req.query['signed_payload']);
    res.render('welcome', { title: 'Welcome!', data: data });
  } catch (err) {
    next(err);
  }
};
