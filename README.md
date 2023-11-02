# Scripts para Adobe Photoshop

## CRIAR ESTRUTURAS BASE

Dentro da pasta **criar_estruturas_base**, encontram-se os scripts e arquivos úteis para a execução dos códigos. São estes:

### Criar Objeto.jsx

O usuário deve inserir o nome do objeto a ser criado, resultando num grupo de mesmo nome, com uma layer homônima e outras layers conforme configurado no script, todas dentro do mesmo grupo. Por default, ele cria as layers "sombreamento", "sombras", "brilhos" e "detalhes". O grupo aparece dentro do grupo que estiver selecionado/ grupo em que se encontra a layer selecionada no momento da chamada do script.

### Criar Estruturas Base.jsx


Este script faz o mesmo que o anterior, porém, de forma automática, criando grupos com os nomes das layers que se encontram dentro do grupo selecionado no momento de sua chamada. Além disso, ele cria estruturas mais complexas, que devem ser configuradas dentro do arquivo **estruturas_base.psd**.

IMPORTANTE: os parâmetros para execução do código devem ser definidos dentro do próprio script, logo no início do arquivo. É imprescindível alterar o valor da variável **endereco_arquivo_estruturas** para o endereço completo em que se encontra o arquivo **estruturas_base.psd** no seu computador. Do contrário, o script não irá executar.

CASOS:

* **Grupo "personagens":** as layers ou grupos que se encontram dentro de um grupo chamado "personagens" no arquivo no qual será executado o script, darão origem a estruturas pré-definidas dentro do grupo "personagens" do arquivo **estruturas_base.psd**, desde que o nome da layer/ grupo seja exatamente igual ao de um personagem pré-definido. Caso não haja personagem de mesmo nome, uma mensagem de erro será exibida.

* **Grupo "pessoas":** as layers ou grupos que se encontram dentro de um grupo chamado "pessoas" no arquivo no qual será executado o script, darão origem a estruturas pré-definidas dentro do grupo "roupas_pessoas" do arquivo **estruturas_base.psd**. Aqui, para cada layer/ grupo o script cria uma estrutura de mesmo nome, com conteúdo da estrutura referente à roupa indicada, que deve proceder o nome da layer/ grupo.

Exemplo: layer/grupo "menina_calca" dá origem a uma estrutura de nome "menina" igual a estrutura "calca" que se encontra dentro do grupo "roupas pessoas" do arquivo **estruturas_base.psd**.

Caso não haja roupa de mesmo nome, uma mensagem de erro será exibida.

* **Grupo "animais":** cada layer ou grupo que se encontra dentro de um grupo chamado "animais" no arquivo no qual será executado o script, dará origem a uma estrutura pré-definida no arquivo **estruturas_base.psd** de nome "animal", porém, com o nome da layer/ grupo inicial.

* **Objetos pré-definidos:** 
	* **Layers:** as layers que possuírem nome igual a qualquer uma das estruturas pré-definidas no arquivo **estruturas_base.psd** dentro de seu grupo "objetos", darão origem à respectiva estrutura.
	* **Grupos:** os grupos que possuírem nome igual a uma das supracitadas estruturas, porém, seguido por "s" (ex.: arvores), darão origem a um grupo de mesmo nome, onde cada layer ou grupo que se encontra dentro do grupo original dará origem a uma estrutura correspondente ao objeto de nome do grupo que a contém (sem o s). Os nomes de cada uma dessas estruturas se mantêm.


## APLICAR MÚLTIPLOS AJUSTES

O arquivo **aplicar_multiplos_ajustes_jesga.jsx**, que se encontra dentro da pasta **aplicar_multiplos_ajustes**, corresponde a um script com a finalidade de aplicar diversas layers de ajuste nas layers de um grupo, podendo este conter subgrupos e até mesmo outras layers de ajuste.

Para utilizá-lo, basta colocar todas as layers e grupos de layers num único grupo com as layers de ajuste a serem aplicadas acima do grupo e depois vincular todas essas camadas de ajuste ao grupo (criar layer mask). Para tal, basta utilizar o comando *alt+click* entre as camadas de ajuste e também entre a mais próxima do grupo e o mesmo. Ao final, colocar tudo num mesmo grupo. A seguir, selecionar todas as layers de ajuste, clicar em *File -> Scripts -> Browse* e abrir o arquivo **aplicar_multiplos_ajustes_jesga.jsx**.

IMPORTANTE: dentre as layers envolvidas não podem haver layers invisíveis ou com atributo de cor estabelecido (sugiro clicar no grupo com o botão direito do mouse e selecionar a opção "No color").

A configuração para execução do script deve ficar mais ou menos assim:

![alt text](https://github.com/machadojeh/scripts_photoshop/blob/main/imgs/config_layers.png?raw=true)

**ATENÇÃO:** O script funciona para a maioria dos casos, porém, há alguns em que não funciona 100% como deveria, os quais não consegui identificar o motivo ainda. Estou disponibilizando o código como cortesia pois ele tem me ajudado bastante, porém, sei que carece de diversos ajustes quanto à funcionalidade e desempenho. Fiquem à vontade para alterá-lo e promover melhorias!



