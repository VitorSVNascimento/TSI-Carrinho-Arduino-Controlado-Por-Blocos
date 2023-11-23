const button = document.getElementById("btnExecute")
const erroPilhas = document.getElementById("errorDiv")

button.addEventListener("click", executarMovimentos)

function percorrerBlocosMovimento(blocoAtual, movimentos) {
	if(blocoAtual) {
		if(blocoAtual.type === 'loop_block') {
			const firstChildren = blocoAtual.getChildren(true)[0]
			if(firstChildren && blocoAtual.getInputTargetBlock('DO') != null) {
				movimentos.push({
					'repetitions': blocoAtual.getFieldValue('TIMES'),
					'moves' : []
				})
				percorrerBlocosMovimento(firstChildren, movimentos.at(-1)['moves'])
			}
		} else {
			movimentos.push(blocoAtual.getFieldValue('movimento'))
		}

		const nextBlock = blocoAtual.getNextBlock()
		if(nextBlock) {
			percorrerBlocosMovimento(nextBlock, movimentos)
		}
	}
}

function executarMovimentos() {
	if(!workspace.getTopBlocks().length) {
		erroPilhas.innerHTML = 'Insira algum bloco'
	} else if(apenasUmaPilhaBlocos()) {
		retirarErro()
		const ALL_BLOCKS = workspace.getAllBlocks()
		const FIRST_BLOCK = ALL_BLOCKS[0]
		const MOVIMENTOS = { 'moves': []}
		percorrerBlocosMovimento(FIRST_BLOCK, MOVIMENTOS['moves'])
		
		const MOVIMENTOS_JSON = JSON.stringify(MOVIMENTOS)

		console.log(MOVIMENTOS_JSON)
	} else {
		exibirErroQuantidadePilhas()
	}
}

function exibirErroQuantidadePilhas() {
	erroPilhas.innerHTML = 'Apenas uma pilha de blocos é permitida!'
}

function retirarErro() {
	erroPilhas.innerHTML = '&nbsp'
}

function apenasUmaPilhaBlocos() {
	return workspace.getTopBlocks().length == 1 ? true : false
}