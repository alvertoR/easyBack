import express from 'express';
import morgan  from 'morgan';
import cors    from 'cors';
import path    from 'path';
import mongose from 'mongoose';

//Import de las rutas
const routesPqr = require('./rutas/soporte');
const users     = require('./rutas/user');

const app = express();

const uri     = 'mongodb://localhost:27017/easywork';
const opction = {
    useNewUrlParser:    true,
    useCreateIndex:     true,
    useUnifiedTopology: true
}

mongose.connect(uri,opction).then(() => {
    console.log('We are in DB'),
    err => {
        console.log(err);
    }
})


//Middleware
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Rutas
app.use('/easyWork/soporte', routesPqr);
app.use('/easyWork/user', users)

//Middleware para el modo history de Vue.js
const history =  require('connect-history-api-fallback');
app.use(history());
app.use(express.static(path.join(__dirname,'public')));

app.set('puerto', process.env.PORT || 3000);

app.listen(app.get('puerto'), () => {
    console.log('We are in dude'+app.get('puerto'));
});