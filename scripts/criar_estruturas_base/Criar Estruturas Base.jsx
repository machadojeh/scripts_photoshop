/******** definicao de variaveis aqui ********/

var endereco_arquivo_estruturas = "/Users/jessicamachado/Desktop/arquivos/codigo_estruturas_base/estruturas_base.psd";

//nome do grupo com todas as estruturas
var nome_grupo_estruturas = "cor";

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

//ignora as layers que comecam com este termo
var ignorar_prefixo = "fundo";

/******** fim definicao de variaveis ********/



var doc = app.activeDocument;
doc.suspendHistory("Script", "f()");

cTID = function(s) { return app.charIDToTypeID(s); };
sTID = function(s) { return app.stringIDToTypeID(s); };

var personagens_dic;
var roupas_pessoas_dic;
var estrutura_animal;
var objetos_dic;

var refs_doc;

function endsWith(original, substring) {

  return original.substring( original.length - substring.length, original.length ) === substring;

}

//coloca grupo1 dentro do grupo2
function mover_grupo_para_outro(grupo1_nome,grupo2_nome){

  activeDocument.activeLayer = app.activeDocument.layerSets.getByName(grupo1_nome);
  var fromID =  activeDocument.activeLayer.id;
  //Move layerset to this layerSets
  activeDocument.activeLayer = app.activeDocument.layerSets.getByName(grupo2_nome); 
  var toID = activeDocument.activeLayer.id;
  moveLayerToLayerSet( fromID, toID);

}

function moveLayerToLayerSet( fromID, toID ){
  var desc = new ActionDescriptor();
  var ref = new ActionReference();
  ref.putIdentifier( charIDToTypeID('Lyr '), Number(fromID) );
  desc.putReference( charIDToTypeID('null'), ref );
  var ref2 = new ActionReference();
  ref2.putIndex( charIDToTypeID('Lyr '), getLayerIndexByID(toID) );
  desc.putReference( charIDToTypeID('T   '), ref2 );
  desc.putBoolean( charIDToTypeID('Adjs'), false );
  desc.putInteger( charIDToTypeID('Vrsn'), 5 );

  try{
    executeAction( charIDToTypeID('move'), desc, DialogModes.NO );
    }catch(e){alert(e);}
}

function getLayerIndexByID(ID){
  var ref = new ActionReference();
  ref.putIdentifier( charIDToTypeID('Lyr '), ID );
  try{ 

    activeDocument.backgroundLayer; 

    return executeActionGet(ref).getInteger(charIDToTypeID( "ItmI" ))-1; 

    }catch(e){ 

      return executeActionGet(ref).getInteger(charIDToTypeID( "ItmI" )); 

    }
}

function iniciar_estruturas(){

  personagens_dic = {};
  roupas_pessoas_dic = {};
  objetos_dic = {};

  var arquivoRef = new File(endereco_arquivo_estruturas);
  app.open(arquivoRef);
  refs_doc = app.activeDocument;

  //aqui eh soh um grupo
  estrutura_animal = refs_doc.layerSets.getByName("animal");

  //pegar as estruturas de personagens
  estruturas_personagens = refs_doc.layerSets.getByName("personagens");
  for(var i=0 ;i < estruturas_personagens.layers.length; i++){

    var personagem = estruturas_personagens.layers[i];
    personagens_dic[personagem.name] = personagem;

  }

  estruturas_pessoas = refs_doc.layerSets.getByName("roupas_pessoas");
  for(var i=0 ;i < estruturas_pessoas.layers.length; i++){

    var pessoa = estruturas_pessoas.layers[i];
    roupas_pessoas_dic[pessoa.name]= pessoa;

  }

  estrutura_objetos = refs_doc.layerSets.getByName("objetos");
  for(var i=0 ;i < estrutura_objetos.layers.length; i++){

    var objeto = estrutura_objetos.layers[i];
    objetos_dic[objeto.name]= objeto;

  }  

  //voltar para o primeiro arquivo
  app.activeDocument = doc;

}

//cria o grupo logo abaixo do grupo "rascunho"
function criar_grupo_arte(grupo_rascunho){
  //criar um grupo no documento
  var grupo_arte = doc.layerSets.add();
  grupo_arte.name = nome_grupo_estruturas;
  //mover para debaixo do grupo rascunho
  grupo_arte.move(grupo_rascunho, ElementPlacement.PLACEAFTER);
  return grupo_arte;
}

