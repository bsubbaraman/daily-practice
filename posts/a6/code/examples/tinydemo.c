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

#define button_port PORTA
#define button_direction DDRA
#define button_pins PINA
#define button_pin (1 << PA2)

#define pot_port PORTA
#define pot_direction DDRA
#define pot_pins PINA
#define pot_pin (1 << PA0)

#define led_port PORTB
#define led_direction DDRB
#define led_pin (1 << PA4)

#define speaker_port PORTA
#define speaker_direction DDRA
#define speaker_pin (1 << PA3) 

uint16_t i = 0;

int main(void) {
   //
   // set clock divider to /1
   //
   CLKPR = (1 << CLKPCE);
   CLKPR = (0 << CLKPS3) | (0 << CLKPS2) | (0 << CLKPS1) | (0 << CLKPS0);
   //
   //
   // init A/D
   //
   ADMUX = (0 << REFS1) | (0 << REFS0) // VCC ref
      | (0 << ADLAR) // right adjust
      | (0 << MUX3) | (0 << MUX2) | (0 << MUX1) | (0 << MUX0); //ADC0
   ADCSRA = (1 << ADEN) // enable
      | (1 << ADPS2) | (1 << ADPS1) | (1 << ADPS0); // prescaler /128
   ADCSRB = (1 << BIN); // bipolar mode

   //TCCR1A = ((1 << COM1B1) | (1 << COM1B0) | (1 << WGM11)
   //   | (1 << WGM10)); // clear OC1B on compare match, fast 8-bit PWM
   //TCCR1B = ((0 << WGM13) | (1 << WGM12) | (0 << CS12) | (0 << CS11)
   //   | (1 << CS10)); // /1 clock divider
   //timer counter lets to write to OCR0B
   //
   //
   // main loop
   //
   output(led_direction, led_pin1);
   output(led_direction, led_pin2);

   clear(speaker_port,speaker_pin);
   output(speaker_direction,speaker_pin);
   
   while (1) {
      ADCSRA |= (1 << ADSC); // start ADC reading
      while (ADCSRA & (1 << ADSC)); // this takes time

      if(pin_test(button_pins,button_pin) != 0){
          set(led_port, led_pin);
          set(speaker_port, speaker_pin);
          for(i=0;i < 100;i++){ 
            _delay_us(2);
          }
          clear(speaker_port, speaker_pin);
          for(i=0;i < 100;i++){
            _delay_us(2);
          }
      }
      else {
        clear(led_port, led_pin);
      }
   }
}
