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
            let tempCompareValue = null;
            for (const botCommand of Object.keys(botModules.botCommandMap)) {
                const adminCommand = botModules.checkAdminCommand(botCommand);
                const checkIsAdmin = botModules.botAdmins.indexOf(response.authorId) == -1;
                if (adminCommand && checkIsAdmin) continue;

                if (tempCompareValue !== botModules.botCommandMap[botCommand].name) {
                    helpBody1.push(`${'\n' + botModules.botCommandMap[botCommand].name}`);
                    helpBody1.push(`${'- ' + botModules.botCommandMap[botCommand].description}`);
                }
                tempCompareValue = botModules.botCommandMap[botCommand].name;

                helpBody1.push(`${botModules.botCommandPrefix} ${botCommand}`);
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