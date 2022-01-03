const express = require('express'); // common JS piece

const app = express(); // need an instance of express too
const chalk = require('chalk');
const path = require('path');

// const chalk = require('chalk');

const PORT = process.env.PORT || 3000;

const kanaRouter = require('./src/routers/kanaRouter');
const indexRouter = require('./src/routers/indexRouter');

// const debug = require('debug')('app'); to debug

// const morgan = require('morgan');
// app.use(morgan('tiny'));

app.use(express.static(path.join(__dirname, '/public/'))); //tell it it's coming from the file public, from where we're running
                                                           // using dirname

// we search for the index.html page first, if it doesn't exist, then it passes to app.get('/',(req,res))

app.set('views', './src/views'); // this is to set a variable called views, and where our views are
app.set('view engine', 'ejs');

app.use('/kana', kanaRouter);
app.use('/', indexRouter);

// whenever a get request is sent to /, express will send back the message 'Hello from my app'


//get express to listen on a port, we skip the host name, but we do a call-back (the bit  with ()=>{})
app.listen(PORT, ()=>{
    console.log(`listening to ${chalk.blue(PORT)}`);
    // debug('listening on port 3000'); this only runs when you're running in debug mode
    // on windows need to run set DEBUG=* & node app.js or set it to run just app
})