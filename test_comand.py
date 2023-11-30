from api.app import for_arduino

moves_test = {
    'moves' : ['frente','ré','direita', {
        'repetitions': '4',
        'moves' :  ['frente','frente','frente']
    },
    {
        'condition': 1,
        'moves' : [ 'frente','ré',{
            'repetitions':'2',
            'moves':['direita','esquerda']
        }]
    }
    ]
}

print(for_arduino(moves_test))

#132111111111111511324246