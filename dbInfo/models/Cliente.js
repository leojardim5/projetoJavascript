const mongoose = require('mongoose')

const Schema = mongoose.Schema;


const ClienteSchema = Schema({
    nome: String,
    email: String,
    cpf: String,
    empresas: [{
        cnpj: String,
        saldo: {
            type: Number,
            default: 0
        }
    }]
});

const ClienteModel = mongoose.model('cliente',ClienteSchema)

module.exports = ClienteModel


