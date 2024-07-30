require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para analisar JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexão com o MongoDB
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/registro-hinos';

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Conectado ao MongoDB'))
    .catch(err => console.error('Erro ao conectar ao MongoDB', err));

// Definir esquema e modelo do Hino
const HinoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    data: { type: Date, required: true },
    notas: [String],
    lixeira: { type: Boolean, default: false },
});

const Hino = mongoose.model('Hino', HinoSchema);

// Rota para servir os arquivos estáticos
app.use(express.static(path.join(__dirname, 'publico')));

// Rota para registrar um novo hino
app.post('/registrar', async (req, res) => {
    const { nome, data, notas } = req.body;
    const novoHino = new Hino({
        nome,
        data: new Date(data),
        notas,
    });

    try {
        await novoHino.save();
        res.sendStatus(200);
    } catch (err) {
        res.status(500).send('Erro ao salvar o hino');
    }
});

// Rota para buscar hinos
app.get('/hinos', async (req, res) => {
    const { nome } = req.query;
    try {
        const query = nome ? { nome: new RegExp(nome, 'i'), lixeira: false } : { lixeira: false };
        const hinos = await Hino.find(query).sort({ nome: 1 }); // Ordena por nome em ordem alfabética
        res.json(hinos);
    } catch (err) {
        res.status(500).send('Erro ao buscar hinos');
    }
});

// Rota para buscar hinos na lixeira
app.get('/hinos/lixeira', async (req, res) => {
    try {
        const hinos = await Hino.find({ lixeira: true }).sort({ nome: 1 }); // Ordena por nome em ordem alfabética
        res.json(hinos);
    } catch (err) {
        res.status(500).send('Erro ao buscar hinos na lixeira');
    }
});

// Rota para mover hino para a lixeira
app.put('/hinos/:id/lixeira', async (req, res) => {
    const { id } = req.params;
    try {
        await Hino.findByIdAndUpdate(id, { lixeira: true });
        res.sendStatus(200);
    } catch (err) {
        res.status(500).send('Erro ao mover o hino para a lixeira');
    }
});

// Rota para restaurar hino da lixeira
app.put('/hinos/:id/restaurar', async (req, res) => {
    const { id } = req.params;
    try {
        await Hino.findByIdAndUpdate(id, { lixeira: false });
        res.sendStatus(200);
    } catch (err) {
        res.status(500).send('Erro ao restaurar o hino');
    }
});

// Rota para excluir hino permanentemente
app.delete('/hinos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Hino.findByIdAndDelete(id);
        res.sendStatus(200);
    } catch (err) {
        res.status(500).send('Erro ao excluir o hino');
    }
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
