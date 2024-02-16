const express = require('express');
const routes = express.Router();
const controllerCliente = require('./controllerCliente');
const controlleEmpresa = require('./controllerEmpresa');

routes.get("/users", (req, res) => controllerCliente.clients(req, res))
routes.get("/user/:id", (req, res) => controllerCliente.getUser(req, res))
routes.post("/signinUser", (req, res) => controllerCliente.signin(req, res))
routes.post("/signupUser", (req, res) => controllerCliente.signup(req, res))
routes.put("/updateUser/:id", (req, res) => controllerCliente.updateUser(req, res))
routes.delete("/deleteUser/:id", (req, res) => controllerCliente.deleteUser(req, res))
routes.post("/transferencia", (req, res) => controllerCliente.tranferencia(req, res))
routes.get("/saldo/:id", (req, res) => controllerCliente.getSaldo(req, res))
routes.post("/signup", (req,res)=>controlleEmpresa.signup(req,res))
routes.get("/empresas", (req, res) => controlleEmpresa.empresas(req, res))
routes.post('/deposito', (req, res) => controllerCliente.deposito(req, res))
routes.post('/saque', (req, res) => controllerCliente.saque(req, res))



module.exports = routes