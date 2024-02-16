const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const nodemon = require('nodemon')
const { json } = require('body-parser')
const routes = require('./routes')
const db = require('./dbInfo/db')
const app = express()



db();


app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(routes)

app.get('/',(req,res)=>{
    res.json({"Home":"Pagina inicial"})
})

app.listen(3001,()=>{
    console.log("Servidor Rodando na porta 3001")
})