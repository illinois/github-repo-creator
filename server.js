const express = require('express');
const path = require('path');
const logger = require('morgan');
const compression = require('compression');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const exphbs = require('express-handlebars');
const rewrite = require('express-urlrewrite')

// Load environment variables from .env file
dotenv.load();

const app = express();

const hbs = exphbs.create({ defaultLayout: 'main' });

// It's possible that this app isn't being served from the root route
// If that's the case, rewrite URLs to simplify internal route handling
if (process.env.BASE_URL) {
  app.use(rewrite(`${process.env.BASE_URL}/*`, '/$1'));
}

app.set('trust proxy', '127.0.0.1');
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', require('./controllers/home'));

app.use((err, req, res, next) => {
  console.error(err);
  res.render('error', err);
});

app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
