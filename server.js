const express = require('express')
const colors = require('colors')
const connectDB = require('./config/db')
const dotenv = require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors')

connectDB()

const goalRoutes = require('./routes/goalRoutes')
const userRoutes = require('./routes/userRoutes')
const { errorHandler } = require('./middleware/errorMiddleware')

app.use(express.json())
app.use(cors())

app.use(express.urlencoded({ extended: false }))

app.use('/api/goals', goalRoutes)
app.use('/api/users', userRoutes)

app.use(errorHandler)

app.listen(port, ()=>{
    console.log(`App is listening to Port ${port}`)
})