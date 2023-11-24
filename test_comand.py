from api.app import for_arduino

moves_test = {
    'moves' : ['frente','ré','direita', {
        'repetitions': '4',
        'moves' :  ['frente','frente','frente']
    },
    {
        'condition': 1,
        'moves' : [ 'frente','ré',]
    }
    ]
}

print(for_arduino(moves_test))