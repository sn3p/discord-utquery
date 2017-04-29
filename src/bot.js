import discord from 'discord.js';
import logger from 'winston';

class Bot {
  constructor(options) {
    this.token = options.token;
    this.prefix = options.prefix;
    this.discord = new discord.Client();
  }

  connect() {
    logger.info('Connecting to Discord');
    this.discord.login(this.token);
    this.attachListeners();
  }

  attachListeners() {
    this.discord.on('ready', () => {
      logger.info('Connected to Discord');
    });

    // TODO: this doesn't trigger when a message is edited
    this.discord.on('message', this.parseMessage.bind(this));

    this.discord.on('error', error => {
      logger.error('Received error event from Discord', error);
    });

    this.discord.on('warn', warning => {
      logger.warn('Received warn event from Discord', warning);
    });
  }

  parseMessage(message) {
    // Ignore messages sent by the bot itself
    if (message.author.id === this.discord.user.id) {
      return;
    }

    // Parse command and arguments
    if (message.content.startsWith(this.prefix)) {
      const content = message.content.toLowerCase();
      const args = content.trim().split(/\s+/);
      const command = args.shift().substr(1);

      if (command.length) {
        this.command(command, args, message);
      }
    }
  }

  /**
   * Command
   */
  command(command, args, message) {
    switch (command) {
      case 'stats': {
        this.stats(args, message);
        break;
      }
    }
  }

  /**
   * Stats command
   */
  stats(args, message) {
    message.channel.sendMessage('test');
  }
}

export default Bot;
