const Bot = require('facebook-messenger-puppeteer');
const botModules = require('./modules');
const fs = require('fs');
const path = require('path');

const _botAppState = path.join(__dirname, '.appstate.json');
const messenger = new Bot({
    selfListen: true,
    session: fs.existsSync(_botAppState) ? JSON.parse(fs.readFileSync(_botAppState, 'utf8')) : null,
    //debug: log.level === 'verbose' ? true : false
});
botModules.initialize(messenger);

const startBot = async (username, password, options) => {
    console.log('Bot loading...');

    try {
        await messenger.login(username, password, options.puppeteer);

        fs.writeFileSync(_botAppState, JSON.stringify(await messenger.getSession()));

        // Modules Configuration
        await botModules.configure(options.modules);

        // Modules Pre Load
        await botModules.preLoad();

        console.log('Bot login successfully');
    } catch (err) {
        console.error('Bot load error!');
        console.error(err);
    }

    // Listen
    messenger.listen(async response => {
        console.log('Bot listen response: ' + JSON.stringify(response));

        // Modules
        botModules.listen(messenger, response);

        // Read Other Message
        messenger.delayedReadMessage(response.thread);
    });

    // Modules Post Load
    botModules.postLoad();

    console.log('Bot loading complete.');
};

messenger.delayedReadMessage = async function(threadID) {
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('Bot reading ' + `"${threadID}"`);

    await messenger.readMessage(threadID);
};

messenger.delayedSendMessage = async function(threadID, message) {
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log('Bot sending ' + `"${message}" to "${threadID}".`);

    await messenger.sendMessage(threadID, message);
};

module.exports = { startBot };