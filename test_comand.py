from api.app import for_arduino

moves_test = {
    'moves' : ['frente','ré','direita', {
        'repetitions': '4',
        'moves' :  ['frente','ré','direita', {'repetitions': '4',
        'moves' :  ['frente','ré','direita']}
        ]
    }
    ]
}

print(for_arduino(moves_test))