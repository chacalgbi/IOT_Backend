<h1 align="center">BackEnd da Aplicação do Aplicativo de documentação dos Técnicos</h1>

<h4 align="center">	🚧  - Siga os passos abaixo para a instalação e uso da API.  🚧 </h4>

### Instalação:

- [x] Fazer o download do projeto.
- [x] Executar o comando na raiz do projeto: "npm install".
- [x] Criar no servidor de banco de dados o seguinte database: "pops_micks".
- [x] Na raiz desse projeto tem um arquivo JSON exportado do Insomina "Insomnia_2022-07-05.json" com todas as rotas para teste e produção de um frontEnd caso seja necessário para aprovar as solicitações, apagar, editar, etc. E também para cadastrar, editar, listar e excluir a lista dos PDFs.
- [x] Criar na raiz do projeto um arquivo ".env" e cadastrar as seguintes informações:
<ul>
    <li>DB_NAME = pops_micks</li>
    <li>DB_USER = ******</li>
    <li>DB_PASS = ******</li>
    <li>DB_HOST = *********</li>
    <li>DB_PORT = 3306</li>
    <li>API_PORT = 8080</li>
</ul>
<p>OBS: Mudar a porta da API e do servidor mysql conforme a necessidade.</p>


<h4>Para iniciar use node popsApi.js ou usar o PM2 para gerenciar</h4>
