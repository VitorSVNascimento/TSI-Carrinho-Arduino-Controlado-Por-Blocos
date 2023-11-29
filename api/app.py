from flask import Flask,jsonify,make_response,request
import json
# from bluetooth import send_to_arduino
from flask_cors import CORS
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
CONDITION_KEY = 'condition'
INIT_IF = 5
END_IF = 6

app = Flask(__name__)
CORS(app,resources={r"/*":{"origins":"*"}})
def extract_moves(move_dict):
    final_moves = ''
    move_list = move_dict[MOVE_LIST_KEY]
    repetitions = int(move_dict[REPETITIONS_KEY])
    loop_list = move_list * repetitions
    for move in loop_list:
        if type(move) == type(json_moves):
            final_moves+=extract_moves_condition_if(move)
        else:
            final_moves+=str(json_moves[move])
    return final_moves

def extract_moves_condition_if(move_dict):
    condition = int(move_dict[CONDITION_KEY])
    condition_string = f'{INIT_IF}{condition}'
    move_list = move_dict[MOVE_LIST_KEY]
    for move in move_list:
        if type(move) == type(json_moves):
           condition_string+=extract_moves(move)
        else: 
            condition_string+=str(str(json_moves[move]))
    return f'{condition_string}{END_IF}'


def for_arduino(moves):
    move_str = ''
    for move in moves[MOVE_LIST_KEY]:
        print(type(move))
        if type(move) == type(json_moves):
            if 'repetitions' in move:
                move_str+=extract_moves(move)
            elif 'condition' in move:
                move_str+= str(extract_moves_condition_if(move))
        else:
            move_str += str(json_moves[move])    

    return move_str

@app.route('/send-move-list',methods=['GET','POST'])
def send_move_list():
    if request.method == 'POST':
       moves = request.form.get(MOVES_ARG)
    else:
        moves = request.args.get(MOVES_ARG)
    print(moves)
    encode_string = for_arduino(json.loads(moves))

    # encode_string = ''

    # for move in encode_moves:
    #     encode_string+=str(move)

    # send_to_arduino(encode_string)
    return make_response(jsonify({'status':200}))


# app.run()