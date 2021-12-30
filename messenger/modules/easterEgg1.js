module.exports = function() {
    return {
        name: 'Easter Egg 1',
        listen: true,
        admin: false,
        function: function(response) {
            if (/(?:Indo)?Oreno(?:_69)?/gi.test(response.body)) {
                return '🤔';
            }

            if (/(?:reren(?:152)?|rurin)/gi.test(response.body)) {
                return '🤔';
            }
        },
    };
};