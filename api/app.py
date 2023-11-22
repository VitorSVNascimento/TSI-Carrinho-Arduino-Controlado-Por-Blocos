from flask import Flask,jsonify,make_response,request
import json
from bluetooth import send_to_arduino
json_moves = {
    'frente': 1,
    'direita': 2,
    'ré': 3,
    'esquerda': 4,
}

MOVE_LIST_KEY = 'moves'
MOVES_ARG = 'moves'

app = Flask(__name__)

def for_arduino(moves):
    return [json_moves[move] for move in moves[MOVE_LIST_KEY]]

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


app.run()