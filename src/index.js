const express = require("express");
const app = express();
const PORT = 3000;


app.use('/', express.static('src/public'));

app.listen(PORT, () => {
    console.log("Servidor Executando com Sucesso!")
})