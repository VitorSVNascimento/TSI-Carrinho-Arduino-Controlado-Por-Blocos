import serial

# Substitua "COMX" pelo número da porta COM e "00:11:22:33:44:55" pelo endereço MAC do seu módulo GW-040
bluetooth_serial = serial.Serial("COM8", baudrate=9600)
data = [1, 2, 3, 4]  # Substitua isso pela lista de inteiros que você deseja enviar

# Converte a lista em uma string de inteiros separados por vírgulas
data_string = ",".join(map(str, data))

data_string = f"{data_string}\n"

# Envia a string para o Arduino via Bluetooth
bluetooth_serial.write(data_string.encode())
