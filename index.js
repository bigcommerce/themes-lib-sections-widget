// index.js
require('dotenv').config()

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
/**
 *  App Configuration
 */
app.set('view engine', 'hbs');
/**
 * Routes Definitions
 */
app.get("/", (req, res) => {
  res.status(200).send("Sections Widget Home");
});

app.get('/auth', (req, res, next) => {
  bigCommerceAuth.authorize(req.query).then(data => {
    const storeHash = data.context.slice(data.context.indexOf('/') + 1);
    // TODO: save store hash, permanent access token in db for future
    const bigCommercePost = new BigCommerce({
      clientId: clientId,
      accessToken: data.access_token,
      storeHash: storeHash,
      responseType: 'json',
      apiVersion: 'v3'
    });

    // todo: move this into load(between verify and success message display)
    bigCommercePost.post('/content/widget-templates', accordionTemplate)
      .then(data => {
        console.log('Widget template pushed to store');
      })
      .catch(err => {
        console.log('Post error:', err);
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
