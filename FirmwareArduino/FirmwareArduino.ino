#include <Wire.h>
#include <LiquidCrystal_I2C.h>

#if defined(ARDUINO) && ARDUINO >= 100
#define printByte(args)  write(args);
#else
#define printByte(args)  print(args,BYTE);
#endif

uint8_t bell[8]  = {0x4,0xe,0xe,0xe,0x1f,0x0,0x4};
uint8_t note[8]  = {0x2,0x3,0x2,0xe,0x1e,0xc,0x0};
uint8_t clock[8] = {0x0,0xe,0x15,0x17,0x11,0xe,0x0};
uint8_t heart[8] = {0x0,0xa,0x1f,0x1f,0xe,0x4,0x0};
uint8_t duck[8]  = {0x0,0xc,0x1d,0xf,0xf,0x6,0x0};
uint8_t check[8] = {0x0,0x1,0x3,0x16,0x1c,0x8,0x0};
uint8_t cross[8] = {0x0,0x1b,0xe,0x4,0xe,0x1b,0x0};
uint8_t retarrow[8] = {  0x1,0x1,0x5,0x9,0x1f,0x8,0x4};

String dadosRecebidos = ""; 

LiquidCrystal_I2C lcd(0x27, 16, 2);
//LiquidCrystal_I2C lcd(0x27,20,4);  // set the LCD address to 0x27 for a 16 chars and 2 line display

void setup() {
  Serial.begin(9600);
  
  lcd.begin();
  //lcd.init();                      
  lcd.backlight();
  
  lcd.createChar(0, bell);
  lcd.createChar(1, note);
  lcd.createChar(2, clock);
  lcd.createChar(3, heart);
  lcd.createChar(4, duck);
  lcd.createChar(5, check);
  lcd.createChar(6, cross);
  lcd.createChar(7, retarrow);
  lcd.home();
  
  

  // lcd.print("Bem vindo!");
  // lcd.setCursor(0, 1);
  // lcd.print(" vc ");
  // lcd.printByte(3);
  lcd.print("  Iniciando...");
  lcd.setCursor(0, 1);
  delay(3000);

}

void loop() {
    Serial.write(" ");
        dadosRecebidos = Serial.readString();
        char dadosRecEmChar[dadosRecebidos.length()+1];
        dadosRecebidos.toCharArray(dadosRecEmChar, dadosRecebidos.length()+1);
        printFull(dadosRecEmChar);

}

void printFull(String texto){
    
      lcd.setCursor(0, 0);
      lcd.print(texto.substring(0,16));
      lcd.setCursor(0, 1);
      lcd.print(texto.substring(16,32));
  
}
