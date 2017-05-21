const builder = require('botbuilder');

module.exports = [
  (session, args, next) => {
    session.send('&lt;I understand. I tried to save this planet, but I have failed. I still hope for humans to prevail.&gt;');
    setTimeout(next, 2500);
  },
  (session, args, next) => {
    session.send('&lt;I am gravely injured, and cannot stay conscious much longer.&gt;');
    setTimeout(() => { session.beginDialog('death_dialog') }, 2500);
  }
];
