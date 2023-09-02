const express = require('express');
const session = require('express-session');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Firebase
const { firestore, db } = require('./src/firebaseAdmin');

const { initializeApp } = require('firebase/app');
const Auth = require('firebase/auth');

const firebaseConfig = {
  apiKey: "AIzaSyBeX-2DPk6F_ab-stDp7sN2FyxO5vuhngA",
  authDomain: "petcare-connect.firebaseapp.com",
  projectId: "petcare-connect",
  storageBucket: "petcare-connect.appspot.com",
  messagingSenderId: "737625730700",
  appId: "1:737625730700:web:257c17a87c72241a6555a9"
};
const fireApp = initializeApp(firebaseConfig);
const auth = Auth.getAuth();
//teste
const google = new Auth.GoogleAuthProvider();

// Inicializar Sessão
app.use(session({ secret: 'jufdju2ei88228c=dhdggfyejf', resave: false, saveUninitialized: true }));

// Gerenciamento de rotas
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
const viewsDir = path.join(__dirname+'/src/views/');
const viewFiles = fs.readdirSync(viewsDir);

app.use('/static', express.static(__dirname + '/src/public/'));



app.get('/', (req, res) => {
  res.render(path.join(viewsDir, 'index'));
});

viewFiles.forEach((file) => {
  const route = '/' + path.parse(file).name;
  if (route == '/dashboard') {
    app.get('/dashboard', (req, res) => {
      // Verificação da sessão de usuário
      if (!req.session.user.uid) {
        res.redirect('/');
        return;
      }
      
      const user = req.session.user;
      res.render(path.join(viewsDir, 'dashboard'), { user });
    });
  }
  app.get(route, (req, res) => {
    res.render(path.join(viewsDir, file));
  });
});

// Autenticação
app.post('/usuarios', async (req, res) => {
  try {
    const { nome, email, senha, data, acao } = req.body;

    if (acao === 'login') {
      try {
        const userCredential = await Auth.signInWithEmailAndPassword(auth, email, senha);
        const user = userCredential.user;
        console.log('Usuário autenticado:', user.uid);
        console.log(userCredential)
        // Armazenar o userId na sessão
        req.session.user = user;
        
        res.redirect('/dashboard');
      } catch (error) {
        console.error('Erro ao autenticar usuário:', error);
        throw error;
      }
    } else if (acao === 'cadastro') {
      try {
        const userCredential = await Auth.createUserWithEmailAndPassword(auth, email, senha);
        const user = userCredential.user;
        
        // Armazenar o user na sessão
        req.session.user = user;

         // Armazenar os dados do usuário na coleção "usuarios"
         const userDocRef = db.collection('usuarios').doc(user.uid);
         const userData = { nome, email, id: user.uid, data };
         await userDocRef.set(userData);

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

app.post('/logout', async (req, res) => {
  req.session.destroy()
  res.redirect('/')
});

// Listar serviços

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
