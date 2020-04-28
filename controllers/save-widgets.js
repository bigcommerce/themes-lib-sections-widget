const saveTemplates = require('./save-templates');
const { retrieve } = require('./db');

// TODO: obviously this will be updated with real widgets
const accordionTemplate = require('../widget-templates/accordion');
const testTemplate = require('../widget-templates/test');
const WIDGET_TEMPLATES = [
  accordionTemplate,
  testTemplate
];
/**
 * Wrapper function to post widget templates to the store and into the db
 *
 * @param {string} accessToken - Permanent access token issued by BigC
 * @param {string} storeHash - hash value related to store
 * @returns {array} - an array of objects with name and uuid
 */
saveWidgets = async (accessToken, storeHash) => {
  try {
    const savedTemplates = await Promise.all(WIDGET_TEMPLATES.map(async template => {
      const savedTemplate = await retrieve('widget_templates', ['name', 'hash'], [template.name, storeHash], 2);

      // If template doesn't exist in our db, add to store and db
      // else update it on store
      if (savedTemplate.length === 0) {
        const postedWidget = await saveTemplates(accessToken, storeHash, template);

        await insert(
          'widget_templates',
          ['hash', 'uuid', 'name'],
          [storeHash, postedWidget.uuid, postedWidget.name]
        );
        return postedWidget;
      } else {
        const templateUuid = savedTemplate[0].uuid;

        const postedWidget = await saveTemplates(accessToken, storeHash, template, templateUuid);
        return postedWidget;
      }
    }));
    return savedTemplates;
  } catch(err) {
    console.log(err.stack);
  }
}

module.exports = saveWidgets;
