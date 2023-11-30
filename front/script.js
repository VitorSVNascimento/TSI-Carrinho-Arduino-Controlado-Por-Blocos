const button = document.getElementById("btnExecute")
const erroPilhas = document.getElementById("errorDiv")
const loadingSpinner = document.getElementById("loadingSpinner")
const NIVEL_INICIAL = 0
const NIVEL_DENTRO_BLOCO = 1
const TIPO_IF = 'if_block'
const TIPO_LOOP = 'loop_block'
const TIPO_MOVIMENTOS = 'movimentos'
const TIPO_VAZIO = ''

button.addEventListener("click", executarMovimentos)

function percorrerBlocosMovimento(blocoAtual, movimentos, nivel, tipoPai) {
	if(blocoAtual) {
		if(blocoAtual.type === TIPO_LOOP && (tipoPai === "" || (tipoPai !== TIPO_LOOP && (nivel === NIVEL_INICIAL || nivel === NIVEL_DENTRO_BLOCO)))) {
			const firstChildren = blocoAtual.getChildren(true)[0]
			if(firstChildren && blocoAtual.getInputTargetBlock('DO') != null) {
				movimentos.push({
					'repetitions': blocoAtual.getFieldValue('TIMES'),
					'moves' : []
				})
				percorrerBlocosMovimento(firstChildren, movimentos.at(-1)['moves'], nivel+1, TIPO_LOOP)
			}
		} else if(blocoAtual.type === TIPO_MOVIMENTOS){
			movimentos.push(blocoAtual.getFieldValue('movimento'))
		} else if(blocoAtual.type === TIPO_IF && (tipoPai === "" || (tipoPai !== TIPO_IF && (nivel === NIVEL_INICIAL || nivel === NIVEL_DENTRO_BLOCO)))){
			const firstChildren = blocoAtual.getChildren(true)[0]
			if(firstChildren && blocoAtual.getInputTargetBlock('if') != null) {
				movimentos.push({
					'condition': blocoAtual.getFieldValue('distancia'),
					'moves' : []
				})
				percorrerBlocosMovimento(firstChildren, movimentos.at(-1)['moves'], nivel+1, TIPO_IF)
			}
		}

		const nextBlock = blocoAtual.getNextBlock()
		if(nextBlock) {
			percorrerBlocosMovimento(nextBlock, movimentos, nivel, tipoPai)
		}
		
	}
}

async function executarMovimentos() {
	if(!workspace.getTopBlocks().length) {
		exibirErroInserirBloco()
	} else if(apenasUmaPilhaBlocos()) {
		toggleLoading()
		retirarErro()
		const ALL_BLOCKS = workspace.getAllBlocks()
		const FIRST_BLOCK = ALL_BLOCKS[0]
		const MOVIMENTOS = { 'moves': []}
		percorrerBlocosMovimento(FIRST_BLOCK, MOVIMENTOS['moves'], NIVEL_INICIAL, TIPO_VAZIO)

		if(MOVIMENTOS['moves'].length){
			
			const MOVIMENTOS_JSON = JSON.stringify(MOVIMENTOS)
			console.log(MOVIMENTOS)
			retirarErro()
			try {
				await fetch('http://localhost:5000/send-move-list?moves='+MOVIMENTOS_JSON, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					},
				})
			} catch (error) {
				console.log(error)
			}
			toggleLoading()
		}
		else{
			exibirErroInserirBloco()
			toggleLoading()
		}
		
		
		
		
	} else {
		exibirErroQuantidadePilhas()
	}
}

function toggleLoading() {
	if(button.getAttribute("disabled")) {
		button.removeAttribute("disabled")
	} else {
		button.setAttribute("disabled", "true")
	}
	loadingSpinner.classList.toggle("hidden")
}

function exibirErroQuantidadePilhas() {
	retirarAviso()
	erroPilhas.innerHTML = 'Apenas uma pilha de blocos é permitida!'
}

function exibirErroInserirBloco(){
	retirarAviso()
	erroPilhas.innerHTML = 'Insira algum bloco de movimento'
}

function retirarErro() {
	retirarAviso()
	erroPilhas.innerHTML = '&nbsp'
}

function apenasUmaPilhaBlocos() {
	return workspace.getTopBlocks().length == 1 ? true : false
}

function retirarAviso(){
	avisoPilhas.innerHTML = '&nbsp'
}