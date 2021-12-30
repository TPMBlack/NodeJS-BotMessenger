'use strict';

const bot = require('./messenger/bot');
const { username, password, options } = require('./config.json');

bot.startBot(username, password, options);