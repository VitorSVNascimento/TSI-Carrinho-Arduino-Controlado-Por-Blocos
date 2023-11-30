#include <AFMotor.h>
#include <TaskScheduler.h>
#include <SoftwareSerial.h>

AF_DCMotor motor1(1);  // Motor 1 connected to M1 and M2 pins
AF_DCMotor motor2(2);  // Motor 2 connected to M3 and M4 pins
AF_DCMotor motor3(3);  // Motor 3 connected to M5 and M6 pins
AF_DCMotor motor4(4);  // Motor 4 connected to M7 and M8 pins

// Velocidade dos motores (0 - 255).
#define MOTORS_SPEED 255

// Constante base de conversão: milissegundos para segundos.
#define SECONDS 1000

// Constantes direcionais.
#define COMM_FORWARD 1
#define COMM_RIGHT 2
#define COMM_BACKWARD 3
#define COMM_LEFT 4
#define COMM_STT_IF 5
#define COMM_END_IF 6

// Sensor de distância
#define PULSE_EMITTER 31   // OUTPUT
#define PULSE_LISTENER 29  // INPUT

// Controle dos comandos enviados/recebidos
#define BLUETOOTH_CONTROL_FLAG '\n'

// Valor base de conversão ASCII
#define ASCII_BASE 48

// Valor de tempo padrão de cada movimento (em segundos).
#define MOVE_TIME 3

// Constantes dos leds.
const int RED_LIGHT_PIN = 41,
          GREEN_LIGHT_PIN = 39,
          BLUE_LIGHT_PIN = 43,
          WHITE_LIGHT_PIN = 37;

// ENUM: Cores
enum Colors { RED,
              WHITE };

// Variável Serial de configuração do Bluetooth.
SoftwareSerial bluetoothSerial(A11, A10);  // RX, TX

// Buffer de entrada Bluetooth.
String command = "";

void setup() {
  motor1.setSpeed(MOTORS_SPEED);
  motor2.setSpeed(MOTORS_SPEED);
  motor3.setSpeed(MOTORS_SPEED);
  motor4.setSpeed(MOTORS_SPEED);

  pinMode(RED_LIGHT_PIN, OUTPUT);
  pinMode(GREEN_LIGHT_PIN, OUTPUT);
  pinMode(BLUE_LIGHT_PIN, OUTPUT);

  pinMode(PULSE_EMITTER, OUTPUT);
  pinMode(PULSE_LISTENER, INPUT);

  motor1.run(RELEASE);
  motor2.run(RELEASE);
  motor3.run(RELEASE);
  motor4.run(RELEASE);


  Serial.begin(115200);
  Serial.println("Type AT commands!");
  bluetoothSerial.begin(9600);
}

void loop() {

  // Verificação e leitura dos possíveis comandos recebidos via Bluetooth.
  if (bluetoothSerial.available()) {
    char chunk = (char)bluetoothSerial.read();

    // Verifica se o comando completo foi recebido.
    if (chunk == BLUETOOTH_CONTROL_FLAG) {
      // Executa os comandos recebidos.
      executeCommand(command);

      // Limpa o buffer de entrada.
      command = "";
    } else
      // Armazena o próximo comando (char), parte do comando completo.
      command += chunk;
  }

  if(!hasSpaceToMove(7))
    forward(MOVE_TIME);

  // COMENTÁRIO: bluetoothSerial.write() efetua o envio (via bluetooth) do arduino para o dispositivo conectado.
  // if (Serial.available()) {
  //   delay(10);  // The DELAY!
  //   bluetoothSerial.write(Serial.read());
  // }
}

/*
 Executa uma série de movimentos no carrinho, de acordo com a lista de comandos recebida.

 param command: String contendo a lista de comandos, um por caracter.
*/
void executeCommand(String command) {
  for (int i = 0; i < command.length(); i++) {
    int move = parseCharToInt(command.charAt(i));

    // Checando o comando IF
    if(move == COMM_STT_IF) {
        if(!hasSpaceToMove(parseCharToInt(command.charAt(++i))))
            while(parseCharToInt(command.charAt(++i)) != COMM_END_IF);
        continue;
    } else if(move == COMM_END_IF) continue;

    executeMove(move);
  }
} 

/*
 Converte um caracter para seu respectivo valor inteiro.
 Baseado nos valores descritos na tabela ASCII.

 param move: Caracter a ser convertido.

 return: O valor ASCII (int) do caracter.
*/
int parseCharToInt(char move) {
    return ((int) move) - ASCII_BASE;
}

/*
 Executa um movimento específico, baseado no valor do código informado.

 param direction: Código do movimento (COMM_FORWARD, COMM_BACKWARD, COMM_LEFT, COMM_RIGHT).
*/
void executeMove(int move) {
  if (move == COMM_FORWARD)
    forward(MOVE_TIME);
  else if (move == COMM_BACKWARD)
    backward(MOVE_TIME);
  else if (move == COMM_RIGHT)
    right(MOVE_TIME);
  else if (move == COMM_LEFT)
    left(MOVE_TIME);
}

