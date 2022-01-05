const botUtils = require('./utils');
const { generateSlug } = require('random-word-slugs');
const fs = require('fs');
const path = require('path');

const _botModulesName = [];
fs.readdirSync(path.join(__dirname, 'modules')).forEach(file => {
    const fileExtension = path.extname(file);
    if (fileExtension === '.js') {
        _botModulesName.push(path.basename(file, fileExtension));
    }
});

const botModules = {};
const initialize = async (bot) => {
    for (const botModule of _botModulesName) {
        try {
            const botModulePath = path.join(__dirname, 'modules', botModule);
            botModules[botModule] = require(botModulePath)(bot);
        } catch (err) {
            console.error('Bot couldn\'t load ' + `${botModule} module`);
            console.error(err);
        }
    }
};

const _botCommands = {};
const botCommandMap = {};
const preLoad = async () => {
    for (const botModule in botModules) {
        if (botModules[botModule].onPreLoad) botModules[botModule].onPreLoad();

        if (!botModules[botModule].command) continue;

        for (const command of botModules[botModule].command) {
            _botCommands[command] = null;

            botCommandMap[command.toLowerCase()] = botModules[botModule];
        }
    }
};

const postLoad = async () => {
    for (const botModule in botModules) {
        if (botModules[botModule].onFinishLoad) botModules[botModule].onFinishLoad();
    }
};

const configure = async function(bot, options) {
    if (options.admins) bot.admins.push(...options.admins);

    if (options.commandPrefix) bot.commandPrefix = options.commandPrefix;

    if (options.commandRandomize) bot.commandRandomize = options.commandRandomize;

    if (options.commandConceal) bot.commandConceal = options.commandConceal;
};

const checkAdminCommand = function(command) {
    return botCommandMap[command].admin;
};

const listen = async function(bot, response) {
    for (const botModule in botModules) {
        if (!botModules[botModule].listen) continue;

        if (botModules[botModule].admin && !bot.admins.includes(response.sender)) continue;

        const moduleResponse = await botModules[botModule].function(response);
        if (moduleResponse) bot.delayedSendMessage(response.thread, moduleResponse);
    }

    return await command(bot, response);
};

const command = async function(bot, response) {
    const message = response.body;

    if (bot.commandConceal
        ? message.split(' ')[1]?.toLowerCase().startsWith(bot.commandPrefix.toLowerCase())
        : message.toLowerCase().startsWith(bot.commandPrefix.toLowerCase())
    ) {
        if (bot.uid === response.sender) return false;

        const botCommand = bot.commandConceal
            ? message.split(' ')[2].toLowerCase()
            : message.split(' ')[1].toLowerCase();
        if (botCommand in botCommandMap) {
            const threadID = response.thread;

            if (checkAdminCommand(botCommand) && !bot.admins.includes(response.sender)) {
                bot.delayedSendMessage(threadID, 'You don\'t have permission to run this command!');

                return true;
            }

            try {
                const slices = bot.commandConceal ? 3 : 2;
                const params = message.split(' ').length >= slices
                    ? message.replace(new RegExp('^([^ ]+ ){' + slices + '}'), '')
                    : '';
                const commandResponse = await botCommandMap[botCommand].function(response, params);
                if (commandResponse) {
                    const commandMessage = (bot.commandRandomize && !botCommandMap[botCommand].customRandomize)
                        ? `${botUtils.capitalizeFirstLetter(generateSlug(1))} ` + commandResponse
                        : commandResponse;
                    bot.delayedSendMessage(threadID, commandMessage);

                    return true;
                }
            } catch (err) {
                console.error('Bot command ' + `${botCommand} error!`);
                console.error(err);

                return false;
            }
        }

        return true;
    }

    return false;
};

module.exports = {
    initialize,
    preLoad,
    postLoad,
    configure,
    listen,
    botModules,
    _botCommands,
    botCommandMap,
    checkAdminCommand,
};