#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <WiFiClientSecure.h>
#include <Adafruit_LIS3DH.h>
#include <Adafruit_Sensor.h>


// wifi credentials
const char* ssid = "";
const char* password = "";

// mqtt / azure iot hub credentials

// example: <myiothub>.azure-devices.net
const char* mqtt_server = "";

// this is the id of the device created in Iot Hub
// example: myCoolDevice
const char* clientid = "";

// <myiothub>.azure-devices.net/<myCoolDevice>
const char* username = "";

// SAS token should look like "SharedAccessSignature sr=<myiothub>.azure-devices.net%2Fdevices%2F<myCoolDevice>&sig=123&se=456"
const char* token = ""

// default topic feed for subscribing is "devices/<myCoolDevice>/messages/devicebound/#""
const char* feed_endpoint = "";

// default topic feed for publishing is "devices/<myCoolDevice>/messages/events/"
const char* feed_publish_endpoint = "";


WiFiClientSecure espClient;
PubSubClient client(espClient);
Adafruit_LIS3DH lis = Adafruit_LIS3DH();
// Adjust this number for the sensitivity of the 'click' force
// this strongly depend on the range! for 16G, try 5-10
// for 8G, try 10-20. for 4G try 20-40. for 2G try 40-80
#define CLICKTHRESHHOLD 80

long lastMsg = 0;

// set pins for outputs
int vibrationPin = 15;
int ledPin = 12;
int fadeAmount = 5;
const char* clickDetectedCmd = "6";
bool lisOn = false;
bool lisDebounce = false;



// function to connect to the wifi
void setup_wifi() {
  delay(10);

  Serial.println();
  Serial.print("Connecting to wifi");

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  // debug wifi via serial
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

// run vibration motor for specified duration
void vibration_control(int duration) {
  Serial.print("duration vibration");
  digitalWrite(vibrationPin, HIGH);
  delay(duration * 1000);
  digitalWrite(vibrationPin, LOW);
}

// turn on led for specified duration
void led_control(int duration) {
  Serial.print("led duration");
  digitalWrite(ledPin, HIGH);
  delay(duration * 1000);
  digitalWrite(ledPin, LOW);
}

void led_fade_in() {
  Serial.print("fading in!");
  for (int i = 0; i < 255; i++) {
    analogWrite(ledPin, i);
    delay(10);
  }
}

void led_fade_out() {
  Serial.print("fading out!");
  for (int i = 255; i > 0; i--) {
    analogWrite(ledPin, i);
    delay(10);
  }
}

// function to connect to MQTT server
void reconnect_mqtt() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect
    if (client.connect(clientid, username, token)) {
      Serial.println("connected"); 
      // ... and resubscribe
      client.subscribe(feed_endpoint);
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}


// callback function for when a message is dequeued from the MQTT server
void callback(char* topic, byte* payload, unsigned int length) {
  // print message to serial for debugging
  Serial.print("Message arrived: ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();

  int command = payload[0];
  int argument = payload[1];

  if (command == 1) {
    vibration_control(argument);
  }

  if (command == 2) {
    led_control(argument);
  }

  if (command == 3) {
    led_fade_in();
  }

  if (command == 4) {
    led_fade_out();
  }
}

void setup() {
  // turn off onboard led
  pinMode(BUILTIN_LED, OUTPUT);
  digitalWrite(BUILTIN_LED, HIGH);

  pinMode(vibrationPin, OUTPUT);
  pinMode(ledPin, OUTPUT);

  // begin serial for debugging purposes
  Serial.begin(115200);

  // connect to wifi
  setup_wifi();

  // set up connection and callback for MQTT server
  client.setServer(mqtt_server, 8883);
  client.setCallback(callback);

  // connect to MQTT
  reconnect_mqtt();

   while (!lis.begin(0x18)) {
    Serial.println("Couldnt start LIS3DH");
    delay(500);
   }
//   if (!lis.begin(0x18)) {   // change this to 0x19 for alternative i2c address
//      Serial.println("Couldnt start LIS3DH");
//   } else {
    Serial.println("LIS3DH found!");
    lisOn = true;
    lis.setRange(LIS3DH_RANGE_2_G);
    
    // 0 = turn off click detection & interrupt
    // 1 = single click only interrupt output
    // 2 = double click only interrupt output, detect single click
    // Adjust threshhold, higher numbers are less sensitive
    lis.setClick(2, CLICKTHRESHHOLD);
//   }  
}


void loop() {
  client.loop();
  long now = millis();

  // debug mqtt connection every 10 seconds
  if (now - lastMsg > 10000) {
    lastMsg = now;
    lisDebounce = false;
    Serial.print("is MQTT client is still connected: ");
    Serial.println(client.connected());
  }

  if (lisOn && !lisDebounce) {
    uint8_t click = lis.getClick();
    if (click == 0) return;
    if (! (click & 0x30)) return;
    Serial.print("Click detected (0x"); Serial.print(click, HEX); Serial.print("): ");

    if (click & 0x10) {
      lisDebounce = true;
     // Serial.print(" single click");
      client.publish(feed_publish_endpoint, clickDetectedCmd);
    }
    if (click & 0x20) {
      lisDebounce = true;
      Serial.print(" double click");
      client.publish(feed_publish_endpoint, clickDetectedCmd);      
    }
  }
}
