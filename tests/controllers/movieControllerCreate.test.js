const sinon = require("sinon");
const { expect } = require("chai");
const MoviesService = require("../../services/movieService");
const MoviesController = require("../../controllers/movieController");

describe("Ao chamar o controller de create", () => {
  describe("quando o payload informado não é válido", () => {
    const response = {};
    const request = {};

    before(() => {
      request.body = {};

      response.status = sinon.stub().returns(response);
      response.json = sinon.stub().returns();

      sinon.stub(MoviesService, "create").resolves(false);
    });

    after(() => {
      MoviesService.create.restore();
    });

    it("é chamado o status com o código 400", async () => {
      await MoviesController.create(request, response);

      expect(response.status.calledWith(400)).to.be.equal(true);
    });

    it('é chamado o json com a mensagem "Dados inválidos"', async () => {
      await MoviesController.create(request, response);

      expect(
        response.json.calledWith({ message: "Dados inválidos" })
      ).to.be.equal(true);
    });
  });

  describe("quando é inserido com sucesso", () => {
    const response = {};
    const request = {};

    before(() => {
      request.body = {
        title: "Example Movie",
        directedBy: "Jane Dow",
        releaseYear: 1999,
      };

      response.status = sinon.stub().returns(response);
      response.json = sinon.stub().returns();

      sinon.stub(MoviesService, "create").resolves(true);
    });

    after(() => {
      MoviesService.create.restore();
    });

    it("é chamado o status com o código 201", async () => {
      await MoviesController.create(request, response);

      expect(response.status.calledWith(201)).to.be.equal(true);
    });

    it('é chamado o json com a mensagem "Filme criado com sucesso!"', async () => {
      await MoviesController.create(request, response);

      expect(
        response.json.calledWith({ message: "Filme criado com sucesso!" })
      ).to.be.equal(true);
    });
  });
});

/* Percebam que os testes do controller tem uma particularidade em sua implementação. Isso acontece porque diferente das outras camadas, o controller não possui funções simples que retornam um resultado qualquer, mas sim middlewares que funcionam a partir dos objetos req , res , next e error .
Dessa forma, para conseguirmos testar, precisaremos passar um input a partir do req e validar o output a partir do res , validando se os devidos métodos foram chamados e com os parâmetros esperados.
Para nos ajudar com essa tarefa iremos utilizar recursos do sinon , observe como ira ficar no teste do movieController.
Criamos stubs específicos para simular funções de resposta ( response ), dessa forma conseguimos utilizar o método calledWith fornecido pelo Sinon para testarmos se a função foi chamada com os parâmetros esperados. */
