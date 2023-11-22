import serial

BLUETOOTH_PORT = "COM8"
END_MOVE_LIST = '\n'

def send_to_arduino(move_list_encode:str):
    bluetooth_serial = serial.Serial(BLUETOOTH_PORT, baudrate=9600)
    move_list_encode+=END_MOVE_LIST

    bluetooth_serial.write(move_list_encode.encode())