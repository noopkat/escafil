const builder = require('botbuilder');

module.exports = [
  (session, args, next) => {
    session.send('&lt;thank you for helping me, you are very brave.&gt;');
    setTimeout(next, 2500);
  },
  (session, args, next) => {
    session.send('&lt;humans are in grave danger of an evil parasitic race called the Yeerks&gt;');
    setTimeout(next, 4000);
  },
  (session, args, next) => {
    const yeerkCard = new builder.HeroCard(session).images([builder.CardImage.create(session, '/images/yeerk2.png')]);
    const reply = new builder.Message(session).attachments([yeerkCard]);
    session.send('&lt;here is what they look like&gt;');
    session.send(reply);
    setTimeout(next, 5500);
  },
   (session, args, next) => {
     session.send('&lt;Yeerks are an aggressive species which take over host bodies and control their every move. It\'s very unpleasant to be a host.&gt;');
    setTimeout(next, 4000);
  },
   (session, args, next) => {
    const yeerkCard = new builder.HeroCard(session).images([builder.CardImage.create(session, '/images/Yerk_inside.jpg')]);
    const reply = new builder.Message(session).attachments([yeerkCard]);
    session.send('&lt;they climb into the host\'s ear canal, and flatten themselves over the brain.&gt;');
    session.send(reply);
    setTimeout(next, 5000);
  },
  (session, args, next) => {
    session.send('&lt;the Yeerks are here, on Earth. They are already taking human hosts!&gt;');
    setTimeout(next, 4000);
  },
  (session, args, next) => {
    session.send('&lt;the Taxxons, and the Hork Bajir - both species that were fully taken by the Yeerks. This can\'t happen again!&gt;');
    setTimeout(next, 2000);
  },
  (session, args, next) => {
    builder.Prompts.confirm(session, "&lt;do you understand?&gt;");
  },
  (session, args, next) => {
    if (args.response === true) {
      session.send("&lt;Okay good. I don't have much more time. I am gravely injured and we have much to do.&gt;");
    } else {
      session.send("&lt;I'm sorry, I don't have time to explain further. I am gravely injured and we have much to do.&gt;");
    }
    setTimeout(() => { session.beginDialog('escafil_dialog') }, 3000);
  }
];
