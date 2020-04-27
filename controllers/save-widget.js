const postTemplates = require('./post-templates');
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
  // ];

  try {
    const storeHash = data.context.slice(data.context.indexOf('/') + 1);
    const savedTemplate = await retrieve('widget_templates', ['name', 'hash'], ['Accordion', storeHash], 2);
    console.log(savedTemplate);
    /*
    * Update retrieve logic to use multiple conditions
    */
    // const postedWidget = await postTemplates(data.access_token, storeHash);


    // await insert(
    //   'widget_templates',
    //   ['hash', 'uuid', 'name'],
    //   [storeHash, postedWidget.uuid, postedWidget.name]
    // );

  } catch(err) {
    console.log(err.stack);
  }
}

module.exports = saveWidget;
