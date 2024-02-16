const Empresa = require("./dbInfo/models/Empresa")
const regexCNPJ = /^(\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2})$/;
const Client = require("./dbInfo/models/Cliente")

module.exports = {
    empresas: async (req, res) => {
        try {
            const empresas = await Empresa.find({});
            res.status(200).send(empresas);
        } catch (error) {
            console.error("Erro ao buscar empresas:", error);
            res.status(500).send("Erro interno do servidor");
        }
    },

    getEmpresa: async (req, res) => {
        try {
            const { id } = req.params;
            const empresa = await Empresa.findById(id);

            if (empresa) {
                res.status(200).send(empresa);
            } else {
                res.status(404).send({ erro: "Empresa não encontrada" });
            }
        } catch (error) {
            console.error("Erro ao buscar empresa:", error);
            res.status(500).send("Erro interno do servidor");
        }
    },
    signup: async (req, res) => {
        const { cnpj } = req.body
        empresaExiste = await Empresa.findOne({ cnpj })

        if (!empresaExiste) {
            try {
                if (!regexCNPJ.test(cnpj)) {
                    return res.status(400).json({ message: "Erro ao criar uma empresa, cnpj inválido" });
                }

                await Empresa.create(req.body)
                res.status(200).json({ message: "Dados recebidos com sucesso,empresa criada" })
            } catch (error) {
                res.status(400).json({ message: "Erro ao criar a empresa" })
            }

        } else {
            res.status(400).send({ message: "Empresa ja criada" })
        }

    },
    signin: async (req, res) => {
        try {
            const { email, password } = req.body;

            const usuarioAchado = await Empresa.findOne({ email });

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

    updateEmpresa: async (req, res) => {
        try {
            const { id } = req.params;
            const values = req.body;
            const EmpresaModificado = await Empresa.findOneAndUpdate({ _id: id }, values, { new: true });

            if (EmpresaModificado) {
                res.status(200).json(EmpresaModificado);
            } else {
                res.status(404).json({ message: "Empresa não encontrado" });
            }
        } catch (error) {
            res.status(500).json({ message: "Erro no servidor" });
        }
    },

    deleteEmpresa: async (req, res) => {
        try {
            const { id } = req.params;
            const deleted = await Empresa.findOneAndDelete({ _id: id });

            if (deleted) {
                res.status(200).json(deleted);
            } else {
                res.status(404).json({ message: "Empresa não encontrado" });
            }
        } catch (error) {
            res.status(500).json({ message: "Erro no servidor" });
        }
    },

    depositoSaqueAtualiza: async (req, res) => {
        const { empresaId,cnpj} = req.body;
        try {
            const clientes = await Client.find({ empresas: { $elemMatch: { empresa: empresaId } } });;

          
            
            let novoSaldoDaEmpresa = 0;
            for (let i = 0; i < clientes.length; i++) {
                for (let x = 0; x < clientes[i].empresas.length; x++) {
                    if (clientes[i].empresas[x].cnpj === cnpj) {
                        
                        novoSaldoDaEmpresa += Number(clientes[i].empresas[x].saldo) 
                        
                    }
                    
                }
            }
            console.log(novoSaldoDaEmpresa)
            

            await Empresa.findOneAndUpdate({ _id: empresaId }, { saldo: saldoFinal  });
            return { status: 200, message: "Atualização com sucesso" };
        } catch (error) {
            return { status: 500, message: "Erro interno", error };
        }
    }

}