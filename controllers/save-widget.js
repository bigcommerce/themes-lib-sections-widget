const postTemplates = require('./post-templates');

/**
 * Wrapper function to post templates to store and insert store and widget
 * data into database
 * todo: abstract out store info functionality
 * todo: update widget if it exists
 * @param {Object} data - data returned from the authorization of the app
 */
saveWidget = async (data) => {
  try {
    const storeHash = data.context.slice(data.context.indexOf('/') + 1);

    const postedWidget = await postTemplates(data.access_token, storeHash);

    await insert(
      'widget_templates',
      ['hash', 'uuid', 'name'],
      [storeHash, postedWidget.uuid, postedWidget.name]
    );
  } catch(err) {
    console.log(err.stack);
  }
}

module.exports = saveWidget;
