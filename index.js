const express = require("express");
const app = express();
const bodyparser = require("body-parser")
const dotenv = require("dotenv");
const key = require('./routes/key')
dotenv.config()

app.use(express.json());

//BODYPARSER
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())

app.use("/keys", key)

const port = process.env.PORT || 5000

app.listen(port, () => {

    console.log('Servidor ativo...')    

})