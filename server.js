
const app = require('express')();
const server = require('https').createServer(lex.httpsOptions, lex.middleware(app));
const got = require('got');
function approveDomains(opts, certs, cb) {
  // This is where you check your database and associated
  // email addresses with domains and agreements and such


  // The domains being approved for the first time are listed in opts.domains
  // Certs being renewed are listed in certs.altnames
  if (certs) {
    opts.domains = certs.altnames;
  }
  else {
    opts.email = 'asqwrd@gmail.com';
    opts.agreeTos = true;
  }

  cb(null, { options: opts, certs: certs });
}


var lex = require('letsencrypt-express').create({
  server: 'staging',
  challenges: { 'http-01': require('le-challenge-fs').create({ webrootPath: '/tmp/acme-challenges' }) },
  store: require('le-store-certbot').create({ webrootPath: '/tmp/acme-challenges' }),
  approveDomains: approveDomains

})

require('http').createServer(lex.middleware(require('redirect-https')())).listen(80, function () {
  console.log("Listening for ACME http-01 challenges on", this.address());
});

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

/*server.listen(3001, function (){
  var host = server.address().address;
  var port = server.address().port;
  console.log('app listening at //%s:%s', host, port);
});*/



//lex.onRequest = app;

server.listen(3001, function () {
  console.log("Listening for ACME tls-sni-01 challenges and serve app on", this.address());
});
