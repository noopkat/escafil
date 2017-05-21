var builder = require('botbuilder');

module.exports = function(qnarecognizer) {
  return function(session, args, next) {
    qnarecognizer.recognize(session, function(error, result) {
      const answerEntity = builder.EntityRecognizer.findEntity
      (result.entities, 'answer');
      if (answerEntity.entity == undefined) {
       return session.send('Unfortunately, I don\'t know the answer to that question.');
      }
      session.send(answerEntity.entity);
      session.endDialog();
    })
  }
};
