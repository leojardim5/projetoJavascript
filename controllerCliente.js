const Client = require('./dbInfo/models/Cliente')
const regexCPF = /^(\d{3}\.\d{3}\.\d{3}-\d{2}|\d{11})$/
const regexCNPJ = /^(\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2})$/
const controllerEmpresa = require('./controllerEmpresa')
const Empresa = require("./dbInfo/models/Empresa")


module.exports = {


    clients: async (req, res) => {
        try {
            const usuarios = await Client.find({});
            res.status(200).send(usuarios);
        } catch (error) {
            console.error("Erro ao buscar usuários:", error);
            res.status(500).send("Erro interno do servidor");
        }
    },

    getClient: async (req, res) => {
        try {
            const { id } = req.params;
            const usuario = await Client.findById(id);

            if (usuario) {
                res.status(200).send(usuario);
            } else {
                res.status(404).send({ erro: "Usuário não encontrado" });
            }
        } catch (error) {
            console.error("Erro ao buscar usuário:", error);
            res.status(500).send("Erro interno do servidor");
        }
    },
    signup: async (req, res) => {
        const { email, cpf, empresas } = req.body;
        try {
            const usuarioExiste = await Client.findOne({ email });
            if (usuarioExiste) {
                return res.status(400).json({ message: "Usuário já existe" });
            }

            if (!regexCPF.test(cpf)) {

                return res.status(400).json({ message: "Erro ao criar o usuário, CPF inválido" });
            }

            empresas.map(async (empresa) => {
                if (!empresa.cnpj || !regexCNPJ.test(empresa.cnpj)) {
                    return res.status(400).json({ message: "Erro ao achar a empresa, CNPJ inválido" });

                }
                const empresaAtual = await Empresa.findOne({ cnpj: empresa.cnpj })
                if (!empresaAtual) {
                    return res.status(400).json({ message: "Empresa não encontrada" });
                }
            })


            await Client.create(req.body);
            res.status(200).json({ message: "Dados recebidos com sucesso, usuário criado" });
        } catch (error) {
            res.status(400).json({ message: "Erro ao criar o usuário", error: error.message });
        }
    },
    signin: async (req, res) => {
        try {
            const { email, password } = req.body;

            const usuarioAchado = await Client.findOne({ email });

            if (usuarioAchado) {
                res.status(200).send("Conta verificada");
            } else {
                res.status(404).send("Erro: email não encontrado");
            }
        } catch (error) {
            console.error("Erro ao verificar conta:", error);
            res.status(500).send("Erro interno do servidor");
        }
    },

    updateClient: async (req, res) => {
        try {
            const { id } = req.params;
            const values = req.body;
            const ClientModificado = await Client.findOneAndUpdate({ _id: id }, values, { new: true });

            if (ClientModificado) {
                res.status(200).json(ClientModificado);
            } else {
                res.status(404).json({ message: "Usuário não encontrado" });
            }
        } catch (error) {
            res.status(500).json({ message: "Erro no servidor" });
        }
    },

    deleteClient: async (req, res) => {
        try {
            const { id } = req.params;
            const deleted = await Client.findOneAndDelete({ _id: id });

            if (deleted) {
                res.status(200).json(deleted);
            } else {
                res.status(404).json({ message: "Usuário não encontrado" });
            }
        } catch (error) {
            res.status(500).json({ message: "Erro no servidor" });
        }
    },

    deposito: async (req, res) => {
        const { cnpj, value, cpf } = req.body;
        const taxaDaEmpresa = 0.9
        console.log(cnpj, value, cpf)

        try {
            if (!cnpj || !regexCNPJ.test(cnpj)) {
                return res.status(400).json({ message: "CNPJ da empresa não fornecido nem valido" });
            }

            const empresa = await Empresa.findOne({ cnpj });
            if (!empresa) {
                return res.status(404).json({ message: "Empresa não encontrada" });
            }
            const cliente = await Client.findOne({ cpf })
            if (!cliente) {
                return res.status(404).json({ message: "cliente não encontrado" });
            }
            const { _id } = empresa

            const empresaExiste = cliente.empresas.find(empresa => empresa.cnpj === cnpj);

            valorComTaxa = parseFloat(value)


            if (empresaExiste) {
                empresaExiste.saldo += valorComTaxa
            } else {
                cliente.empresas.push({ cnpj, saldo: valorComTaxa });

            }

            await cliente.save();

            

            const resposta = await controllerEmpresa.depositoSaqueAtualiza({ body: { empresaId: _id, cnpj }, res })
            // console.log(resposta)
            if (resposta.status !== 200) {
                return res.status(resposta.status).json({ message: "Erro ao processar o depósito", error: error.message })
            }
           

            return res.status(200).json({ message: "Depósito realizado com sucesso" });
        } catch (error) {
            return res.status(500).json({ message: "Erro ao processar o depósito", error: error.message })
        }
    },

    saque: async (req, res) => {
        const { cnpj, value, cpf } = req.body;
        const taxaDaEmpresa = 0.9
        console.log(cnpj, value, cpf)

        try {
            if (!cnpj || !regexCNPJ.test(cnpj)) {
                return res.status(400).json({ message: "CNPJ da empresa não fornecido ou não válido" });
            }

            const empresa = await Empresa.findOne({ cnpj });
            if (!empresa) {
                return res.status(404).json({ message: "Empresa não encontrada" });
            }
            const cliente = await Client.findOne({ cpf })
            if (!cliente) {
                return res.status(404).json({ message: "cliente não encontrado" });
            }
            const { _id } = empresa

            const empresaExiste = cliente.empresas.find(empresa => empresa.cnpj === cnpj);

            valorComTaxa = parseFloat(value)


            if (!empresaExiste || empresaExiste.saldo < value) {
                return res.status(400).json({ message: "Não há fundos suficientes" });
            }

            empresaExiste.saldo -= value;


            await cliente.save();


            const resposta = await controllerEmpresa.depositoSaqueAtualiza({ body: { empresaId: _id, cnpj }, res })
            
            if (resposta.status !== 200) {

                return res.status(resposta.status).json({ message: "Erro ao processar o saque", error: error.message })
            }



            return res.status(200).json({ message: "saque realizado com sucesso" });
        } catch (error) {
            return res.status(500).json({ message: "Erro ao processar o saque", error: error.message })
        }
    },
}


//resolver problema de mapping, e resto das coisas, muita fé!


