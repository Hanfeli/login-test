// const express = require('express')
// const userRoutes = require('./routers/user-router')
// const cookieParser = require('cookie-parser');
// const bodyParser = require('body-parser')
// const app = express()

// app.use(bodyParser.json())
// app.use(cookieParser());
// app.use('/api/users',userRoutes)


// app.use((error, req, res, next) => {
//     if(res.headerSent){
//         return next(error)
//     }
//     res.status(error.code || 500)
//     res.json({message: error.message || 'An unknown error occurred'})
// })

// app.listen(8000)

const express = require('express');
const userRoutes = require('./routers/user-router');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const sequelize = require('./db.js'); // 引入 Sequelize 实例
const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use((req, res, next) => {
    req.sequelize = sequelize; // 將 Sequelize 實例附加到 request 對象上
    next();
});
app.use('/api/users', userRoutes);

app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occurred' });
});

sequelize.sync({ force: false }) 
    .then(() => {
        app.listen(8000, () => {
            console.log('Server is running on port 8000');
        });
    })
    .catch(err => console.log(err));
