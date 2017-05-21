const builder = require('botbuilder');

module.exports = [
  (session, args, next) => {
    builder.Prompts.confirm(session, "Game over. Would you like to try again?");
  },
  (session, args, next) => {
    if (args.response === true) {
      session.send('Ok, reconnecting you now...');
      setTimeout(() => {
        session.send(":: Dome Ship to Earth network connection established. You may now type to communicate.");
        session.beginDialog('/');
      }, 3000);
      
    } else {
      session.endDialog('Ok. You may close this window.');
    }
  }
];