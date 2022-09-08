//
//
// HCDE 548 Testing!
// Nadya Peek Nov 2021
//
//

#include <avr/io.h>
#include <util/delay.h>

#define output(directions,pin) (directions |= pin) // set port direction for output
#define input(directions,pin) (directions &= (~pin)) // set port direction for input
#define set(port,pin) (port |= pin) // set port pin
#define clear(port,pin) (port &= (~pin)) // clear port pin
#define pin_test(pins,pin) (pins & pin) // test for port pin
#define bit_test(byte,bit) (byte & (1 << bit)) // test for bit set

#define led_port PORTA
#define led_direction DDRA
#define led_pin1 (1 << PA1)
#define led_pin2 (1 << PA2)

uint16_t i = 0;

int main(void) {
   //
   // set clock divider to /1
   //
   CLKPR = (1 << CLKPCE);
   CLKPR = (0 << CLKPS3) | (0 << CLKPS2) | (0 << CLKPS1) | (0 << CLKPS0);
   //
   //
   // main loop
   //
   output(led_direction, led_pin1);
   output(led_direction, led_pin2);

   
   while (1) {
      clear(led_port, led_pin1);
      set(led_port, led_pin2);
      _delay_ms(100);
      set(led_port, led_pin1);
      clear(led_port, led_pin2);
      _delay_ms(100);
   }
}
