# Jogo da Velha Multiplayer Responsivo

Este é um projeto de um jogo da velha (tic-tac-toe) multiplayer local, desenvolvido com HTML, CSS e JavaScript (ES6+), seguindo as melhores práticas de desenvolvimento web moderno. Este projeto foi gerado utilizando o Gemini CLI.

## Visão Geral

O jogo foi projetado para ser totalmente responsivo, funcionando perfeitamente em desktops e dispositivos móveis. A lógica do jogo, a manipulação da interface e o controle geral são separados em módulos JavaScript para maior clareza e manutenibilidade.

### Features

-   **Tabuleiro Dinâmico 3x3**: Renderizado com JavaScript.
-   **Multiplayer Local**: Dois jogadores (X e O) podem competir no mesmo dispositivo.
-   **Indicação de Turno**: Uma mensagem clara informa qual jogador deve jogar.
-   **Detecção de Vitória e Empate**: O jogo identifica automaticamente o fim da partida e exibe o resultado.
-   **Reiniciar Partida**: Um botão permite que os jogadores comecem um novo jogo a qualquer momento.
-   **Placar Persistente**: A pontuação é salva no `localStorage` do navegador e persiste entre as sessões.
-   **Design Moderno**: Interface limpa e agradável com animações sutis.

## Tecnologias Utilizadas

-   **HTML5**
-   **CSS3**
    -   Flexbox e Grid Layout para responsividade.
    -   Variáveis CSS para um tema fácil de manter.
-   **JavaScript (ES6+)**
    -   Módulos (`import`/`export`) para organização do código.
-   **Jest**: Para testes unitários da lógica do jogo.
-   **Babel**: Para transpilar o código e garantir a compatibilidade dos testes.

## Estrutura do Projeto

```
/velha-game
  /src
    index.html         # Estrutura principal da página
    style.css          # Estilização
    app.js             # Ponto de entrada, controle geral
    game.js            # Lógica do jogo (estado, regras)
    ui.js              # Manipulação do DOM
  /tests
    game.test.js       # Testes unitários para a lógica do jogo
  .gitignore
  babel.config.js      # Configuração do Babel para o Jest
  package.json         # Dependências e scripts
  README.md            # Este arquivo
```

## Como Rodar Localmente

Siga os passos abaixo para configurar e rodar o projeto em sua máquina local.

### Pré-requisitos

-   [Node.js](https://nodejs.org/) (que inclui o npm)
-   Um servidor web local (como o [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) para VS Code)

### 1. Clone o Repositório

```sh
git clone https://github.com/Willianson5522/jogo-da-velha.git
cd velha-game
```

### 2. Instale as Dependências

Este projeto usa o Jest para testes. Instale as dependências de desenvolvimento com o npm:

```sh
npm install
```

### 3. Inicie o Jogo

Abra o arquivo `src/index.html` com um servidor local. Se você estiver usando a extensão Live Server no VS Code, basta clicar com o botão direito no arquivo `index.html` e selecionar "Open with Live Server".

### 4. Rode os Testes

Para garantir que a lógica do jogo está funcionando como esperado, rode os testes unitários com o seguinte comando:

```sh
npm test
```

O Jest executará todos os arquivos de teste na pasta `/tests` e exibirá os resultados no terminal.

## Como Fazer o Deploy no GitHub Pages

Você pode facilmente hospedar este jogo gratuitamente usando o GitHub Pages.

1.  **Crie um Repositório no GitHub**: Se ainda não o fez, envie seu projeto para um novo repositório no GitHub.

2.  **Acesse as Configurações**: No seu repositório do GitHub, vá para a aba **Settings** (Configurações).

3.  **Vá para a Seção Pages**: No menu lateral esquerdo, clique em **Pages**.

4.  **Configure a Fonte de Deploy**:
    -   Em **Source**, selecione a branch que você deseja usar para o deploy (geralmente `main` ou `master`).
    -   Na mesma seção, escolha a pasta `/src` como a fonte para o deploy, pois é onde seus arquivos de jogo (HTML, CSS, JS) estão localizados.
    -   Clique em **Save**.

5.  **Acesse seu Jogo**: Após alguns minutos, seu site estará disponível no endereço exibido na seção do GitHub Pages (algo como `https://seu-usuario.github.io/nome-do-repositorio/`).

**Observação**: Como o GitHub Pages foi configurado para a pasta `/src`, ele encontrará o `index.html` automaticamente.
