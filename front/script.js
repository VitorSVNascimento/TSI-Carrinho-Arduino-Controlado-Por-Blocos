const button = document.getElementById("btnExecute")
const erroPilhas = document.getElementById("errorDiv")
const loadingSpinner = document.getElementById("loadingSpinner")

button.addEventListener("click", executarMovimentos)

function percorrerBlocosMovimento(blocoAtual, movimentos, nivel) {
	if(blocoAtual) {
		if(blocoAtual.type === 'loop_block' && nivel === 0) {
			const firstChildren = blocoAtual.getChildren(true)[0]
			if(firstChildren && blocoAtual.getInputTargetBlock('DO') != null) {
				movimentos.push({
					'repetitions': blocoAtual.getFieldValue('TIMES'),
					'moves' : []
				})
				percorrerBlocosMovimento(firstChildren, movimentos.at(-1)['moves'], nivel+1)
			}
		} else if(blocoAtual.type === 'movimentos'){
			movimentos.push(blocoAtual.getFieldValue('movimento'))
		} 

		const nextBlock = blocoAtual.getNextBlock()
		if(nextBlock) {
			percorrerBlocosMovimento(nextBlock, movimentos, nivel)
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
		percorrerBlocosMovimento(FIRST_BLOCK, MOVIMENTOS['moves'], 0)

		if(MOVIMENTOS['moves'].length){
			
			const MOVIMENTOS_JSON = JSON.stringify(MOVIMENTOS)
			console.log(MOVIMENTOS_JSON)
			retirarErro()
			try {
				await fetch('http://localhost:5000/send-move-list', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: MOVIMENTOS_JSON
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