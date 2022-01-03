module.exports = function() {
    return {
        name: 'Random Number',
        command: ['RN', 'Togel'],
        params: '(Min Num) (Max Num)',
        admin: false,
        description: 'Random number from range.',
        function: function(response, params) {
            if (!params) throw Error('You must input the number range!');

            const list = params.split(' ');
            const lb = Number(list[0]);
            const ub = Number(list[1]);

            if (isNaN(lb) || isNaN(ub) || ub < lb) throw Error('You not correctly input the number range!');

            return 'Bot has chosen "' + (Math.floor(Math.random() * (ub - lb + 1)) + lb) + '"!';
        },
    };
};