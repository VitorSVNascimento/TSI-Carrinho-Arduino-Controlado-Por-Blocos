#define PinoTrigger 5   //O Trigger emite o pulso
#define PinoEcho 4      //O Echo recebe o pulso

int duracao = 0;
int distancia = 0;

void setup ()
{
pinMode(PinoTrigger,OUTPUT);
pinMode(PinoEcho,INPUT);
Serial.begin(9600);
}

void loop()
{
digitalWrite(PinoTrigger, HIGH);
delayMicroseconds(10);
digitalWrite(PinoTrigger,LOW);
  
duracao = pulseIn(PinoEcho, HIGH); //Armazena o valor lido
distancia = duracao*0.017175;
Serial.print(distancia);
Serial.println("mm");  
delay(100);
}