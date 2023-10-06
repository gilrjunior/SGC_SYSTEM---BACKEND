const express = require("express");
const app = express();
const bodyparser = require("body-parser")
const cors = require('cors');
const dotenv = require("dotenv");
const client = require("./db/connection");
dotenv.config()

client.connect();

app.use(express.json());

app.use((req, res, next) => {
	//Qual site tem permissão de realizar a conexão, no exemplo abaixo está o "*" indicando que qualquer site pode fazer a conexão
    res.header("Access-Control-Allow-Origin", "*");
	//Quais são os métodos que a conexão pode realizar na API
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    app.use(cors());
    next();
});

//BODYPARSER
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())

app.get("/keys", async (req, res) => {
    const data = await client.query('SELECT * FROM keys')
    res.status(200).send(data.rows);    
})

app.post("/keyregister", async (req,res) => {

    try {
        values = Object.values(req.body)

        if(values[0] == '' || values[1] == ''){
            res.status(202).json({message: "Você deve preencher todos os campos para registrar uma chave"})
        }else{
            try {
                const resultado = await client.query('INSERT INTO keys (keyid, description, key_situation) VALUES ($1, $2, $3)', values)
                res.status(201).json({message: 'Produto inserido com sucesso!'});
            } catch (error) {
                console.log(error)
                res.status(400).json({message: 'Produto não foi inserido com sucesso!'});
            }
        }
    } catch (error) {
        res.status(400).json({message: 'Produto não foi inserido com sucesso!'});
    }
    

})

const port = process.env.PORT || 5000

app.listen(port, () => {

    console.log('Servidor ativo...')    

})