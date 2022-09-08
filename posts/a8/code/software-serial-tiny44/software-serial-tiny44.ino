#include <SoftwareSerial.h>
SoftwareSerial ser(PA1, PA0); // RX, TX


int rx = 0; // this is the data being recieved
int on = 1; // magic nuber to turn LED


void setup() {
  ser.begin(9600);
  pinMode(PA7, OUTPUT); // LED pin

  // blink on startup so I know it's on
  digitalWrite(PA7, HIGH);
  delay(500);
  digitalWrite(PA7, LOW);
}

void loop() {
  while (ser.available () == 0 ) {} // don't do anything if there's no serial messages
  rx = ser.parseInt();
  ser.println(rx); // echo it back
  if (rx == on) // if we recieve the 'on' message, turn the LED on
  {
    digitalWrite(PA7, HIGH);
  }
  else
  {
    digitalWrite(PA7, LOW); // all other messages will turn it off
  }
}
