/* script para criar objeto com nome fornecido pelo usuario */

/******** definicao de variaveis aqui ********/

//aqui define quais layers vai ter no grupo de cada objeto default
//true para "sim" e false para "nao"
var vai_ter_layer_sombreamento = true;
var vai_ter_layer_sombras = true;
var vai_ter_layer_brilhos = true;
var vai_ter_layer_detalhes = true;

//aqui define os nomes das layes nos grupos
var nome_layer_sombreamento = "sombreamento";
var nome_layer_sombras = "sombras";
var nome_layer_brilhos = "brilhos";
var nome_layer_detalhes = "detalhes";

/******** fim definicao de variaveis ********/

// Currently active document.
var doc = app.activeDocument;
doc.suspendHistory("Script", "f()");


function dialog() {

  // Dialog box...
  var myWindow = new Window ("dialog", "Novo Objeto");

  // Keeps things inline
  myWindow.orientation = "row";

  // Informational text
  myWindow.add ("statictext", undefined, "Nome do objeto:");

  // This is the box where the size is inserted
  var myText = myWindow.add ("edittext", undefined, "");
  myText.characters = 5;
  myText.active = true;
 
  // Ok....
  myWindow.add ("button", undefined, "OK");
  if (myWindow.show () == 1) return myText.text;

}

function pegar_grupo_ativo(){

	var layerAtiva = doc.activeLayer;
	if(layerAtiva.typename == "LayerSet"){
		return layerAtiva;
	}
	//else
	return layerAtiva.parent;
}

function criarObjeto(nome_objeto){

	//grupo que recebera o grupo
	var grupo_ativo = pegar_grupo_ativo();
	//criar grupo
	var grupo_objeto = grupo_ativo.layerSets.add();

	//layers dentro do grupo
	var layer_objeto = grupo_objeto.artLayers.add();

	doc.activeLayer = grupo_objeto;
	grupo_objeto.name = nome_objeto;

	//layer objeto
	layer_objeto.name = nome_objeto;

	//layer sombras
	if(vai_ter_layer_sombreamento){
	  var layer_sombreamento = grupo_objeto.artLayers.add();
	  layer_sombreamento.name = nome_layer_sombreamento;
	  layer_sombreamento.grouped = true;
	}

	if(vai_ter_layer_sombras){
	  var layer_sombras = grupo_objeto.artLayers.add();
	  layer_sombras.name = nome_layer_sombras;
	  layer_sombras.grouped = true;  
	}

	if(vai_ter_layer_brilhos){
	  var layer_brilhos = grupo_objeto.artLayers.add();
	  layer_brilhos.name = nome_layer_brilhos;
	  layer_brilhos.grouped = true;
	}    

	if(vai_ter_layer_detalhes){
	  var layer_detalhes = grupo_objeto.artLayers.add();
	  layer_detalhes.name = nome_layer_detalhes;
	}

}

function f() {

	var nome_objeto = dialog();
	criarObjeto(nome_objeto);
}