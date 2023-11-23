from flask import Flask,jsonify,make_response,request
import json
from api.bluetooth import send_to_arduino
json_moves = {
    'frente': 1,
    'direita': 2,
    'ré': 3,
    'esquerda': 4,
}

MOVE_LIST_KEY = 'moves'
MOVES_ARG = 'moves'
LOOP_TYPE = 'dict'
REPETITIONS_KEY = 'repetitions'

app = Flask(__name__)

def extract_moves(move_dict):
   moves_list = []
   for move in move_dict['moves']:
       if isinstance(move, dict):
           repetitions = int(move['repetitions'])
           for _ in range(repetitions):
               for movimento in extract_moves(move):
                moves_list.append(movimento)
       else:
           moves_list.append(move)
   return moves_list

def for_arduino(moves):
    move_list = []
    for move in moves[MOVE_LIST_KEY]:
        print(type(move))
        if type(move) == type(json_moves):
            for loop_move in extract_moves(move):
                move_list.append(json_moves[loop_move])
        else:
            move_list.append(json_moves[move])    

    return move_list

@app.route('/send-move-list',methods=['GET','POST'])
def send_move_list():
    moves = request.args.get(MOVES_ARG)
    print(moves)
    encode_moves = for_arduino(json.loads(moves))

    encode_string = ''

    for move in encode_moves:
        encode_string+=str(move)

    send_to_arduino(encode_string)
    return make_response(jsonify({'status':200}))


# app.run()