function criar_estruturas_personagens(grupo_personagens, grupo_arte){
  var novo_grupo = grupo_arte.layerSets.add();
  novo_grupo.name = "personagens";

  for(var j=grupo_personagens.layers.length-1; j>-1 ;j--){

    try {

      nome_personagem = grupo_personagens.layers[j].name;

      var grupo_temp = novo_grupo.layerSets.add();
      grupo_temp.name = "TEMP";
      app.activeDocument = refs_doc;
      var personagem_duplicado = personagens_dic[nome_personagem].duplicate(doc,ElementPlacement.PLACEATBEGINNING);
      app.activeDocument = doc;
      personagem_duplicado.move(grupo_temp, ElementPlacement.PLACEBEFORE);
      grupo_temp.remove();

    } catch (e){
      alert ("erro ao criar personagem");
    } 

  }
}

function criar_estruturas_pessoas(grupo_pessoas, grupo_arte){

  var novo_grupo = grupo_arte.layerSets.add();
  novo_grupo.name = "pessoas";

  for(var j=grupo_pessoas.layers.length-1; j>-1 ;j--){

    try {

      var nome_original = grupo_pessoas.layers[j].name;
      var nome_pessoa = nome_original.substring(0,nome_original.lastIndexOf("_"));
      tipo_pessoa = nome_original.substring(nome_original.lastIndexOf("_")+1,nome_original.length);

      var grupo_temp = novo_grupo.layerSets.add();
      grupo_temp.name = "TEMP";
      app.activeDocument = refs_doc;
      var pessoa_duplicada = roupas_pessoas_dic[tipo_pessoa].duplicate(doc,ElementPlacement.PLACEATBEGINNING);
      app.activeDocument = doc;
      pessoa_duplicada.name = nome_pessoa;
      pessoa_duplicada.move(grupo_temp, ElementPlacement.PLACEBEFORE);
      grupo_temp.remove();

    } catch (e){
      alert ("erro ao criar pessoa");
    }

  }
  
}

function criar_estruturas_objetos(grupo_objetos,grupo_arte){

  var novo_grupo = grupo_arte.layerSets.add();
  novo_grupo.name = grupo_objetos.name;
  var nome_singular = grupo_objetos.name.substring(0,grupo_objetos.name.lastIndexOf("s"));

  for(var j=grupo_objetos.layers.length-1; j>-1 ;j--){

    try {

      var nome_objeto = grupo_objetos.layers[j].name;
      var grupo_temp = novo_grupo.layerSets.add();
      grupo_temp.name = "TEMP";
      app.activeDocument = refs_doc;
      var objeto_duplicado = objetos_dic[nome_singular].duplicate(doc,ElementPlacement.PLACEATBEGINNING);
      app.activeDocument = doc;
      objeto_duplicado.name = nome_objeto;
      objeto_duplicado.move(grupo_temp, ElementPlacement.PLACEBEFORE);
      grupo_temp.remove();

    } catch (e){
      alert ("erro ao criar objeto");
    }

  }

}

function criar_estruturas_animais(grupo_animais, grupo_arte){

  var novo_grupo = grupo_arte.layerSets.add();
  novo_grupo.name = "animais";

  for(var j=grupo_animais.layers.length-1; j>-1 ;j--){

    try {

      var nome_animal = grupo_animais.layers[j].name;
      var grupo_temp = novo_grupo.layerSets.add();
      grupo_temp.name = "TEMP";
      app.activeDocument = refs_doc;
      var animal_duplicado = estrutura_animal.duplicate(doc,ElementPlacement.PLACEATBEGINNING);
      app.activeDocument = doc;
      animal_duplicado.name = nome_animal;
      animal_duplicado.move(grupo_temp, ElementPlacement.PLACEBEFORE);
      grupo_temp.remove();

    } catch (e){
      alert ("erro ao criar animal");
    }

  }

}

function verificar_nome_objeto_plural(nome_objeto){

	var nome_singular = nome_objeto.substring(0,nome_objeto.lastIndexOf("s"));
	return nome_singular != "" && objetos_dic[nome_singular] != undefined;

}

