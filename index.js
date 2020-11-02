const { Plugin } = require('powercord/entities');
const { getModule } = require('powercord/webpack');
const { inject, uninject } = require('powercord/injector');
const Settings = require('./Settings');

module.exports = class WordFilter extends Plugin {
  async startPlugin() {
    this.loadStylesheet('style.css');

    powercord.api.settings.registerSettings('Word Filter', {
      category: this.entityID,
      label: 'Word Filter',
      render: Settings
    });

    const Message = await getModule(m => m.default && m.default.displayName === 'Message');
    inject('word-filter', Message, 'default', (args, res) => {
      const currentUser = getModule(['getCurrentUser'], false).getCurrentUser();
      const authorId = args[0]['childrenAccessories']['props']['message']["author"]["id"];
      if (authorId == currentUser["id"]) {
        return res;
      };
      const filters = this.settings.get('filteredWords');
      filters.forEach(word => {
        word = word.value
        if (word == '') {
        } else {
          const content = args[0]['childrenAccessories']['props']['message']['content'];
          if (content.includes(word)) {
            const toBlur = this.settings.get('blur', false);
            if (toBlur) {
              let className = res['props']['children']['props']['className'].concat(' filterWord');
              res['props']['children']['props']['className'] = className;
              return res;
            } else {
              res = '';
            }
          } else {
          }
        };
      });
      return res
    });

  }

  pluginWillUnload() {
    powercord.api.settings.unregisterSettings('Word Filter');
    uninject('word-filter')
  }
}