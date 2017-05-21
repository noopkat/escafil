const SerialPort = require('serialport');

const lamp = function(port, baud) {
  this.connection;
  this.states = {
    ON: '1',
    OFF: '0'
  }
};

lamp.prototype.init = function() {
  this.connection = new SerialPort(port, {baudRate: baud});
}

lamp.prototype.turnOn = function() {
  this.connection.write(this.states.ON);
}

lamp.prototype.turnOff = function() {
  this.connection.write(this.states.OFF);
}

module.exports = lamp;