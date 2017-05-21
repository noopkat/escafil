const builder = require('botbuilder');

module.exports = [
  (session, args, next) => {
    session.send('&lt;I feel-&gt;');
    setTimeout(next, 1000);
  },
  (session, args, next) => {
    session.send(":: Dome Ship to Earth network connection disconnected.");
    setTimeout(() => { session.beginDialog('game_over_dialog') }, 3000);
  }
];