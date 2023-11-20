const express = require("express");
const router = express.Router();
const bodyparser = require("body-parser")
const dotenv = require("dotenv");
const client = require("../db/connection");
const cors = require('cors');
dotenv.config()

client.connect();

router.use((req, res, next) => {
	//Qual site tem permissão de realizar a conexão, no exemplo abaixo está o "*" indicando que qualquer site pode fazer a conexão
    res.header("Access-Control-Allow-Origin", "*");
	//Quais são os métodos que a conexão pode realizar na API
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    router.use(cors());
    next();
});


router.get("/get", async (req, res) => {
    const data = await client.query('SELECT * FROM keys WHERE status = true')
    res.status(200).send(data.rows);    
})

router.post("/register", async (req,res) => {

    try {
        values = Object.values(req.body)

        if(values[0] == '' || values[1] == ''){
            res.json({message: "Você deve preencher todos os campos para registrar uma chave"})
        }else{
            try {
                const resultado = await client.query('INSERT INTO keys (keyid, description, key_situation) VALUES ($1, $2, $3)', values)
                res.status(201).json({message: 'Chave inserida com sucesso!'});
            } catch (error) {
                console.log(error)
                res.status(400).json({message: 'Chave não foi inserida com sucesso!'});
            }
        }
    } catch (error) {
        res.status(400).json({message: 'Chave não foi inserida com sucesso!'});
    }
    

})

router.get("/search/:description", async (req,res) => {

    var values = [];

    values[0] = req.params.description

    if(values[0] == 'vazio'){

        const data = await client.query('SELECT * FROM keys WHERE status = true')
        res.status(200).send(data.rows);  

    }else{

        const data = await client.query('SELECT * FROM keys where description = $1 AND status = true', values)
        res.status(200).send(data.rows); 

    }

})

router.post("/update", async (req,res) => {

    try {
        var obj = Object.values(req.body);
        var values = [];
        values[0] = obj[0];
        values[1] = obj[1];
        values[2] = obj[2];

        if(values[0] == '' || values[1] == ''){
            res.json({message: "Você deve preencher todos os campos para atualizar uma chave"})
        }else{
            try {
                await client.query('UPDATE keys SET keyid = $1, description = $2 WHERE keyid = $3', values)
                res.status(201).json({message: 'Chave atualizada com sucesso!'});
            } catch (error) {
                console.log(error)
                res.status(400).json({message: 'Chave não foi atualizada com sucesso!'});
            }
        }
    } catch (error) {
        res.status(400).json({message: 'Chave não foi atualizada com sucesso!'});
    }
    

})

router.get("/table", async (req, res) => {

    try {
        await client.query("ALTER TABLE keys ADD status BOOLEAN;");
        await client.query("UPDATE keys SET status = true;");
    } catch (error) {
        console.log(error)
    }

})

router.post("/remove", async (req,res) => {

    try {
        var values = Object.values(req.body);

        if(values[0] == ''){
            res.json({message: "Você deve selecionar uma chave para remover"})
        }else{
            try {
                await client.query('UPDATE keys SET status = false WHERE keyid = $1', values)
                res.status(201).json({message: 'Chave removida com sucesso!'});
            } catch (error) {
                console.log(error)
                res.status(400).json({message: 'Chave não foi atualizada com sucesso!'});
            }
        }
    } catch (error) {
        res.status(400).json({message: 'Chave não foi atualizada com sucesso!'});
    }
    

})

router.get("/table", async (req, res) => {

    try {
        await client.query("ALTER TABLE keys ADD status BOOLEAN;");
        await client.query("UPDATE keys SET status = true;");
    } catch (error) {
        console.log(error)
    }

})



module.exports = router