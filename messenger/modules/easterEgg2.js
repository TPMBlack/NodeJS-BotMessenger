module.exports = function(bot) {
    return {
        name: 'Easter Egg 2',
        listen: true,
        admin: false,
        function: function(response) {
            if (bot.uid === response.sender) return;

            if (/^I see(?: ?..)?$/gi.test(response.body)) {
                const listMessage = ['OwO', 'I see :V'];

                return listMessage[Math.floor(Math.random() * listMessage.length)];
            }

            if (/^UwU$/g.test(response.body)) return '( \'ω\' )';
        },
    };
};