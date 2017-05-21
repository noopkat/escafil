require('dotenv').config();
const restify = require('restify');
const builder = require('botbuilder');
const requireDir = require('require-dir');
const dialogs = requireDir('./dialogs');
const fs = require('fs');
var index = fs.readFileSync('./public/index.html');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
 console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot connector
const connector = new builder.ChatConnector({
  appId: process.env.BOT_APP_ID,
  appPassword: process.env.BOT_APP_PASSWORD
});

// Create chat bot and listen to post route
const bot = new builder.UniversalBot(connector);
bot.use(builder.Middleware.sendTyping());

server.post('/api/messages', connector.listen());

server.get(/\/?.*/, restify.serveStatic({
    default: 'index.html',
    directory: './public'
}));


//=========================================================
// Bot Hooks
//=========================================================

bot.on('conversationUpdate', function(message) {
  if (message.membersAdded) {
    message.membersAdded.forEach(function (identity) {
      if (identity.id === message.address.bot.id) {
        const greeting = new builder.Message()
        .address(message.address)
        .text(":: Dome Ship to Earth network connection established. You may now type to communicate.");
        bot.send(greeting);
      }
    });
  }
});

//=========================================================
// Dialogs
//=========================================================

bot.dialog('/', dialogs.main_dialog);

for (let dialog in dialogs) {
  console.log('loading dialog: ' + dialog)
  bot.dialog(dialog, dialogs[dialog]);
}