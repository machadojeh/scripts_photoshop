var docRef = app.activeDocument;

cTID = function(s) { return app.charIDToTypeID(s); };
sTID = function(s) { return app.stringIDToTypeID(s); };

function getLayerColourByID(ID) { 

    var ref = new ActionReference(); 
    ref.putProperty( charIDToTypeID("Prpr") ,stringIDToTypeID('color')); 
    ref.putIdentifier(charIDToTypeID( "Lyr " ), ID );
    return typeIDToStringID(executeActionGet(ref).getEnumerationValue(stringIDToTypeID('color'))); 

}

//identifica se a layer atual tem propriedade de cor
function colourMarkedLayer(layer){

    docRef.activeLayer = layer;
    var ref = new ActionReference(); 
    ref.putEnumerated( charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt") ); 
    var appDesc = executeActionGet(ref); 
    if(appDesc.getEnumerationValue(stringIDToTypeID('color')) != 1315925605) return true;
    return false;

}

function layerColour(colour, layer) {

    docRef.activeLayer = layer;
    switch (colour.toLocaleLowerCase()){
        case 'red': colour = 'Rd  '; break;
        case 'orange' : colour = 'Orng'; break;
        case 'yellow' : colour = 'Ylw '; break;
        case 'yellow' : colour = 'Ylw '; break;
        case 'green' : colour = 'Grn '; break;
        case 'blue' : colour = 'Bl  '; break;
        case 'violet' : colour = 'Vlt '; break;
        case 'gray' : colour = 'Gry '; break;
        case 'none' : colour = 'None'; break;
        default : colour = 'None'; break;
        }
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putEnumerated( charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt') );
    desc.putReference( charIDToTypeID('null'), ref );
    var desc2 = new ActionDescriptor();
    desc2.putEnumerated( charIDToTypeID('Clr '), charIDToTypeID('Clr '), charIDToTypeID(colour) );
    desc.putObject( charIDToTypeID('T   '), charIDToTypeID('Lyr '), desc2 );
    executeAction( charIDToTypeID('setd'), desc, DialogModes.NO );

};

function newGroupFromLayers(doc) {
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putClass( sTID('layerSection') );
    desc.putReference( cTID('null'), ref );
    var lref = new ActionReference();
    lref.putEnumerated( cTID('Lyr '),
        cTID('Ordn'), cTID('Trgt') );
    desc.putReference( cTID('From'), lref);
    executeAction( cTID('Mk  '), desc,
        DialogModes.NO );
};

function undo() {
    executeAction(cTID("undo", undefined,
    DialogModes.NO));
};

function getSelectedLayers(doc) {
    var selLayers = [];
    newGroupFromLayers();

    var group = doc.activeLayer;
    var layers = group.layers;

    for (var i = 0; i < layers.length; i++) {
        selLayers.push(layers[i]);
    }

    undo();

    return selLayers;
};

// retorna o novo contador
function handleNewAdjustmentLayers(currentIndex,layerSet) {

    var clippedLayers = [];
    var newAdjustmentLayers = [];

    //pegar todas as layers de ajuste que encontrar
    for(var x = currentIndex ; x < layerSet.layers.length; x++){

        //layer esta vinculada
        if ( layerSet.layers[x].grouped ) {

            clippedLayers.push(layerSet.layers[x]);
        }
        //layer ou grupo que recebeu os ajustes
        else { 
            var newLayerOrGroup = layerSet.layers[x]; //ultima layer ou grupo da "pilha"
            
            //verificar dentro do grupo quem eh layer de ajuste e quem nao eh
            for (var i = 0; i < clippedLayers.length; i++){

                var auxAdjustLayers = [];
                //se for layer de ajuste eu guardo nos dois vetores
                if(clippedLayers[i].kind != LayerKind.NORMAL){

                    newAdjustmentLayers.push(clippedLayers[i]);

                } else { //se for layer normal eu aplico todos efeitos anteriores

                    adjustLayerOrGroup(clippedLayers[i],newAdjustmentLayers);

                }
            }

            //aplicar ultimos ajustes
            adjustLayerOrGroup(newLayerOrGroup,newAdjustmentLayers);
            
            //preciso deixar essas layers de ajuste todas da cor roxa
            //para serem ignoradas da proxima vez
            for (var i = 0; i < newAdjustmentLayers.length; i++){

                layerColour("Violet",newAdjustmentLayers[i]);
            }

        }
        
    }

}

function adjustLayerOrGroup (layerOrGroup, adj_layers) {

    //eh apenas uma layer normal
    if (layerOrGroup.typename != "LayerSet" ) {

            var currentLayer = layerOrGroup;
            var isGrouped = currentLayer.grouped;
            var layer;

            //aplica todas as layers de ajuste nessa layer
            for(var j = adj_layers.length -1 ; j > -1; j--) {

                if (getLayerColourByID(adj_layers[j].id) != "violet") {

                    var adj_layer = adj_layers[j];

                    layer = adj_layer.duplicate(currentLayer, ElementPlacement.PLACEBEFORE);

                    //manter o nome original da layer
                    layer.name = currentLayer.name;

                    docRef.activeLayer = layer;

                    layer.grouped = true;

                   if(layer.grouped) { //conseguiu vincular a layer

                        executeAction(stringIDToTypeID("mergeLayersNew"), undefined, DialogModes.NO);
                    
                    } else { //nao conseguiu vincular a layer

                        docRef.activeLayer.grouped = true;
                        executeAction(stringIDToTypeID("mergeLayersNew"), undefined, DialogModes.NO);
                    } 

                }          
            }

            //era uma layer agrupada
            if(isGrouped){
                layerColour("Orange",docRef.activeLayer);
            }

    }
    //eh um grupo
    else {
        //para cada layer do grupo fazer esta operacao
        for (var n = 0; n < layerOrGroup.layers.length; n++) {

            var set = layerOrGroup;
            var currentLayer = set.layers[n];

            //layer normal
            if (currentLayer.typename == "ArtLayer" ){

                //layer normal
                if (currentLayer.kind == LayerKind.NORMAL){

                    var layer;
                    var isGrouped = currentLayer.grouped;

                    //aplica todas as layers de ajuste nessa layer
                    for(var j = adj_layers.length -1 ; j > -1; j--) {

                        //layer ainda não trabalhada
                        if(getLayerColourByID(adj_layers[j].id) != "violet"){

                            var adj_layer = adj_layers[j];

                            layer = adj_layer.duplicate(currentLayer, ElementPlacement.PLACEBEFORE);

                            //manter o nome original da layer
                            layer.name = currentLayer.name;

                            docRef.activeLayer = layer;

                            layer.grouped = true;

                            if(layer.grouped) { //conseguiu vincular a layer

                                executeAction(stringIDToTypeID("mergeLayersNew"), undefined, DialogModes.NO);
                            
                            } else { //nao conseguiu vincular a layer

                                docRef.activeLayer.grouped = true;
                                executeAction(stringIDToTypeID("mergeLayersNew"), undefined, DialogModes.NO);
                            }
                        }
 
                    }

                    //era uma layer agrupada
                    if(isGrouped){
                        layerColour("Orange",docRef.activeLayer);
                    }                    

                } 
                else if (getLayerColourByID(currentLayer.id) != "violet"){ //eh uma layer de ajuste nao tratada

                    //*se a layer de ajuste ja foi tratada eu so ignoro ela
                    handleNewAdjustmentLayers(n,layerOrGroup);

                }

            }
            else { //eh um grupo (currentLayer.typename == LayerSet)
                //chama funcao de forma recursiva aplicando os mesmos ajustes
                adjustLayerOrGroup(currentLayer,adj_layers);
            }

        }
    }

}

//reajustar as layers agrupadas
function adjustGroupedLayers(parentLayer){

    for(var i = parentLayer.layers.length -1 ; i > -1; i--){
        curLayer = parentLayer.layers[i];
        docRef.activeLayer = curLayer;

        if(curLayer.typename =='LayerSet'){
            adjustGroupedLayers (curLayer)
        }
        else if(colourMarkedLayer(curLayer)){
                curLayer.grouped = true;
                if(!curLayer.grouped){
                    curLayer.grouped = true;
                }
                //se for layer roxa ela tem que sumir
                if (getLayerColourByID(curLayer.id) == "violet") {
                    //curLayer.visible = false;
                    curLayer.remove();
                }
                else{ //laranja
                    layerColour("none",curLayer);
                }
        }
    }
}


function f() {

    //pega as layers selecionadas
    var selectedLayers = getSelectedLayers(app.activeDocument);

    //grupo a qual a layer de ajuste pertence (pode ser o documento)
    var parent = selectedLayers[0].parent;

    var layerGroup;

    //pegar o grupo em que quero mexer
    for (var n = 0; n < parent.layers.length; n++) {
        if( !parent.layers[n].grouped ) {
            layerGroup = parent.layers[n];
            break;
        }
    }

    //para cada layer de ajuste fazer esta operacao

    adjustLayerOrGroup(layerGroup,selectedLayers);

    //apagar as layers de ajuste
    for(var i = 0; i < selectedLayers.length; i++)
    {
        selectedLayers[i].remove();
    }

    //revincular layers laranjas
    adjustGroupedLayers(parent);

}


f();