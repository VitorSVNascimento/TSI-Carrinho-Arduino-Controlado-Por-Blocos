const avisoPilhas = document.getElementById("warningDiv")

Blockly.Blocks["movimentos"] = {
    init: function () {
        this.appendDummyInput()
        .appendField("Movimento")
        .appendField(
            new Blockly.FieldDropdown([
            ["frente", "frente"],
            ["ré", "ré"],
            ["esquerda", "esquerda"],
            ["direita", "direita"],
            ]),
            "movimento"
        )
        this.setInputsInline(false)
        this.setPreviousStatement(true, null)
        this.setNextStatement(true, null)
        this.setColour(225)
        this.setTooltip("Bloco de movimento")
    },
}
  
Blockly.Blocks["loop_block"] = {
    init: function() {
        this.appendDummyInput("loop")
            .appendField("Faça")
            .appendField(new Blockly.FieldNumber(1, 1), "TIMES")
        const input = this.appendStatementInput("DO")
        input.appendField("vez(es)")
        input.setCheck("movimentos")
        this.setPreviousStatement(true, "loop_block")
        this.setNextStatement(true, null)
        this.setColour(90)
        this.setTooltip("Bloco de repetição simples (ATENÇÃO: blocos de loop aninhados serão ignorados).")

        this.setOnChange(function(event){
            let reason = event.reason
            if(reason){
                if(reason.includes('connect')){
                    let blocoDentroInput = this.getInputTargetBlock('DO');
                    let temBlocosRepeticao = false
                    if(blocoDentroInput){
                        do{ 
                            if(blocoDentroInput.type === 'loop_block'){
                                temBlocosRepeticao = true
                                break
                            }
                        }while (blocoDentroInput = blocoDentroInput.getNextBlock());
                        if(temBlocosRepeticao){
                            exibirAviso()
                        }
                    }
                }
            }
            
        }) 

        
    }
}

function exibirAviso(){
    erroPilhas.innerHTML = '&nbsp'
    avisoPilhas.innerHTML = "Loops aninhados ou vazios não serão considerados!"
}

const toolbox = {
    "kind": "flyoutToolbox",
    "contents": [
        {
            "kind": "block",
            "type": "movimentos"
        },
        {
            "kind": "block",
            "type": "loop_block"
        }
    ]
}

const blocklyArea = document.getElementById("blocklyArea")
const blocklyDiv = document.getElementById("blocklyDiv")
const workspace = Blockly.inject(blocklyDiv,
    {
        toolbox,  
        trashcan: true
    }
)

var onresize = function(e) {
// Compute the absolute coordinates and dimensions of blocklyArea.
    var element = blocklyArea
    var x = 0
    var y = 0
    do {
        x += element.offsetLeft
        y += element.offsetTop
        element = element.offsetParent
    } while (element)
    // Position blocklyDiv over blocklyArea.
    blocklyDiv.style.left = x + "px"
    blocklyDiv.style.top = y + "px"
    blocklyDiv.style.width = blocklyArea.offsetWidth + "px"
    blocklyDiv.style.height = blocklyArea.offsetHeight + "px"
    Blockly.svgResize(workspace)
}
window.addEventListener("resize", onresize, false)
onresize()