// Include the SoftwareSerial library to run serial on Attiny44
#include <SoftwareSerial.h>
#define bit_delay_time 8.5 // bit delay for 115200 with overhead

// Stepper Motor Setup
#define stepPin PA2
#define dirPin PA3
#define stepsPerRevolution 200

// some calibration definitions
#define minRightElbowAngle = 17 // degrees

// declare my serial ports 0 and 1 (RX, TX)
SoftwareSerial mySerial(PA0, PA1);

int value = 0; //store the reading in value
int currentPos = 0;
void setup() {
  mySerial.begin(115200); // set baud rate to 115200 bits per second
  pinMode(stepPin, OUTPUT);
  pinMode(dirPin, OUTPUT);
  CLKPR = (1 << CLKPCE);
  CLKPR = (0 << CLKPS3) | (0 << CLKPS2) | (0 << CLKPS1) | (0 << CLKPS0);
}

void loop() {
  while (1) {
    while (mySerial.available () > 0 ) {
      value = mySerial.parseInt();
      if (value > 0) { // this is here bc random 0s sent. need to fix.
        mySerial.println(value);
        step(value);
      }
    }
    delay(200);
  }
}

void step(int s) {
  int dir = 1;
  if (s < currentPos){
    // Set the spinning direction CCW:
    digitalWrite(dirPin, LOW);
    dir = -1;
  }
  else { // clockwise
    digitalWrite(dirPin, HIGH);
  }

  int stepsToMove = abs(s - currentPos);
  // Spin the stepper motor 1 revolution slowly:
  for (int i = 0; i < stepsToMove; i++) {
    // These four lines result in 1 step:
    digitalWrite(stepPin, HIGH);
    delayMicroseconds(500); // change to modify speed
    digitalWrite(stepPin, LOW);
    delayMicroseconds(500);
  }

  currentPos += dir * stepsToMove;
}
