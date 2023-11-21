const express = require('express')
const userRoutes = require('./routers/user-router')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json())
app.use('/api/users',userRoutes)


app.use((error, req, res, next) => {
    if(res.headerSent){
        return next(error)
    }
    res.status(error.code || 500)
    res.json({message: error.message || 'An unknown error occurred'})
})

app.listen(8000)