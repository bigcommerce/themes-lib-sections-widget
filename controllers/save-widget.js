const saveTemplates = require('./save-templates');
const { retrieve } = require('./db');

/**
 * Wrapper function to post templates to store and insert store and widget
 * data into database
 * todo: abstract out store info functionality
 * todo: update widget if it exists
 * @param {Object} data - data returned from the authorization of the app
 */
saveWidget = async (data) => {
  // const WIDGET_TEMPLATES = [
  //   'Accordion'
  //   ...
  // ];

  try {
    const storeHash = data.context.slice(data.context.indexOf('/') + 1);
    const savedTemplate = await retrieve('widget_templates', ['name', 'hash'], ['Accordion', storeHash], 2);

    /*
    * Update retrieve logic to use multiple conditions
    */

    if (savedTemplate.length === 0) {
      const postedWidget = await saveTemplates(data.access_token, storeHash);

      await insert(
        'widget_templates',
        ['hash', 'uuid', 'name'],
        [storeHash, postedWidget.uuid, postedWidget.name]
      );
    } else {
      const templateUuid = savedTemplate[0].uuid;

      const postedWidget = await saveTemplates(data.access_token, storeHash, templateUuid);
    }
  } catch(err) {
    console.log(err.stack);
  }
}

module.exports = saveWidget;
