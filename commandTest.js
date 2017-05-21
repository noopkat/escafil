require('dotenv').config();
const IotClient = require('azure-iothub').Client;
const IotMessage = require('azure-iot-common').Message;
const EventHubsClient = require('azure-event-hubs').Client;;

const consumerGroup =  '$Default';
const startTime =  Date.now();
const deviceId = process.env.IOT_DEVICE_ID;
const connectionString = process.env.IOT_CONN_STRING;

const client = IotClient.fromConnectionString(process.env.IOT_CONN_STRING);
const ehClient = EventHubsClient.fromConnectionString(connectionString);

const vibration_command = new Buffer([0x01, 0x09]);
const led_command = new Buffer([0x02, 0x03]);
const led_on_command = new Buffer([0x03]);
const led_off_command = new Buffer([0x04])


function sendToEscafil(msg) {
  client.open((err) => {
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

ehClient.open()
  .then(ehClient.getPartitionIds.bind(ehClient))
  .then((partitionIds) => {
    return partitionIds.map((partitionId) => {
      return ehClient.createReceiver(consumerGroup, partitionId, { 'startAfterTime' : startTime})
        .then(function(receiver) {
          receiver.on('message', (eventData) => {
            var from = eventData.annotations['iothub-connection-device-id'];
            if (from === deviceId) {
              // console.log('Message Received: ' + eventData.body);
              console.log('escafil disturbed!');
            }
          });
        });
      });
    })
  .catch(function (error) {
    serviceError(error.message);
});

// sendToEscafil(led_command);
// sendToEscafil(vibration_command);
sendToEscafil(led_on_command);
// sendToEscafil(led_off_command);