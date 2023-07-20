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
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID
};
const fireApp = initializeApp(firebaseConfig);
const auth = Auth.getAuth();

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
      if (!req.session.userId) {
        res.redirect('/');
        return;
      }
      
      const userId = req.session.userId;
      res.render(path.join(viewsDir, 'dashboard'), { userId });
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
        req.session.userId = user.uid;
        
        res.redirect('/dashboard');
      } catch (error) {
        console.error('Erro ao autenticar usuário:', error);
        throw error;
      }
    } else if (acao === 'cadastro') {
      try {
        const userCredential = await Auth.createUserWithEmailAndPassword(auth, email, senha);
        const user = userCredential.user;
        
        // Armazenar o userId na sessão
        req.session.userId = user.uid;

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
