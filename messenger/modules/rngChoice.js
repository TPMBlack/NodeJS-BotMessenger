module.exports = function() {
    return {
        name: 'Choices',
        command: ['Choice'],
        admin: false,
        description: 'Bot make choice for you.',
        function: function(response, params) {
            if (!params) throw Error('You must input the choices!');

            const list = params.split(' ');
            return 'Bot has chosen "' + list[Math.floor(Math.random() * list.length)] + '"!';
        },
    };
};