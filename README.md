# Ma - Governance 🏛️

## Esse projeto foi desenvolvido em Node.js e contem API's necessárias para o sistema do MA - Governance.

### 📋 Tabela de Conteúdos

* [Status do Projeto](#Status-do-Projeto)
   * [Features](#features)
   * [Pre Requisitos](#pré-requisitos)
   * [Como usar](#back)
      * [Rodando o Back end](#Rodando-o-Back-End-(servidor))
   * [Tecnologias](#🛠-Tecnologias)

### ⚒️ Status-do-Projeto
	🚧  Em construção...  🚧

### ✔️ Features

- [x] Cadastro de usuário
- [x] Cadastro de demanda
- [x] Cadastro de tipo de demanda
- [x] Cadastro de despesa
- [x] Cadastro de tipo de despesa
- [x] Cadastro de meta
- [x] Cadastro de tipo de instituto
- [x] Cadastro de origem
- [x] Cadastro de forma de pagamentos
- [x] Cadastro de demandante
- [x] Cadastro de proposição
- [x] Cadastro de tipo de proposição
- [x] Cadastro de formulaário de recibo
- [x] Cadastro de receita
- [x] Cadastro de tipo de receita
- [x] Cadastro de esquadrão
- [x] Cadastro de tarefa
- [x] Cadastro de tema
- [x] Cadastro de demandante

### ❗ Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas:
[Git](https://git-scm.com), [Node.js](https://nodejs.org/en/). 
Além disto é bom ter um editor para trabalhar com o código como [VSCode](https://code.visualstudio.com/)


### 🚩 Clone este repositório
   $ git clone <https://GuilhermeBraganholo@bitbucket.org/danilomendes/ma-governance-api.git>

### 👉 Configure o .env
   DB_HOST=128.199.5.141<br />
   DB_USER="root"<br />
   DB_PASS="cleanDEV123456!@#"<br />
   DB_NAME="magovernance"<br />
   DB_PORT="3306"<br />
   APP_SECRET="20clean-farm-app20-devops"<br />
   BASE_URL_FRONT="https://treineaqui.cleandev.com.br/" <br />
   EMAIL_USER="cleandev.contato@gmail.com"<br />
   EMAIL_PASS="facilita#2020"<br />
   CRON_TIMER="0 0 6 * * 1-5"<br />
   EMAIL_NOTIFICA="danilocesarmendes@gmail.com; breno14mota@gmail.com"<br />

<hr />

### ❗ Instale as dependências
   $ yarn

### 🚩 Execute a aplicação em modo de desenvolvimento
   $ yarn dev

<hr />

### 🖥️ O servidor inciará na porta:6001 - acesse <http://localhost:6001> 

<br />
<hr />

### ☁️ Rodando-o-Back-End-(servidor)

```bash
# Acesse a pasta do projeto no terminal/cmd
$ cd ambiente

# Vá para a pasta ma-governance-api
$ cd ma-governance-api

# Atualize o repositório
$ git pull

# Volte para a pasta ambiente
$ cd ..

# Pare a aplicação docker
$ docker-compose stop ma-governance-api

# Inicie a aplicação novamente com o docker
$ docker-compose up -d ma-governance-api

```

### 🛠-Tecnologias

As seguintes ferramentas foram usadas na construção do projeto:

- [Node.js](https://nodejs.org/en/)