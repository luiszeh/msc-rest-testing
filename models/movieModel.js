// importando a connection (que é meio que padrão a criação dela, e importamos na camada de modelo)
const mongoConnection = require("./connection");

// implementando o CREATE do movieModel com os atributos title, directedBy, releaseYear;
// moviesCollection busca da conexao com o mongo, que busca no DB a coleção movies;
// após, geramos um insertedId pra gerar um id inserindo title, directedBy, releaseYear e retornamos o id que vai conter tudo isso;
const create = async ({ title, directedBy, releaseYear }) => {
  const moviesCollection = await mongoConnection
    .getConnection()
    .then((db) => db.collection("movies"));

  const { insertedId: id } = await moviesCollection.insertOne({
    title,
    directedBy,
    releaseYear,
  });

  return {
    id,
  };
};

// exportando a função create, que é assincrona e espera a requisição da conexao ao mongo;
module.exports = {
  create,
};
