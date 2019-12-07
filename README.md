[![Build Status](https://travis-ci.org/LucasHenriqueP/ProjetoIntegrador.svg?branch=master)](https://travis-ci.org/LucasHenriqueP/ProjetoIntegrador)

# Projeto Integrador

Repositorio Para a disciplina BCC35C, onde desenvolvemos um aplicativo de cursos, é possível criar, se inscrever e avaliar um curso, veja mais sobre as funcionalidades mais abaixo.

# Tutorial Travis CI

Um breve tutorial sobre o Travis CI pode ser encontrado dentro da pasta _travis_, ou clicando [aqui](https://github.com/LucasHenriqueP/ProjetoIntegrador/tree/master/tutorial).

# Como executar o nosso projeto?

Primeiramente é necessário verificar duas coisas: Você está tentando rodar o projeto **ANTES** do dia 19/12/2019(para saber mais sobre isso, avance para o fim da página), e que você possui o SDK do Android instalado e configurada em seu computador, [siga este tutorial para saber mais!](https://docs.rocketseat.dev/ambiente-react-native/introducao)

Após isso, é necessário apenas acessar a pasta pelo terminal, rodar o seguinte comando (aconselhamos utilizar o yarn pois ele é mais rápido na instalação de dependências):

    yarn install

Este comando irá instalar todas as dependências atuais do projeto, caso você não tenha o yarn instalado, instale-o com o npm:

    sudo npm install -g yarn

Caso não tenha o npm instalado, [acesse este link](https://nodejs.org/en/download/), recomendamos instalar a versão mais recente

Após instalar as dependências, temos duas escolhas, instalar o aplicativo em modo de desenvolvimento, ou em modo de produção, ambos funcionam perfeitamente, porém, o ambiente de produção conta com ganhos de desempenho enormes, recomendamos instalar o ambiente de produção!

Para instalar o ambiente de desenvolvimento, primeiramente conecte o seu celular ao computador, [siga este tutorial](https://docs.rocketseat.dev/ambiente-react-native/usb/android), porém troque o último comando, caso queira o ambiente de desenvolvimento, primeiro instale o aplicativo no celular:

    yarn run-android

e logo em seguida inicie o servidor:

    yarn start

Caso queira o ambiente de produção:

    yarn release

# To-do

1. Procurar ferramentas/frameworks de teste react-native/typescript/javascript.
2. Montar ambiente com ferramentas de teste.

# Requisitos

Descrição: O Software deverá possibilitar que pessoas, anunciem e procurem cursos/aulas. Os usuários poderão procuram cursos de acordo com critérios específicos, como preço, faixa de preço, distância, descrição, professor, e também poderá filtrar por cursos específicos como por exemplo “Aulas de Violão”.

**Funcionalidades**

1. O Sistema deverá permite que novos usuários se cadastrem utilizando uma conta do Facebook, Google, ou informando
   - Nome
   - Email
   - Nome de usuário(Talvez)
   - Senha
   - Data de nascimento
   - Descrição(Opcional)
2. O Sistema deverá permitir que os usuários recuperem/troquem sua senha.
3. O Sistema deverá permitir que os usuários adicionem cursos aos seus curso favoritos.
4. O Sistema deverá permitir que os usuários avaliem seus cursos comprados.
5. O Sistema deverá permitir que os tutores/professores mandem mensagens para seus alunos.
6. O Sistema deverá permitir que os usuários busquem por cursos específicos.
7. O Sistema deverá permitir que os usuários filtrem os cursos por meio de
   - Faixa de preço.
   - Distancia.
   - Avaliação.
   - Categoria
8. O Sistema deverá permitir que os usuários possam criar cursos informando.
   - Titulo do Curso.
   - Descrição do Curso.
   - Disponibilidade: Remoto, localização fixa, deslocamento do professor.
   - Quantidade de hora/aula.
   - Preço por hora/aula ou preço total do curso.
   - Selecionar Categoria do curso.
9. O sistema deverá permitir que um usuário administrador possa excluir usuários do sistema.
10. O Sistema deverá permitir que um usuário administrador possa excluir cursos do sistema.

# História de usuário

1. Eu como professor quero me cadastrar no sistema para poder usar as funcionalidades do sistema.
2. Eu como aluno quero me cadastrar no sistema para poder usar as funcionalidades do sistema.
3. Eu como aluno quero ver meus cursos favoritos, para não perder um curso que gostei.
4. Eu como aluno quero avaliar meus cursos comprados, para dar meu feedback ao curso.
5. Eu como aluno quero buscar cursos perto de mim, para não me deslocar muito.
6. Eu como aluno quero ver meu histórico de cursos obtidos, para não perder meus cursos.
7. Eu como aluno quero buscar cursos por preços, para buscar cursos que eu possa pagar.
8. Eu como professor quero anunciar meus cursos, para poder vender meus cursos na plataforma.
9. Eu como professor quero falar com meus alunos, para poder mandar mensagens e avisos para todos meus alunos, ou alunos de um determinado curso.
10. Eu como professor quero falar com alunos individualmente, para poder ajudar individualmente meu alunos.
11. Eu como usuário administrador quero excluir um usuário pois ele infringiu alguma regra do sistema.
12. Eu como usuário administrador quero excluir um curso pois ele infringiu alguma regra do sistema.

# Dívida Tecnica

- Base de dados será excluída no dia 19/12/2019
- Chaves de API serão excluídas no dia 19/12/2019
- Não é feita a verificação de email antes de o usuário utilizar o aplicativo
- Login pelo facebook não foi implementado
- Não foram implementados testes automatizados

**Explicação**

No dia 19 de dezembro de 2019, a base de dados no firebase, e todas as chaves de API ligadas a ela serão excluídas imediatamente, já que elas estão expostas para todo mundo ver, não queremos ninguém se aproveitando de tais chaves.

Sendo assim, depois desse fatídico dia, o nosso aplicativo encerrará a sua atividade por tempo indeterminado.

Caso queira rodar o projeto depois disso, entre em contato comigo [pelo github](https://github.com/henriko202), ou por [email](mailto:henriko.foz@gmail.com) que te explicarei melhor!
