module.exports = function() {
    return {
        name: 'LMGTFY',
        command: ['LMGTFY', 'Gugulu'],
        params: '(Keywords)',
        admin: false,
        description: '( ͡° ͜ʖ ͡°) Let Bot Google That For You.',
        function: function(respone, params) {
            if (!params) throw Error('You must input the keywords!');

            return 'https://lmgtfy.app/?q=' + encodeURIComponent(params);
        },
    };
};