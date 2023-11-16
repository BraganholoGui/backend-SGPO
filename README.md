# Versão node
v16.14.0
## Projeto.
SGPO - Sistema de Gestão de Processos Operacionais

## Esse projeto foi desenvolvido em Node.js e contem API's necessárias para o sistema SGPO.

### 📋 Tabela de Conteúdos

* [Status do Projeto](#Status-do-Projeto)
   * [Features](#features)
   * [Pre Requisitos](#pré-requisitos)
   * [Como usar](#back)
      * [Rodando o Back end](#Rodando-o-Back-End-(servidor))
   * [Tecnologias](#🛠-Tecnologias)

### ⚒️ Status-do-Projeto
	🚧  Em Produção...  🚧


### ❗ Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas:
[Git](https://git-scm.com), [Node.js](https://nodejs.org/en/). 
Além disto é bom ter um editor para trabalhar com o código como [VSCode](https://code.visualstudio.com/)

### 👉 Configure o .env
   DB_HOST="localhost"<br/>
   DB_USER="root"<br/>
   DB_PASS="Guilherme123"<br/>
   DB_NAME="teste"<br/>
   DB_PORT="3306"<br/>

<hr />

### ❗ Instale as dependências
   $ yarn

### 🚩 Execute a aplicação em modo de desenvolvimento
   $ yarn run start

<hr />

### 🖥️ O servidor inciará na porta:6001 - acesse <http://localhost:6001> 

<br />
<hr />

### 🛠-Tecnologias

As seguintes ferramentas foram usadas na construção do projeto:

- [Node.js](https://nodejs.org/en/)

### 🛠- Comandos Necessatios

#### 🛠- Configuração do banco de dados
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';<br>
flush privileges;

#### 🛠- Criar migration
yarn sequelize migration:create --name=create-users

#### 🛠- Criar seeds
yarn sequelize seed:generate --name users

#### 🛠- Subir models no banco de dados
yarn sequelize db:migrate

#### 🛠- Subir seeds no banco de dados
yarn sequelize db:seed:all