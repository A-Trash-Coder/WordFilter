const { Plugin } = require('powercord/entities');
const { getModule } = require('powercord/webpack');
const { inject, uninject } = require('powercord/injector');
const Settings = require('./Settings');

module.exports = class WordFilter extends Plugin {
  async startPlugin() {

    powercord.api.settings.registerSettings('Word Filter', {
      category: this.entityID,
      label: 'Word Filter',
      render: Settings
    });

    const Message = await getModule(m => m.default && m.default.displayName === 'Message');
    inject('word-filter', Message, 'default', (args, res) => {
      const filters = this.settings.get('filteredWords');
      filters.forEach(word => {
        word = word.value
        if (word == '') {
        } else {
          if (args[0]['childrenAccessories']['props']['message']['content'].includes(word)) {
            res = '';
          } else {
          }
        };
      });
      return res
    });

  }

  pluginWillUnload() {
    uninject('word-filter')
  }
}