const botModules = require('../modules');
const utils = require('../utils');

module.exports = function(bot) {
    return {
        name: 'Help',
        command: ['Help'],
        admin: false,
        description: 'Provides help about this bot.',
        customRandomize: true,
        function: function(response) {
            const botString = bot.commandRandomize
                ? utils.capitalizeFirstLetter(utils.randomString(3))
                : 'Bot';
            const helpHeader = `${botString} Commands` + '\n' + '-----------------';

            const helpBody1 = [];
            if (bot.commandConceal) helpBody1.push('*The first word of the command can be anything.');
            const concealString = bot.commandRandomize
                ? utils.randomString(3).toUpperCase()
                : 'XXX';
            const commandPrefix = bot.commandConceal
                ? `${concealString} ` + bot.commandPrefix
                : bot.commandPrefix;
            let tempCompareValue = null;
            for (const _botCommand of Object.keys(botModules._botCommands)) {
                const botCommand = _botCommand.toLowerCase();

                const adminCommand = botModules.checkAdminCommand(botCommand);
                const checkIsAdmin = bot.admins.indexOf(response.authorId) == -1;
                if (adminCommand && checkIsAdmin) continue;

                const commandName = botModules.botCommandMap[botCommand].name;
                if (tempCompareValue !== commandName) {
                    helpBody1.push(`\n${commandName}`);
                    helpBody1.push(`- ${botModules.botCommandMap[botCommand].description}`);

                    const commandParams = botModules.botCommandMap[botCommand].params;
                    if (commandParams) helpBody1.push(`= ${_botCommand} ${commandParams}`);
                }
                tempCompareValue = commandName;

                helpBody1.push(`${commandPrefix} ${_botCommand}`);
            }

            const helpBody2 = [];
            for (const botModule in botModules.botModules) {
                if (!botModules.botModules[botModule].listen) continue;

                helpBody2.push(`${botModules.botModules[botModule].name}`);
            }

            return `${helpHeader}\n${helpBody1.join('\n')}\n\nListen Modules: ${helpBody2.join(', ')}.`;
        },
    };
};