function verificar_nome_objeto(nome_objeto){

  //verificar se nome esta no plural
  var plural = endsWith(nome_objeto,"s");
  var nome_singular = nome_objeto;

  if(plural){
    //retira o "_s" do nome e poe "s"
    nome_singular = nome_objeto.substring(0,nome_objeto.lastIndexOf("s"));
  }

  return objetos_dic[nome_singular] != undefined;

}

function criar_objeto_predefinido(nome_objeto,grupo_arte){

  //objeto existe no dicionario
  if(verificar_nome_objeto(nome_objeto)){

	//verificar se nome esta no plural
	var plural = endsWith(nome_objeto,"s");
	var nome_singular = nome_objeto;

	if(plural){
		//retira o "_s" do nome e poe "s"
		nome_singular = nome_objeto.substring(0,nome_objeto.lastIndexOf("s"));
	} 	

    //copia o grupo do dicionario
    var grupo_temp = grupo_arte.layerSets.add();
    grupo_temp.name = "TEMP";
    app.activeDocument = refs_doc;
    var objeto_duplicado = objetos_dic[nome_singular].duplicate(doc,ElementPlacement.PLACEATBEGINNING);
    app.activeDocument = doc;
    objeto_duplicado.move(grupo_temp, ElementPlacement.PLACEBEFORE);
    objeto_duplicado.name = nome_objeto;
    grupo_temp.remove();

    return true;

  }

  //objeto nao existe no dicionario
  return false

}

function criar_objeto(layer_rascunho,grupo_arte){

  //cria grupo com o mesmo nome da layer
  var nome_objeto = layer_rascunho.name;

  //verifica se o objeto nao tem estrutura predefinida
  if(!criar_objeto_predefinido(nome_objeto,grupo_arte)){
    var grupo_objeto = grupo_arte.layerSets.add();
    grupo_objeto.name = nome_objeto;

    //cria layer com o mesmo nome
    var layer_objeto = grupo_objeto.artLayers.add();
    layer_objeto.name = nome_objeto;

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

}

function criar_estruturas_gerais(grupo_rascunho,grupo_arte){

  var layers_rascunho = grupo_rascunho.layers;
  // Loop through every layer...
  for( var i = layers_rascunho.length-1 ; i > -1 ; i-- ){

    var layerAtual = layers_rascunho[i];
    doc.activeLayer = layerAtual;

    //eh um grupo
    if(layerAtual.typename == "LayerSet"){

      //grupo de personagens
      if(layerAtual.name == "personagens"){

        criar_estruturas_personagens(layerAtual,grupo_arte);

      }
      //grupo de pessoas
      else if (layerAtual.name == "pessoas"){

        criar_estruturas_pessoas(layerAtual,grupo_arte);

      }
      //grupo de animais
      else if(layerAtual.name == "animais"){

        criar_estruturas_animais(layerAtual,grupo_arte);

      }
      else if(verificar_nome_objeto_plural(layerAtual.name)){

      	criar_estruturas_objetos(layerAtual,grupo_arte);

      }
      //grupo com outro nome
      else {
        //criar um grupo de mesmo nome dentro do grupo_arte
        var novo_grupo = grupo_arte.layerSets.add();
        novo_grupo.name = layerAtual.name;
        //primeiro grupo eh a fonte, segundo grupo eh o destino
        criar_estruturas_gerais(layerAtual,novo_grupo);
      }
    
    //eh uma layer
    } else if (layerAtual.typename == "ArtLayer"){//it's an art layer
      
      //ignora as layers que comecam com a string ignorar_prefixo
    	if(layerAtual.name.indexOf(ignorar_prefixo) != 0){
        //layer simples
        criar_objeto(layerAtual,grupo_arte);
    	}

    }

  }  
}

function f() {
	try {

	  // aqui precisa estar selecionado o grupo "rascunho"
	  var grupo_rascunho = doc.activeLayer;
    iniciar_estruturas();
    
    criar_estruturas_gerais(grupo_rascunho,criar_grupo_arte(grupo_rascunho));

    //fecha todos os grupos
    app.runMenuItem(stringIDToTypeID('collapseAllGroupsEvent'));
    
    //fechar arquivo de referencia
    refs_doc.close(SaveOptions.DONOTSAVECHANGES);

	} // try end
	 
	catch( e ) {
	  // remove comments below to see error for debugging
	  alert( e );
	}
}