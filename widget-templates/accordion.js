module.exports = {
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
