# Scripts para Adobe Photoshop


O arquivo aplicar_multiplos_ajustes_jesga.jsx corresponde a um script com a finalidade de aplicar diversas layers de ajuste nas layers de um grupo, podendo este conter sublayers e até mesmo outras layers de ajuste.

Para utilizá-lo, basta colocar todas as layers e grupos de layers num único grupo com as layers de ajuste a serem aplicadas acima do grupo e depois vincular todas essas camadas de ajuste ao grupo (criar layer mask). Para tal, basta utilizar o comando alt+click entre as camadas de ajuste e também entre a mais próxima do grupo e o mesmo. Ao final, colocar tudo num mesmo grupo. A seguir, selecionar todas as layers de ajuste, clicar em File -> Scripts -> Browse e abrir o arquivo aplicar_multiplos_ajustes_jesga.jsx.

IMPORTANTE: dentre as layers envolvidas não podem haver layers invisíveis ou com atributo de cor estabelecido (sugiro clicar no grupo com o botão direito do mouse e selecionar a opção "No color").

A configuração para execução do script deve ficar mais ou menos assim:

![alt text](https://github.com/machadojeh/scripts_photoshop/blob/main/imgs/config_layers.png?raw=true)

ATENÇÃO!

O script funciona para a maioria dos casos, porém, há alguns em que não funciona 100% como deveria, os quais não consegui identificar o motivo ainda. Estou disponibilizando o código como cortesia pois ele tem me ajudado bastante, porém, sei que carece de diversos ajustes quanto à funcionalidade e desempenho. Fiquem à vontade para alterá-lo e promover melhorias!



