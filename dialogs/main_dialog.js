const builder = require('botbuilder');

module.exports = [
  (session, args, next) => {
    session.send('&lt;Greetings, human. My name is Elfangor-Sirinial-Shamtul. I am an Andalite.&gt;');
    setTimeout(next, 2500);
  },
  (session, args, next) => {
    session.send('&lt;my Dome ship was severely damaged and I have crashed to Earth. I don\'t have much time&gt;');
    setTimeout(next, 2500);    
  },
  (session, args, next) => {
    builder.Prompts.confirm(session, '&lt;will you assist me with something of great importance to the survival of your entire race and planet?&gt;');
  },
  (session, args, next) => {
    if (args.response === true) {
      session.beginDialog('yes_help_dialog');
    } else {
      session.beginDialog('no_help_dialog');
    }
  },
];
