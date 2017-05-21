const SerialPort = require('serialport');
const port = new SerialPort('COM3', {baudRate: 9600});

port.once('data', function(data) {
  console.log(data.toString());

  // turn lamp on
  port.write('1');
  
  // turn lamp off after 1 second
  setTimeout(() => {
    port.write('0');
  }, 1000);
});
