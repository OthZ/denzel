const imdb = require('./imdb');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const { PORT } = require('./constants');

const app = express();

function getRand(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({ 'ack': true });
});

app.get('/movies/populate/:id', (request, response) => {
  var id = request.params.id;
  imdb(id).then((result) => {
    response.send({ total: result.length });
  });

});

app.get('/movies/', (request, response) => {
  imdb('nm0430107').then((result) => {
    const awesome = result.filter(movie => movie.metascore >= 77);
    const longueur = awesome.length;
    const nb = getRand(longueur);
    response.send({ awesome_movie: awesome[nb] });
  });

});

app.get('/movies/:id', (request, response) => {
  var id = request.params.id;
  var limit = parseInt(request.query.limit);
  var metascore = parseInt(request.query.metascore);
  if (limit >= 0 && metascore >= 0) {
    imdb('nm0430107').then((result) => {
      const awesome = result.filter(movie => movie.metascore >= metascore);
      const longueur = awesome.length;
      const nb = getRand(longueur);
      var i = 1;
      var list = new Array(limit);
      list[0] = awesome[nb];

      while (i < limit) {
        const nb2 = getRand(longueur);
        var check = false;
        for (var index = 0; index < i; index++) {
          if (list[index].id == awesome[index].id) {
            check = true;
          }
        }
        if (!check) {
          list[i] = awesome[nb2];
          i++;
        }
      }
      response.send({ seach_movie: list });
    });
  }
  else {
    imdb('nm0430107').then((result) => {
      const longueur = result.length;
      var resultat = null;
      for (var index = 0; index < longueur; index++) {
        if (result[index].id == id) {
          resultat = result[index];
          response.send({ movie: result[index] })
        }
      }
      if (resultat == null) {
        response.send({ movie: "Rien trouvé" });
      }
    });
  }
});




app.listen(PORT);
console.log(`📡 Running on port ${PORT}`);
