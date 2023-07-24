if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const methodOverride = require('method-override')

const app = express()
const port = process.env.PORT || 3000

// middleware
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride('_method'))

app.use(express.urlencoded({ extended: true }))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
