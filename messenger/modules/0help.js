const botModules = require('../modules');

module.exports = function() {
    return {
        name: 'Help',
        command: ['Help'],
        admin: false,
        description: 'Provides help about this bot.',
        function: function(response) {
            const helpHeader = 'Bot Commands' + '\n' + '-----------------';

            const helpBody1 = [];
            const commandPrefix = botModules.botCommandPrefixConceal ? 'XXX ' : '' + botModules.botCommandPrefix;
            let tempCompareValue = null;
            for (const botCommand of Object.keys(botModules.botCommandMap)) {
                const adminCommand = botModules.checkAdminCommand(botCommand);
                const checkIsAdmin = botModules.botAdmins.indexOf(response.authorId) == -1;
                if (adminCommand && checkIsAdmin) continue;

                const commandName = botModules.botCommandMap[botCommand].name;
                if (tempCompareValue !== commandName) {
                    helpBody1.push(`\n${commandName}`);
                    helpBody1.push(`- ${botModules.botCommandMap[botCommand].description}`);

                    const commandParams = botModules.botCommandMap[botCommand].params;
                    if (commandParams) helpBody1.push(`- ${botCommand} ${commandParams}`);
                }
                tempCompareValue = commandName;

                helpBody1.push(`${commandPrefix + botCommand}`);
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