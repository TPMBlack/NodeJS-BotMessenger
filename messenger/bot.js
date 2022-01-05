const Bot = require('facebook-messenger-puppeteer');
const botModules = require('./modules');
const botUtils = require('./utils');
const fs = require('fs');
const path = require('path');

const _botAppState = path.join(__dirname, '.appstate.json');
const messenger = new Bot({
    selfListen: true,
    session: fs.existsSync(_botAppState) ? JSON.parse(fs.readFileSync(_botAppState, 'utf8')) : null,
    //debug: true
});
botModules.initialize(messenger);

const startBot = async (username, password, options) => {
    console.log('Bot loading...');

    try {
        await messenger.login(username, password, options.puppeteer);

        fs.writeFileSync(_botAppState, JSON.stringify(await messenger.getSession()));

        // Modules Configuration
        await botModules.configure(messenger, options.modules);

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
        if (await botModules.listen(messenger, response)) return;

        // Read Other Message
        if (messenger.uid !== response.sender) await messenger.delayedReadMessage(response.thread);
    });

    // Modules Post Load
    botModules.postLoad();

    console.log('Bot loading complete.');
};

messenger.admins = [];
messenger.commandPrefix = '/TPB';
messenger.commandRandomize = false;
messenger.commandConceal = false;

messenger.delayedReadMessage = async function(threadID) {
    await botUtils.sleep(1000);

    console.log('Bot reading ' + `"${threadID}"`);

    await messenger.readMessage(threadID);
};

messenger.delayedSendMessage = async function(threadID, message) {
    await botUtils.sleep(1500);

    console.log('Bot sending ' + `"${message}" to "${threadID}".`);

    await messenger.sendMessage(threadID, message);
};

module.exports = { startBot };