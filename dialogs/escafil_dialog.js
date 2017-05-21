const builder = require('botbuilder');
const IotClient = require('azure-iothub').Client;
const IotMessage = require('azure-iot-common').Message;
const EventHubsClient = require('azure-event-hubs').Client;

const vibration_command = new Buffer([0x01, 0x08]);
const led_command = new Buffer([0x02, 0x03]);
const led_on_command = new Buffer([0x03]);
const led_off_command = new Buffer([0x04]);

const consumerGroup =  '$Default';
const startTime =  Date.now();
const deviceId = process.env.IOT_DEVICE_ID;
const connectionString = process.env.IOT_CONN_STRING;
const ehClient = EventHubsClient.fromConnectionString(connectionString);
const raw = true;
var escafilReceiver;

ehClient.open()
  .then(ehClient.getPartitionIds.bind(ehClient))
  .then((partitionIds) => {
    return partitionIds.map((partitionId) => {
      return ehClient.createReceiver(consumerGroup, partitionId, { 'startAfterTime' : startTime})
        .then(function(receiver) {
          console.log('got receiver');
          escafilReceiver = receiver;
        });
      });
    })
  .catch(function (error) {
    serviceError(error.message);
});

const SerialPort = require('serialport');
const lamp = new SerialPort('COM3', {baudRate: 9600});

function sendToEscafil(msg) {
  const client = IotClient.fromConnectionString(connectionString);
  client.open(function (err) {
    if (err) {
      console.error('Could not connect: ' + err.message);
    } else {
      console.log('Client connected');
      const message = new IotMessage(msg);
      console.log('Sending message: ' + message.getData());
      client.send(process.env.IOT_DEVICE_ID, message, printResultFor('Send'));
    }
  });
}

function printResultFor(op) {
  return function printResult(err, res) {
    if (err) {
      console.log(op + ' error: ' + err.toString());
    } else {
      console.log(op + ' status: ' + res.constructor.name);
    }
  };
}


module.exports = [
  (session, args, next) => {
    session.send('&lt;I am transporting a special item to you by standard teleportation&gt;');
   setTimeout(next, 2500);
  },
  (session, args, next) => {
    session.send('&lt;it\'s the Escafil Device. A highly advanced piece of Andalite technology.&gt;');
    sendToEscafil(led_on_command);
    setTimeout(next, 2500);
  },
  (session, args, next) => {
    session.send('&lt;it resembles a blue cube.&gt;');    
    setTimeout(next, 3000);
},
   (session, args, next) => {
      session.send("&lt;The Escafil Device is going to give you certain powers that no human has ever had before.&gt;");
      setTimeout(next, 2500);
  },
  (session, args, next) => {
    escafilReceiver.once('message', function(eventData) {
      console.log('escafil message!')
      const from = eventData.annotations['iothub-connection-device-id'];
      if (from === deviceId) {
        console.log('Message Received: ' + eventData.body);
        next();
      }
    });
    session.send('&lt;when you\'re ready, pick up the Escafil Device and hold it tight with both hands. I\'ll wait.&gt;');    
    // setTimeout(next, 2000);
},
  (session, args, next) => {
    // just in case
    escafilReceiver.removeAllListeners('message');
    setTimeout(() => {
      sendToEscafil(vibration_command);
    }, 1000);
    lamp.write('0');
    session.send('&lt;Hold it steady...&gt;');
    setTimeout(next, 10 * 1000);
  },
  (session, args, next) => {
    session.send('&lt;It\'s done!&gt;');
    lamp.write('1');
    sendToEscafil(led_off_command);
    session.beginDialog('post_escafil_dialog');
  },
];
