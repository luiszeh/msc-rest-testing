const { expect } = require("chai");
// importando a camada de modelo de movie:
const MoviesModel = require("../../models/movieModel");
// importando o sinon pra fazer o stub da conexao, fazendo retornar um mock da conexao, ou seja, retornar um objeto com as mesmas caracteristicas da conexao real, porem serao funçoes falsas criadas por nós
const sinon = require("sinon");
// Vamos importar o módulo responsável para abrir a conexão nos nossos models para poder fazer o seu `double`;
const mongoConnection = require("../../models/connection");
// importando o mongoClient do mongodb:
const { MongoClient } = require("mongodb");
// importando o memoryServer pra usar esse servidor fake:
const { MongoMemoryServer } = require("mongodb-memory-server");

describe("insere um novo filme no DB", () => {
  // Vamos deixar o objeto com o mock da conexão como uma variável global dentro desse describe:
  let connectionMock;

  const payloadMovie = {
    title: "Example Movie",
    directedBy: "Jane Dow",
    releaseYear: 1999,
  };

  // Aqui atualizamos o código para usar o banco "fake" montado pela lib `mongo-memory-server`:
  before(async () => {
    const DBServer = new MongoMemoryServer();
    const URLMock = await DBServer.getUri();
    // é como se fosse uma connection da camada de modelo, porem ta vindo do memoryServer:
    connectionMock = await MongoClient.connect(URLMock, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then((conn) => conn.db("model_example"));
    // stub recebe como parâmetros: o DB e o método ou funçao a ser executado e entrega a conexao ao DB "fake":
    sinon.stub(mongoConnection, "getConnection").resolves(connectionMock);
  });

  /* Restauraremos a função `getConnection` original após os testes. */
  after(() => {
    mongoConnection.getConnection.restore();
  });

  describe("quando é inserido com sucesso", () => {
    it("retorna um objeto", async () => {
      const response = await MoviesModel.create(payloadMovie);

      expect(response).to.be.a("object");
    });

    it('tal objeto possui o "id" do novo filme inserido', async () => {
      const response = await MoviesModel.create(payloadMovie);

      expect(response).to.have.a.property("id");
    });

    /* Aqui de fato estamos testando se o filme foi cadastrado após chamar a função `create`.
    Para isso fizemos uma consulta para o banco para checar se existe um filme com o título cadastrado. Aqui simulamos o "post" de um novo filme com o MoviesModel vindo da camada models esperando pela conexao "fake" da coleçao movies procurando por um titulo existente e que nao seja nulo */
    it("deve existir um filme com o título cadastrado!", async () => {
      await MoviesModel.create(payloadMovie);
      const movieCreated = await connectionMock
        .collection("movies")
        .findOne({ title: payloadMovie.title });
      expect(movieCreated).to.be.not.null;
    });
  });
});
