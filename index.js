require('dotenv').config()
// index.js

/**
 * Required External Modules
 */
const express = require("express");
const path = require("path");
const BigCommerce = require('node-bigcommerce');
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

const bigCommerceLoad = new BigCommerce({
  secret: secret,
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
  bigCommerceAuth.authorize(req.query).then(data => {
    accessToken = data.access_token;

    const bigCommercePost = new BigCommerce({
      clientId: clientId,
      accessToken: accessToken,
      storeHash: 'rwn0dz', // TODO save this from data
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
