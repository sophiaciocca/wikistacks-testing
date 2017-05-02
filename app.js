const express = require('express');
const app = express();

const morgan = require('morgan');
const bodyParser = require('body-parser');

const nunjucks = require('nunjucks');

const path = require('path');
module.exports = app;

app.set('view engine', 'html');
app.engine('html', nunjucks.render);
const env = nunjucks.configure('views', { noCache: true });
require('./filters')(env);

const AutoEscapeExtension = require("nunjucks-autoescape")(nunjucks);
env.addExtension('AutoEscapeExtension', new AutoEscapeExtension(env));

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, './public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/wiki', require('./routes/wiki'));
app.use('/users', require('./routes/users'));

app.get('/', (req, res) => res.render('index'));

app.use((error, req, res, next) => {
	//if there is no error.status already set, we are defaulting to 500
    error.status = error.status || 500;
    error.message = error.message || 'Internal Error';
    res.render('error', {error})
});
