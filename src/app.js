const { uuid } = require("uuidv4");

const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());
const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.json(repository);
});

const Middleware = (request, response, next) => {
  const { id } = request.params;

  const findRepositoryIndex = repositories.findIndex(repository =>
    repository.id === id
  );

  if (findRepositoryIndex === -1) {
    return response.status(400).json({ error: 'Repository doesnt not exists' })
  }

  request.params.findRepositoryIndex = findRepositoryIndex;

  next();
};

app.put("/repositories/:id", Middleware, (request, response) => {
  const { findRepositoryIndex, id } = request.params;
  const { title, url, techs } = request.body;
  console.log(id);
  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[findRepositoryIndex].likes,
  };

  repositories[findRepositoryIndex] = repository;

  return response.json(repository)
});

app.delete("/repositories/:id", Middleware, (request, response) => {
  const { findRepositoryIndex } = request.params;

  repositories.splice(findRepositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", Middleware, (request, response) => {
  const { findRepositoryIndex } = request.params;

  repositories[findRepositoryIndex].likes += 1;

  return response.json(repositories[findRepositoryIndex]);
});

module.exports = app;
