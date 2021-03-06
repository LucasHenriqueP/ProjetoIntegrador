# Travis CI

**Conceitos Básicos**

**O que integração contínua ?**

Integração Contínua é a prática de mesclar pequenas alterações de código com freqüência - em vez de mesclar em uma grande alteração no final de um ciclo de desenvolvimento. O objetivo é desenvolver softwares mais saudáveis, desenvolvendo e testando em incrementos menores. É aqui que entra o Travis CI.

Como uma plataforma de integração contínua, o Travis CI oferece suporte ao seu processo de desenvolvimento, construindo e testando automaticamente alterações de código, fornecendo feedback imediato sobre o sucesso da alteração.

**Builds e Automação**

Quando você roda uma build, o Travis clona o seu repositório do GitHub num ambiente virtual, e então roda uma série de tarefas para construir e testar o seu código. Se alguma dessas tarefas falhar, essa sua build é considerada _broken_, caso nenhum falhe, ela é considerada como _passed_, e então o Travis irá mandar o seu código para produção, ou seja, atualizar o host da sua aplicação para a versão mais recente do projeto.

O Travis também tem outros tipos de automação, como por exemplo mandar uma notificação no Slack, mandar para produção após fazer uma build, etc.

**Builds, Jobs, Stages e Phases**

    Phase - Também chamado de fase, são os passos sequenciais de uma tarefa, como a fase de instalação, a fase de script e a fase de deploy.

    Job - Também chamado de tarefa, é um processo automatizado que clona o seu repositório em um ambiente virtual e roda uma série de fases, como compilar o código, rodar testes, etc.

    Build - Um grupo de jobs, por exemplo uma build pode ter dois jobs, que testam o projeto em versões diferentes de uma linguagem. A build irá terminar quando todos os jobs estiverem terminados.

    Stage - Também chamado de estágio, é um grupo de jobs que rodam em paralelo em parte de uma build sequencial composta de vários de vários estágios.

**Build = Broken**

Uma build é considerada _broken_(quebrada) quando um ou mais jobs não passarem.

    Errored - Um comando na fase before_install, install, ou before_script retornou com erro, o job é parado imediatamente.

    Failed - Um comando na fase de script retornou com erro, o job continua até completar.

    Canceled - Um usuário cancelou o job antes de completar.

# Tutorial Travis CI

**Começando**

1. Vá até [Travis-ci.com](https://travis-ci.com/) e entre com a sua conta do GitHub.
2. Adicione um arquivo .travis.yml no seu repositório, esse arquivo irá dizer ao Travis o que fazer, no nosso repositório terá um exemplo desse arquivo, consulte-o para mais detalhes.
3. Faça um commit, de um push nele e isso irá acionar um gatilho de build do Travis.
4. Cheque se a sua build passou ou falhou, para verificar isso vá no site do Travis e selecione o seu repositório.

**Configuração .travis.yml**

A primeira coisa que precisamos definir no arquivo de configuração é a linguagem que será utilizada no projeto, como no exemplo abaixo.

    language: node_js

Neste exemplo estamos utilizando o node.js como linguagem, [aqui](https://docs.travis-ci.com/user/languages/) temos uma lista completa de linguagens disponíveis para se usar com o Travis.

Usando apenas estas configurações Travis irá clonar o repositório, executar o comando npm install, e depois npm test. Com isto será executado o script de teste definido no package.json de seu projeto. em neste tutorial o script é o seguinte:

    "scripts": {
        "test": "echo \"Script de teste\" && exit 0"
    }

Este script não realiza nenhum teste específico, mas retorna 0, com o travis qualquer retorno 0 é considerado sucesso, mas também é possível adicionar nossos próprios testes com outros frameworks como mocha, e gulp.

**Badges**

Uma nuance interessante do Travis é o sistema de badges, que irá por exemplo indicar o estado da sua build dentro do arquivo README do seu projeto, fazer isso é extremamente fácil, apenas acesse o seu repositório no Travis, clique na badge do lado do nome do projeto (estará escrito build nela) e selecione o FORMAT markdown, após isso é só copiar e colar no seu texto readme, como visto na badge a seguir [![Build Status](https://travis-ci.org/LucasHenriqueP/ProjetoIntegrador.svg?branch=master)](https://travis-ci.org/LucasHenriqueP/ProjetoIntegrador)

# Automação de Workflow com o Gulp

Iremos criar uma automação de workflow com o [gulp.js](https://gulpjs.com/), e configurar o travis para executar os testes criado por nós, primeiramente precisamos [instalar](https://gulpjs.com/docs/en/getting-started/quick-start) o gulp.js utilizando o ```npm isntall --global gulp-cli``` dentro do seu projeto node.js, logo após isso é necessário ter um arquivo _gulpfile.js_ igual o mostrado abaixo
    
    function defaultTask(cb) {
        // place code for your default task here
        cb();
    }

    exports.default = defaultTask

Após isso iremos rodar o teste no terminal utilizando o comando ```gulp``` (Atenção, essa etapa é apenas para teste, já que no Travis é diferente)

Agora no ```.travis.yml``` é necessário adicionar dois novos componentes, o _before\_script_ e o _script_, como mostrado no exemplo abaixo:

    before_script:
        - npm install gulp-cli -g
    script: gulp ola

Essa alteração irá instalar o gulp toda vez no travis e executar o script "ola". Veja o nosso exemplo abaixo de uma task default e uma task chamada ola, note que no ```.travis.yml``` apenas a task "ola" é chamada, caso você não passe nenhuma task específica o gulp irá chamar a exportada por default.

    const gulp = require("gulp")

    function defaultTask(cb) {
        console.log("Função Default!")
        cb();
    }

    gulp.task('ola', function (cb) {
        console.log("Funcionou")
        cb();
    })

    exports.default = defaultTask
    
Com Travis também é possível definir uma lista de emails que receberão email quando uma build falhar, ou quando uma build passar.
Para fazer isso basta definir no arquivo .travis.yml a seguinte instrução

    notifications:
       email:
        - seuemail@email.com
