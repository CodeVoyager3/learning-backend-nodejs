const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),
  async execute(interactionOrMessage) {
    try {
      if (interactionOrMessage.author) {
        // message
        await interactionOrMessage.reply('Pong!');
      } else {
        // interaction
        await interactionOrMessage.reply('Pong!');
      }
    } catch (err) {
      console.error('ping command error', err);
    }
  },
};
