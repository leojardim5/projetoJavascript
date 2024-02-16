const mongoose = require('mongoose')

const Schema = mongoose.Schema;


const EmpresaSchema = Schema({
    nome: String,
    emailEmpresa: String,
    password: String,
    cnpj: String,
    clientes: [{
        cliente: {
            type: Schema.Types.ObjectId,
            ref: 'Cliente'
        },
    }],
    saldo: {
        type: Number,
        default: 0
    }
});

const EmpresaModel = mongoose.model('empresa', EmpresaSchema)

module.exports = EmpresaModel


