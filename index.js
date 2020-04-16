// index.js

/**
 * Required External Modules
 */
const express = require("express");
const path = require("path");
const BigCommerce = require('node-bigcommerce');

const bigCommerce = new BigCommerce({
  clientId: 'h03xjphpztbbh9idiiop21x1y5wa6zg',
  secret: 'b088bbde548fdb9894fc73487f3cd9aac73ed481aa9b45a4745e1b85a6892a82',
  callback: 'https://3e835d61.ngrok.io/auth',
  responseType: 'json',
  apiVersion: 'v3'
});

const bigCommerceLoad = new BigCommerce({
  secret: 'b088bbde548fdb9894fc73487f3cd9aac73ed481aa9b45a4745e1b85a6892a82',
  responseType: 'json',
  apiVersion: 'v3'
});

const accordionTemplate = {
  "name": "Accordion",
	"schema": [
    {
			"type": "array",
			"label": "Accordion",
			"id": "accordionTabs",
			"defaultCount": 3,
			"entryLabel": "Tab",
			"schema": [
				{
					"type": "tab",
					"label": "Content",
          "sections": [
            {
              "settings": [
               	{
									"type": "input",
									"label": "Title",
									"id": "title",
									"default": "Title"
              	},
        				{
									"type": "code",
									"label": "Content",
									"id": "content",
									"typeMeta": {
										"placeholder": "<div>Insert content here</div>",
										"language": "html"
									}
								}
              ]
            }
          ]
				}
			]
		}
	],
  "template": "{{#each accordionTabs}}<h1>title:{{title}}</h1><div>content:{{{content}}}</div>{{/each}}"
}



/**
 * App Variables
 */
const app = express();
const port = process.env.PORT || "8000";
let accessToken = '';
/**
 *  App Configuration
 */
app.set('view engine', 'hbs');
/**
 * Routes Definitions
 */
app.get("/", (req, res) => {
  res.status(200).send("WHATABYTE: Food For Devs");
});

app.get('/auth', (req, res, next) => {
  bigCommerce.authorize(req.query).then(data => {
    accessToken = data.access_token;

    const bigCommercePost = new BigCommerce({
      clientId: 'h03xjphpztbbh9idiiop21x1y5wa6zg',
      accessToken: accessToken,
      storeHash: 'rwn0dz',
      responseType: 'json',
      apiVersion: 'v3'
    });

    bigCommercePost.post('/content/widget-templates', accordionTemplate)
      .then(data => {
        console.log('great success');
      })
      .catch(err => {
        console.log('post error', err);
      });

      res.render('auth', { title: 'Authorized!', data: data });
    })
    .catch(next => {console.log(next)});
  });

  app.get('/load', (req, res, next) => {
    try {
      const data = bigCommerceLoad.verify(req.query['signed_payload']);
      res.render('welcome', { title: 'Welcome!', data: data });
    } catch (err) {
      next(err);
    }
  });

/**
 * Server Activation
 */
app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});