/*
 Altera o estado dos motores para que o carrinho se mova para frente por um determinado período de tempo.

 param time: Tempo (em segundos) de duração do movimento.
*/
void forward(int time) {
  stop();
  changeAllMotorsStateTimed(FORWARD, time);
}

/*
 Altera o estado dos motores para que o carrinho se mova para trás por um determinado período de tempo.

 param time: Tempo (em segundos) de duração do movimento.
*/
void backward(int time) {
  turnOnBackwardLights();
  stop();
  changeAllMotorsStateTimed(BACKWARD, time);
  turnOffBackwardLights();
}

/*
 Utiliza o sensor de proximidade para checar se há obstáculos à frente.
 Caso exista um obstáculo e o mesmo esteja à uma distância menor que 'minimumDistance'
 a função retorna false, caso contrário retorna true.

 param minimumDistance: Distância minima para executar o movimento.

 return: false caso exista um obstáculo a uma distancia menor que 'minimumDistance', caso contrário retorna true.
*/
bool hasSpaceToMove(int minimumDistance) {
  // Efetuando a leitura
  digitalWrite(PULSE_EMITTER, HIGH);
  delayMicroseconds(10);
  digitalWrite(PULSE_EMITTER, LOW);

  // Calculando a distância
  int distance = (pulseIn(PULSE_LISTENER, HIGH) / 29) / 2 ;//* 0.017175;
  return distance >= minimumDistance;
}

/*
 Para todos os motores.
*/
void stop() {
  changeAllMotorsState(RELEASE);
}

/*
 Altera o estado de todos os motores.

 param state: Estado do motor (FORWARD, BACKWARD, RELEASE).
*/
void changeAllMotorsState(int state) {
  motor1.run(state);
  motor2.run(state);
  motor3.run(state);
  motor4.run(state);
}

/*
 Altera o estado de todos os motores por um determinado período de tempo.

 param state: Estado do motor (FORWARD, BACKWARD, RELEASE).
 param time: Tempo (em segundos) de duração do movimento.
*/
void changeAllMotorsStateTimed(int state, int time) {
  changeAllMotorsState(state);
  delay(time * SECONDS);
  stop();
}

/*
 Para todos os motores por um determinado período de tempo.

 param time: Tempo (em segundos) de duração do movimento.
*/
void timedStop(int time) {
  turnOnBreakLights();
  stop();
  delay(time * SECONDS);
  turnOffBreakLights();
}

/*
 Altera o estado de todos os motores para que o carrinho se mova para a esquerda por um determinado período de tempo.

 param time: Tempo (em segundos) de duração do movimento.
*/
void left(int time) {
  stop();
  timedTurn(COMM_LEFT, time);
}

/*
 Altera o estado de todos os motores para que o carrinho se mova para a direita por um determinado período de tempo.

 param time: Tempo (em segundos) de duração do movimento.
*/
void right(int time) {
  stop();
  timedTurn(COMM_RIGHT, time);
}

/*
 Altera o estado de todos os motores para que o carrinho se mova em uma direção específica.

 param direction: Direção do movimento (COMM_LEFT, COMM_RIGHT).
*/
void turn(int direction) {
  if (direction == COMM_LEFT) {
    motor1.run(FORWARD);
    motor4.run(FORWARD);
  } else if (direction == COMM_RIGHT) {
    motor2.run(FORWARD);
    motor3.run(FORWARD);
  }
}

/*
 Altera o estado de todos os motores para que o carrinho se mova em uma direção específica por um determinado período de tempo.

 param direction: Direção do movimento (COMM_LEFT, COMM_RIGHT).
 param time: Tempo (em segundos) de duração do movimento.
*/
void timedTurn(int direction, int time) {
  turn(direction);
  delay(time * SECONDS);
  stop();
}

/*
 Liga as luzes de freio.
*/
void turnOnBreakLights() {
  turnOnRGB(Colors::RED);
}

/*
 Desliga as luzes de freio.
*/
void turnOffBreakLights() {
  turnOffRGB();
}

/*
 Liga as luzes de reversa.
*/
void turnOnBackwardLights() {
  turnOnRGB(Colors::WHITE);
}

/*
 Desliga as luzes de reversa.
*/
void turnOffBackwardLights() {
  turnOffRGB();
}

/*
 Liga as luzes RGB.

 param color: Cor das luzes (RED, WHITE).
*/
void turnOnRGB(Colors color) {
  turnOffRGB();

  switch (color) {
    case Colors::RED:
      digitalWrite(RED_LIGHT_PIN, HIGH);
      break;
    case Colors::WHITE:
      digitalWrite(RED_LIGHT_PIN, HIGH);
      digitalWrite(BLUE_LIGHT_PIN, HIGH);
      digitalWrite(GREEN_LIGHT_PIN, HIGH);
      break;
  }
}

/*
 Desliga as luzes RGB.
*/
void turnOffRGB() {
  digitalWrite(RED_LIGHT_PIN, LOW);
  digitalWrite(GREEN_LIGHT_PIN, LOW);
  digitalWrite(BLUE_LIGHT_PIN, LOW);
}
