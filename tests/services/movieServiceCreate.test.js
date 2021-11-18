const { expect } = require("chai");
// importando o movieService:
const MoviesService = require("../../services/movieService");
// importando o sinon pra fazer o stub:
const sinon = require("sinon");

const MoviesModel = require("../../models/movieModel");

/*
  Precisamos validar se estamos recebendo todos os campos
  necessários para a operação. Como trata-se de uma regra
  de negócio, validaremos na camada de serviços.
*/
describe("Insere um novo filme no BD", () => {
  describe("quando o payload informado não é válido", () => {
    const payloadMovie = {};

    it("retorna um boolean", async () => {
      const response = await MoviesService.create(payloadMovie);

      expect(response).to.be.a("boolean");
    });

    it('o boolean contém "false"', async () => {
      const response = await MoviesService.create(payloadMovie);

      expect(response).to.be.equal(false);
    });
  });

  describe("quando é inserido com sucesso", () => {
    const payloadMovie = {
      title: "Example Movie",
      directedBy: "Jane Dow",
      releaseYear: 1999,
    };

    before(() => {
      const ID_EXAMPLE = "604cb554311d68f491ba5781";

      sinon.stub(MoviesModel, "create").resolves({ id: ID_EXAMPLE });
    });

    // Restauraremos a função `create` original após os testes.
    after(() => {
      MoviesModel.create.restore();
    });

    it("retorna um objeto", async () => {
      const response = await MoviesService.create(payloadMovie);

      expect(response).to.be.a("object");
    });

    it('tal objeto possui o "id" do novo filme inserido', async () => {
      const response = await MoviesService.create(payloadMovie);

      expect(response).to.have.a.property("id");
    });
  });
});
