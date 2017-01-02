const app = require('express')();
const got = require('got');

const redirect = (url, res) => got(url, {json: true})
    .then(response => res.json(response.body))
    .catch(error => {
        if (error && error.statusCode) {
            res.status(error.statusCode).json({message: error.message});
        } else {
            res.status(500).json({message: 'Error'});
        }
    });


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (req, res) => res.send('Welcome'));

app.get('/api/search/shows', (req, res) => {
    redirect('http://api.tvmaze.com/search/shows?q=' + req.query.q, res);
});

app.get('/api/shows/:id', (req, res) => {
    redirect('http://api.tvmaze.com/shows/'+ req.params.id + '?embed[]=nextepisode&embed[]=episodes&embed[]=seasons', res);
});

app.get('/api/favorites/:id', (req, res) => {
    redirect('http://api.tvmaze.com/shows/'+ req.params.id, res);
});

app.get('/api/schedule', (req, res) => {
    redirect('http://api.tvmaze.com/schedule?country=US', res);
});

var server = app.listen(3001, function (){
  var host = server.address().address;
  var port = server.address().port;
  console.log('app listening at //%s:%s', host, port);
});
