module.exports = function() {
    return {
        name: 'Ping',
        command: ['Ping'],
        admin: false,
        description: 'Bot health status check.',
        function: () => 'Pong!',
    };
};