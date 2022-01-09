const express = require('express');
const path = require('path');
const passport = require('passport');
require("./src/config/passport.js")(passport);

const cookieParser = require('cookie-parser');
const session = require('express-session');

const PORT = process.env.PORT || 3000;
const app = express();
const practiceRouter = require('./src/routers/practiceRouter');
const calenderRouter = require('./src/routers/calenderRouter');
const accountRouter = require('./src/routers/accountRouter');
const authRouter = require('./src/routers/authRouter');

app.use(express.static(path.join(__dirname, '/public/')));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'cookie_secret', resave: true, saveUninitialized: true }));

require('./src/config/passport.js')(app);

app.set('views', './views');
app.set('view engine', 'ejs');

app.use('/practice', practiceRouter);
app.use('/calender', calenderRouter);
app.use('/account', accountRouter);
app.use('/auth', authRouter);

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(PORT, () => {
    console.log(`listening to ${PORT}`);
})