# Teste Técnico - Desenvolvimento Web
## Shopper.com.br

## Especificações do Teste
- Back-end de um serviço que gerencia a leitura individualizada de
consumo de água e gás. Para facilitar a coleta da informação, o serviço utilizará IA para
obter a medição através da foto de um medidor.

- O desafio propos a utilização do [Google Gemini](https://ai.google.dev/gemini-api/docs/vision)

**Geração de uma API KEY**
- Para utilização desta LLM, será necessária a criação de uma [API_KEY](https://ai.google.dev/gemini-api/docs/api-key)

## Tecnologias Utilizadas

- **Node.js 18**: Ambiente de execução
- **TypeScript**: Superset do JavaScript
- **Prisma**: ORM (Object Relational Mapper)
- **SQLite**: Banco de dados
- **Vitest**: Framework de testes unitários
- **Docker**: Plataforma de containerização


## Setup e instalação

### Clone do Projeto
  Utilize o [git](https://git-scm.com/downloads) para realizar o clone do projeto por meio do comando:
```bash
git clone https://github.com/fgmarcal/leitura_imagem_nodejs.git
```

### Variáveis de ambiente
  Crie um arquivo *.env* na pasta raiz do projeto após o clone e configure a propriedade **GEMINI_API_KEY=**

  Cole a key gerada no campo indicado:

    GEMINI_API_KEY=<your_api_key>

### Build do projeto
  Na pasta do projeto, faça o build do ambiente [Docker](https://www.docker.com/) utilizando o comando abaixo:
```bash
docker compose build
```
  Na pasta do projeto, inicialize o ambiente [Docker](https://www.docker.com/) utilizando o comando abaixo:
  *Importante salientar que o comando abaixo inicializará o container e utilizará o terminal como console.*
```bash
docker compose up
```
  - Caso não deseje visualizar as mensagens do console, inicialize o container em segundo plano com o comando abaixo:
```bash
docker compose up -d
```


## Endpoints
A aplicação será inicializada por padrão no <host>*localhost:3000*, porém a porta pode ser configurada na variavel de ambiente por meio da propriedade **PORT=**.

  Método HTTP: [POST]

  *<host>/upload*

  **Request Body**
```
{
  "image": "base64",
  "customer_code": "string",
  "measure_datetime": "datetime",
  "measure_type": "WATER" ou "GAS"
}
```

A propriedade **image** deve receber uma string base64 no seguinte formato:

```cmd
"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAcsA ..."
```


  Método HTTP: [PATCH]
  
  <host>/confirm 

  **Request Body**

```
{
  "measure_uuid": "string",
  "confirmed_value": integer
}
```

  Método HTTP [GET]
  
  <host>/<customer_code>/list 

  - Este endpoint aceita query parameter "measure_type" que deve ser "WATER" ou "GAS"
  - Se o parâmetro for informado, o filtro apenas retorna o tipo especificado.
  - Caso não seja informado, retorna uma lista com todas as medições do cliente.
    
        /<customer_code>/list?measure_type=WATER


## Tratamento de Exceções e Erros

**Status Code 400: BAD_REQUEST**

*INVALID_DATA* 

    {
        errorCode:"INVALID_DATA",
        errorDescription:"Há campos inválidos na requisição",
        status:400
    }

*INVALID_TYPE*

    {
        errorCode:"INVALID_TYPE",
        errorDescription:"Tipo de medição não permitida",
        status:400
    }

**Status Code 404: NOT_FOUND**

*MEASURE_NOT_FOUND*

    {
        errorCode:"MEASURE(S)_NOT_FOUND",
        errorDescription:"Nenhuma leitura encontrada",
        status:404
    }

*CUSTOMER_NOT_FOUND*

    {
        errorCode:"CUSTOMER_NOT_FOUND",
        errorDescription:"Nenhum cliente encontrado",
        status:404
    }

**Status Code 409: CONFLICT**

*CONFIRMATION_DUPLICATE*

    {
        errorCode:"CONFIRMATION_DUPLICATE",
        errorDescription:"Leitura do mês já realizada",
        status:409
    }


*DOUBLE_REPORT*

    {
        errorCode:"DOUBLE_REPORT",
        errorDescription:"Leitura do mês já realizada",
        status:409
    }

**Status Code 421: MISDIRECT REQUEST**

*AI_ERROR*

    {
        errorCode:"AI_ERROR",
        errorDescription:"Erro com o servidor da AI",
        status:421
    }

## Notas Adicionais

Durante o desenvolvimento da aplicação a IA apresentou comportamento errático e muitas das vezes, mesmo seguindo a documentação oficial, 
não retornou um resultado satisfatório de leitura de imagem, sendo assim, houve a motivação de criação do erro "AI_ERROR" para tratar
as chamadas mal sucedidas junto à inteligência artificial utilizada.

Neste caso, a aplicação retorna como referência o inteiro -1 para dar andamento no processo de cadastro de leitura e confirmação manual pelo operador.

Também foi feita uma correção na resposta da IA para que, caso a leitura fosse mal sucedida, o valor retornado seja um inteiro de valor 0.
Desta forma, ao receber o valor de 0, o usuário da aplicação obrigatoriamente deverá confirmar o valor manualmente, utilizando o endpoint PATCH

Sendo assim, em caso de erro interno ou externo, o resultado é -1 ou 0.

Caso a IA consiga ler o número do hidrômetro ou gasômetro, retornará este número.

A própria IA do Google, ao ser questionada, informou que o gemini vision pode não suportar a leitura de imagens, apesar da documentação oficial contradizer esta informação

**Resposta da IA**

*Modelo Gemini:
Versão: A versão "gemini-1.5-pro" pode não ser a mais adequada para tarefas de OCR (reconhecimento óptico de caracteres). Verifique a documentação oficial para encontrar a versão mais indicada para essa tarefa.
Capacidades: Lembre-se que modelos de linguagem, como o Gemini, são treinados principalmente para gerar texto. Embora possam processar imagens, sua performance em tarefas de OCR pode ser limitada em comparação com modelos especializados.*


Foram testados outros modelos:
  - gemini-1.5-pro-latest
  - gemini-1.5-flash
  - gemini-1.5-flash-latest

Nenhum modelo correspondeu inteiramente ao esperado, apenas o modelo *gemini-1.5-flash-latest* ofereceu uma resposta -1 em alguns testes.




