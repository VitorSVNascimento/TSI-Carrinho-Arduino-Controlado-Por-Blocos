# TSI-Carrinho-Arduino-Controlado-Por-Blocos
 Veículo Arduino controlado via API em uma interface de programação em blocos (Blockly1).

<p align="center">
  <img src="https://github.com/VitorSVNascimento/TSI-Carrinho-Arduino-Controlado-Por-Blocos/blob/main/Imagens/carrinho_frente.png"/>
</p>
 
## Proposta do Projeto
 Projeto desenvolvido para a disciplina de WebServices, lecionada pelo professor [Rafael](https://github.com/rafjaa).
 - O projeto consiste em:
   
   | | ÁREA | DESCRIÇÃO | |
   | --- | --- | --- | --- |
   || Arduino | O robô Arduino deverá ser capaz de andar para frente, para trás e virar para os dois lados. ||
   || Componentes Arduino | Recursos mínimos: sensor de distância na parte frontal, luz e sinal sonoro de ré, e um led RGB para indicar seus status(conectado/verde ou desconectado/vermelho à API). ||
   || API HTTP Restful | A API HTTP Restful deve possibilitar o  envio de informações para o robô, como andar para frente, virar para a esquerda, checar se há algum objeto à frente. ||
   || Envio das informações pela API HTTP Restful para a placa Arduino | Utilizar o módulo de Bluetooth ou o de Wi-Fi. ||
   || Comunicação com a API | Interface Web utilizando a biblioteca Blockly1, com blocos personalizados que permitam controlar o veículo robô. ||
   || Interface Web | A ideia é reproduzir o jogo Labirinto2 do Blockly Games (Como ilustra a imagem logo abaixo), mas com um robô de verdade. ||

   <img src="https://github.com/VitorSVNascimento/TSI-Carrinho-Arduino-Controlado-Por-Blocos/blob/main/Imagens/Blockly_Games.png" width="980px">
  
  ## Resultados do Projeto
   - A seguir uma imagem e um vídeo do carrinho em funcionamento.
   - Imagem

     <img src="https://github.com/VitorSVNascimento/TSI-Carrinho-Arduino-Controlado-Por-Blocos/blob/main/Imagens/carrinho_robo.jpeg" width="980px">

   - Vídeo
     
     https://github.com/VitorSVNascimento/TSI-Carrinho-Arduino-Controlado-Por-Blocos/assets/129966396/ad63cf75-0a25-4637-8585-227ea1ff3808
    
   - Caso queira saber mais sobre o funcionamento do carrinho clique [aqui!](https://carenferreira.github.io/)


  ## Informações técnicas: 
  - Arduino: C++
  - API: Python
  - Front-end: HTML, CSS, JavaScript

  ## Instruções de instalação e execução
  Para execução do presente projeto, é necesário a construção do carrio arduino. Após isso, baixe ou clone esse repositório e siga as instruções:
  1) Criar o ambiente virtual 
  ```bash
  python -m venv venv
  ```
  2) Ativar o ambiente virtual
  ```bash
  ./venv/Scripts/activate
  ```
 3) Instalar as bibliotecas necessárias
  ```bash
  pip install -r requirements.txt
  ```
 4) Modificar a constante BLUETHOOTH_PORT no arquivo ./api/bluethooth.py para a porta COM correspondente no seu dispositivo
 5) Com o ambiente virtual ativado execute o arquivo de inicialização da api
 ```bash
  python ./api/app.py
  ```
  ## Colaboradores do Projeto
   - [Caren Ferreira](https://github.com/carenferreira)
   - [Igor Augusto](https://github.com/IgorAuguusto)
   - [João Lucas](https://github.com/ja1za1)
   - [Letícia Oliveira](https://github.com/LeticiaKOSilva)
   - [Pedro Henrique](https://github.com/pedrocota)
   - [Vinícius José](https://github.com/ViniciusJPSilva)
   - [Vitor Samuel](https://github.com/VitorSVNascimento)
   - [Vitor Silvestre](https://github.com/VitorST1)
   - [Yury Oliveira](https://github.com/YuryOAraujo) 

     



