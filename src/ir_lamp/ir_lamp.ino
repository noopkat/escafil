
int IRledPin =  13;
int incoming = 0; 

void setup()   {                
  pinMode(IRledPin, OUTPUT);      
  Serial.begin(9600);
  Serial.print("lamp is checking in");
}
 
void loop()                     
{

  if (Serial.available() > 0) {
    incoming = Serial.read();
    Serial.print(incoming);
    if (incoming == '1') {
      Serial.println("turning lamp on");
      SendLampOnCode();
    } else if (incoming == '0') {
      Serial.println("turning lamp off");
      SendLampOffCode();
    }
  }
//   test
//   SendLampOnCode();
//   delay(1500);
//   SendLampOffCode();
//   delay(1500);
}
 
// This procedure sends a 38KHz pulse to the IRledPin 
// for a certain # of microseconds.
void pulseIR(long microsecs) {
  cli();  // turn off any background interrupts
 
  while (microsecs > 0) {
    // 38 kHz is about 13 microseconds high and 13 microseconds low
   digitalWrite(IRledPin, HIGH);  // this takes about 3 microseconds to happen
   delayMicroseconds(10);         // hang out for 10 microseconds
   digitalWrite(IRledPin, LOW);   // this also takes about 3 microseconds
   delayMicroseconds(10);         // hang out for 10 microseconds
 
   // so 26 microseconds altogether
   microsecs -= 26;
  }
 
  sei();  // turn interrupts back on
}

void SendLampOffCode() {

  // send 7 times because IR is finicky
  for (int i = 0; i < 7; i++) {
    delayMicroseconds(21860);
    pulseIR(1420);
    delayMicroseconds(440);
    pulseIR(1400);
    delayMicroseconds(460);
    pulseIR(460);
    delayMicroseconds(1300);
    pulseIR(1400);
    delayMicroseconds(460);
    pulseIR(1400);
    delayMicroseconds(460);
    pulseIR(1400);
    delayMicroseconds(460);
    pulseIR(440);
    delayMicroseconds(1300);
    pulseIR(480);
    delayMicroseconds(1300);
    pulseIR(480);
    delayMicroseconds(1300);
    pulseIR(480);
    delayMicroseconds(1300);
    pulseIR(480);
    delayMicroseconds(1300);
    pulseIR(480);
    delayMicroseconds(8260);
    pulseIR(1440);
  }
}
 
void SendLampOnCode() {
  delayMicroseconds(52012);
  pulseIR(1420);

  // send 7 times because IR is finicky
  for (int i = 0; i < 7; i++) {
    delayMicroseconds(440);
    pulseIR(1400);
    delayMicroseconds(460);
    pulseIR(460);
    delayMicroseconds(1300);
    pulseIR(1400);
    delayMicroseconds(460);
    pulseIR(1400);
    delayMicroseconds(460);
    pulseIR(1380);
    delayMicroseconds(460);
    pulseIR(1380);
    delayMicroseconds(460);
    pulseIR(440);
    delayMicroseconds(1300);
    pulseIR(480);
    delayMicroseconds(1300);
    pulseIR(480);
    delayMicroseconds(1300);
    pulseIR(460);
    delayMicroseconds(1300);
    pulseIR(480);
    delayMicroseconds(8260);
    pulseIR(1440);
  }
}

