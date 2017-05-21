const builder = require('botbuilder');

module.exports = [
  (session, args, next) => {
    session.send('&lt;you now have morphing powers - a secret Andalite technology.&gt;');
    setTimeout(next, 2500);
  },
  (session, args, next) => {
    session.send('&lt;to morph into another being, you must "acquire" their DNA first. Touch an animal and think deeply about "being" that animal. The DNA will then be acquired.&gt;');
    setTimeout(next, 4000);
  },
  (session, args, next) => {
    session.send('&lt;the morphing power is the only chance you have at defeating the Yeerks.&gt;');
    setTimeout(next, 2500);
  },
  (session, args, next) => {
    session.send('&lt;I must warn you of something very important! Do not remain in morph for more than two hours at a time. If you do, you\'ll become a Nothlit. Stuck that way forever.&gt;');
    setTimeout(next, 4000);
  },
  (session, args, next) => {
    session.send('&lt;Be strong. Have courage.&gt;');
    setTimeout(next, 2500);
  },
  (session, args, next) => {
    session.send('&lt;I am very weak, I will die here on Earth. Millions of light years away from the Andalite home planet..&gt;');
    setTimeout(next, 3000);
  },
  (session, args, next) => {
    session.send('&lt;--my home--&gt;');
    setTimeout(() => { session.beginDialog('death_dialog') }, 4000);
  }
];
