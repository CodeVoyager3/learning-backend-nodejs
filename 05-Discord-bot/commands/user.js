const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('user').setDescription('Provides information about the user.'),
  async execute(interactionOrMessage) {
    try {
      if (interactionOrMessage.author) {
        // message
        const msg = interactionOrMessage;
        await msg.reply(`This command was run by ${msg.author.username}.`);
      } else {
        // interaction
        const interaction = interactionOrMessage;
        await interaction.reply(`This command was run by ${interaction.user.username}, who joined on ${interaction.member?.joinedAt || 'unknown'}.`);
      }
    } catch (err) {
      console.error('user command error', err);
    }
  },
};
