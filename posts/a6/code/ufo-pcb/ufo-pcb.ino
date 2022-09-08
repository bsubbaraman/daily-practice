//
// ufo pcb!
// blair subbaraman nov 2021
// adapted from in-class example from nadya
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

#define button_port PORTA
#define button_direction DDRA
#define button_pins PINA
#define button_pin (1 << PA3)

uint16_t i = 0;

int main(void) {
   //
   // set clock divider to /1
   //
   CLKPR = (1 << CLKPCE);
   CLKPR = (0 << CLKPS3) | (0 << CLKPS2) | (0 << CLKPS1) | (0 << CLKPS0);
   //
   // main loop
   //
   output(led_direction, led_pin1);
   output(led_direction, led_pin2);

   while (1) {
      if(pin_test(button_pins,button_pin) != 0){ // when the button is pressed
            set(led_port, led_pin1); // blinky #1
            _delay_ms(100);
            clear(led_port, led_pin1);
            set(led_port, led_pin2); // blinky #2
            _delay_ms(100);
            clear(led_port, led_pin2);
      }
      else {
        clear(led_port, led_pin1); // no press, no lights!
        clear(led_port, led_pin2);
      }
   }
}
