process.env.VUE_APP_VERSION = require('./package.json').version
process.env.VUE_APP_TITLE = require('./package.json').title

module.exports = {
  transpileDependencies: [
    'vuetify',
  ],
}
