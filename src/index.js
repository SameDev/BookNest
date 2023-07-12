const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

import {initializeApp} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-SERVICE.js";

var config = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID
};

const firebaseApp = initializeApp(config);

// Configurando o body-parser para lidar com o corpo das requisições
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configurando o diretório das views e o mecanismo de template EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Rota para a página inicial
app.get('/', (req, res) => {
  res.render('index');
});

// Rota para o registro de usuários
app.post('/usuarios', (req, res) => {
  const { nome, email } = req.body;

  // Lógica para criar um novo usuário no banco de dados
  // ...

  res.status(201).json({ message: 'Usuário criado com sucesso!' });
});

// Rota para pesquisa de serviços
app.get('/servicos', (req, res) => {
  const { tipo } = req.query;

  // Lógica para buscar serviços no banco de dados com base no tipo
  // ...

  const servicos = []; // Exemplo de array de serviços

  res.json(servicos);
});

// Iniciando o servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
