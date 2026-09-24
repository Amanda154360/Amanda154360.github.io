# 3D Print — Controle de Insumos e Peças

Projeto de disciplina: aplicação desktop em Electron para controle de
insumos (impressoras, filamento, bicos, mesas etc.) e peças impressas
em uma operação de impressão 3D.

## Stack

- [Electron](https://www.electronjs.org/) 41
- [MySQL](https://www.mysql.com/) via `mysql2`
- [Bootstrap 5](https://getbootstrap.com/) (offline, via `node_modules`)
- `dotenv` para configuração da conexão com o banco

## Pré-requisitos

- Node.js
- Um servidor MySQL acessível, com o banco de dados criado (ver
  [Banco de dados](#banco-de-dados))

## Configuração

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Copie `.env.example` para `.env` e preencha com as credenciais do
   seu banco:

   ```bash
   cp .env.example .env
   ```

   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=
   DB_PASSWORD=
   DB_NAME=impressos
   ```

3. Rode a aplicação:

   ```bash
   npm start
   ```

Ao iniciar, a aplicação testa a conexão com o banco (`connect` +
`ping`) e mostra um alerta caso falhe.

## Banco de dados

```sql
CREATE TABLE IF NOT EXISTS insumo (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tipo VARCHAR(50) NOT NULL,        -- Impressora, Filamento, Bico, Mesa de Impressao...
  nome VARCHAR(100) NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  data_aquisicao DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS peca_impressa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(100) NOT NULL,
  cor VARCHAR(50) NOT NULL,
  peso DECIMAL(10,2) NOT NULL,             -- peso da peca pronta, em gramas
  quantidade_material DECIMAL(10,2) NOT NULL, -- gramas de filamento usados
  tempo_impressao INT NOT NULL,            -- em minutos
  data_impressao DATE NOT NULL
);
```

## Estrutura do projeto

```
src/
  main/
    main.js       # processo principal: janela, menu nativo, tray, teste de conexão
    conexao.js     # conexão MySQL (lê credenciais do .env)
    icone.png       # ícone da bandeja do sistema
  renderer/
    frmPrincipal.html/.js   # tela principal
    frmInsumo.html/.js      # formulário de cadastro de Insumo
    frmPeca.html/.js        # formulário de cadastro de Peça Impressa
```

Os formulários de Insumo e Peça abrem como janelas modais a partir do
menu nativo **Cadastros** da janela principal.

## Status

Os formulários de cadastro ainda não persistem os dados no banco —
essa parte está pendente de implementação.
