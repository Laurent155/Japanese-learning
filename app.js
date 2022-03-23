const express = require('express');
const path = require('path');
const passport = require('passport');
require("./src/config/passport.js")(passport);
const schedule = require('node-schedule');
const dotenv = require('dotenv');
dotenv.config();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express();

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const PORT = process.env.PORT || 3000;
const practiceRouter = require('./src/routers/practiceRouter');
const { calendarRouter, updateCalendar } = require('./src/routers/calendarRouter'); 
//it's because I've exported an object { ... }, so now only want one function in it, so want the {} around authRouter.
const accountRouter = require('./src/routers/accountRouter');
app.use(express.static(path.join(__dirname, '/public/')));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'cookie_secret', resave: true, saveUninitialized: true }));

require('./src/config/passport.js')(app);

app.set('views', './views');
app.set('view engine', 'ejs');

app.use('/practice', practiceRouter);
app.use('/calendar', calendarRouter);
app.use('/account', accountRouter);

app.get('/', (req, res) => {
    res.render('index');
});

server.listen(PORT, () => {
    console.log(`listening to ${PORT}`);
})

const users = {}

io.on('connection', socket => {
  console.log('user connected');
  socket.on('new-user', name => {
    users[socket.id] = name
    socket.broadcast.emit('user-connected', name)
  })
  socket.on('send-chat-message', message => {
    socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
  })
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id]
  })
})
schedule.scheduleJob('0 0 * * *', () => {updateCalendar()});
