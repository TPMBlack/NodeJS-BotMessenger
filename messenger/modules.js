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

const _botCommandName = [];
const botCommandMap = {};
const preLoad = async () => {
    for (const botModule in botModules) {
        if (botModules[botModule].onPreLoad) botModules[botModule].onPreLoad();

        if (!botModules[botModule].command) continue;

        for (const command of botModules[botModule].command) {
            _botCommandName.push(command);

            botCommandMap[command.toLowerCase()] = botModules[botModule];
        }
    }
};

const botAdmins = [];
let botCommandPrefix = '/TPB';
let botCommandPrefixConceal = false;

const postLoad = async () => {
    for (const botModule in botModules) {
        if (botModules[botModule].onFinishLoad) botModules[botModule].onFinishLoad();
    }
};

const configure = async function(options) {
    if (options.admins) {
        botAdmins.push(...options.admins);
    }

    if (options.commandPrefix) {
        botCommandPrefix = options.commandPrefix;
    }

    if (options.commandPrefixConceal) {
        botCommandPrefixConceal = options.commandPrefixConceal;
    }
};

const checkAdminCommand = function(command) {
    return botCommandMap[command].admin;
};

const listen = async function(bot, response) {
    for (const botModule in botModules) {
        if (!botModules[botModule].listen) continue;

        if (botModules[botModule].admin && !botAdmins.includes(response.sender)) continue;

        const moduleResponse = await botModules[botModule].function(response);
        if (moduleResponse) bot.delayedSendMessage(response.thread, moduleResponse);
    }

    command(bot, response);
};

const command = async function(bot, response) {
    const message = response.body;

    if (!botCommandPrefixConceal
        ? message.toLowerCase().startsWith(botCommandPrefix.toLowerCase())
        : message.split(' ')[1].toLowerCase().startsWith(botCommandPrefix.toLowerCase())
    ) {
        if (bot.uid === response.sender) return;

        const botCommand = !botCommandPrefixConceal
            ? message.split(' ')[1].toLowerCase()
            : message.split(' ')[2].toLowerCase();
        if (botCommand in botCommandMap) {
            const threadID = response.thread;

            if (checkAdminCommand(botCommand) && !botAdmins.includes(response.sender)) {
                bot.delayedSendMessage(threadID, 'You don\'t have permission to run this command!');

                return;
            }

            try {
                const slices = !botCommandPrefixConceal ? 2 : 3;
                const params = message.split(' ').length >= slices
                    ? message.replace(new RegExp('^([^ ]+ ){' + slices + '}'), '')
                    : '';
                const commandResponse = await botCommandMap[botCommand].function(response, params);
                if (commandResponse) {
                    bot.delayedSendMessage(threadID, commandResponse);

                    return;
                }
            } catch (err) {
                console.error('Bot command ' + `${botCommand} error!`);
                console.error(err);

                return;
            }
        }

        return;
    }
};

module.exports = {
    initialize,
    preLoad,
    postLoad,
    configure,
    listen,
    botModules,
    _botCommandName,
    botCommandMap,
    botAdmins,
    botCommandPrefix,
    botCommandPrefixConceal,
    checkAdminCommand,
};