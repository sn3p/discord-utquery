import discord from 'discord.js';
import dgram from 'dgram';
import logger from 'winston';

class Bot {
  constructor(options) {
    this.token = options.token;
    this.prefix = options.prefix;
    this.discord = new discord.Client();
    this.socket = dgram.createSocket('udp4');
  }

  connect() {
    logger.info('Connecting to Discord ...');
    this.discord.login(this.token);
    this.attachListeners();
  }

  attachListeners() {
    this.discord.on('ready', () => {
      logger.info('Connected to Discord');
    });

    this.discord.on('message', this.parseMessage.bind(this));

    this.discord.on('error', error => {
      logger.error('Received error event from Discord', error);
    });

    this.discord.on('warn', warning => {
      logger.warn('Received warn event from Discord', warning);
    });

    this.socket.on('message', this.onSocketMessage.bind(this));

    this.socket.on('error', function (error) {
      console.log('client error: \n' + error.stack);
    });

    this.socket.on('close', function () {
      console.log('closed.');
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
      case 'q':
      case 'query': {
        this.q(args, message);
        break;
      }
    }
  }

  /**
   * Query command
   */
  q(args, message) {
    // Validate host
    if (args.lengt < 1 || args[0].length < 4) {
      return;
    }

    let [host, port] = args[0].split(':');
    port = port || 7777;

    // Should find a different way...
    this.message = message;

    // https://wiki.beyondunreal.com/Legacy:UT_Server_Query
    const command = '\\status\\';
    // const command = '\\basic\\\\info\\\\rules\\\\players\\';
    // const command = '\\players\\';
    // const command = '\\gamestatus\\';
    // const command = Buffer.from('\\basic\\');

    this.socket.send(command, port, host, error => {
    // this.socket.send(command, 0, command.lenght, port, host, error => {
      // if (error) {
      //   logger.error(error);
      //   return;
      // }

      // this.socket.close();
      logger.info('UDP message sent to ' + host + ':' + port);
    });
  }

  onSocketMessage(message, remote) {
    // logger.info(message);
    console.log(message);
    this.message.channel.sendMessage('```' + message + '```');
  }
}

export default Bot;
