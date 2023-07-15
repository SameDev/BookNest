const express = require('express');
const session = require('express-session');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const { firestore } = require('./firebaseAdmin');

const { initializeApp } = require('firebase/app')
const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword} = require('firebase/auth')

const auth = getAuth

const firebaseConfig = {
  apiKey: "AIzaSyBeX-2DPk6F_ab-stDp7sN2FyxO5vuhngA",
  authDomain: "petcare-connect.firebaseapp.com",
  projectId: "petcare-connect",
  storageBucket: "petcare-connect.appspot.com",
  messagingSenderId: "737625730700",
  appId: "1:737625730700:web:257c17a87c72241a6555a9"
};

// Initialize Firebase
const fireApp = initializeApp(firebaseConfig);

app.use(session({ secret: 'jufdju2ei88228c=dhdggfyejf' }));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

const viewsDir = path.join(__dirname+'/src/views/');
const viewFiles = fs.readdirSync(viewsDir);

app.get('/', (req, res) => {
  res.render(path.join(viewsDir, 'index'));
});

viewFiles.forEach((file) => {
  const route = '/' + path.parse(file).name;
  app.get(route, (req, res) => {
    res.render(path.join(viewsDir, file));
  });
});

app.post('/usuarios', async (req, res) => {
  try {
    const { nome, email, senha, acao } = req.body;

    if (acao === 'login') {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, senha);
        const user = userCredential.user;
        console.log('Usuário autenticado:', user.uid);
        res.redirect('/dashboard');
      } catch (error) {
        console.error('Erro ao autenticar usuário:', error);
        throw error;
      }
    } else if (acao === 'cadastro') {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
        console.log(userCredential)
        const user = userCredential.user;
        session.Store(user)
        console.log('Usuário cadastrado:', user.uid);
        res.redirect('/dashboard');
      } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        throw error;
      }
    } else {
      res.status(400).json({ message: 'Ação inválida' });
    }
  } catch (error) {
    console.error('Erro ao criar ou autenticar usuário:', error);
    res.status(500).json({ message: 'Erro ao criar ou autenticar usuário' });
  }
});

app.get('/dashboard', (req, res) => {
  // Verificação da sessão de usuário
  if (!req.session.userId) {
    res.redirect('/');
    return;
  }
  
  const userId = req.session.userId;

});

app.get('/servicos', (req, res) => {
  const { tipo } = req.query;
  const servicos = []; // Exemplo de array de serviços

  // Lógica para buscar serviços no banco de dados com base no tipo
  // ...

  res.json(servicos);
});

const port = 4000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
