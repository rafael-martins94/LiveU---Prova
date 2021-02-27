const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require('body-parser')
const axios = require('axios')
const bd = require("./models/db")
const extrairCod = require("./scripts/extractCods")
const somaTotal = require("./scripts/somaTotal")

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));


app.get("/", function (req, res) {
    res.render("index")
})

app.get("/error", function (req, res) {
    res.send("ERROR")
})




var total = []
var totalMaster


app.post("/result", function (req, res) {
    const params = new URLSearchParams()
    params.append('nome', req.body.nome)
    params.append('sobrenome', req.body.sobrenome)
    params.append('email', req.body.email)

    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }

    axios.post("http://138.68.29.250:8082/", params, config)
        .then(async (resultsApi) => {
            console.log(resultsApi.data)
            var codigos = await extrairCod(resultsApi.data)
            console.log(codigos)

            //------------------INSERINDO NAS TABELAS---------------------------
            await bd.sql(`INSERT INTO tbs_nome VALUES('${req.body.nome}', ${codigos.nomeCod})`)
                .returnRowCount()
                .execute()
                .then((rowCount) => {
                    console.log(rowCount)
                })
                .catch((err) => {
                    console.log(err)
                    res.redirect("/error")
                });


            await bd.sql(`INSERT INTO tbs_sobrenome VALUES('${req.body.sobrenome}', ${codigos.sobrenomeCod})`)
                .returnRowCount()
                .execute()
                .then((rowCount) => {
                    console.log(rowCount)
                })
                .catch((err) => {
                    console.log(err)
                    res.redirect("/error")
                });


            await bd.sql(`INSERT INTO tbs_email VALUES('${req.body.email}', ${codigos.emailCod})`)
                .returnRowCount()
                .execute()
                .then((rowCount) => {
                    console.log(rowCount)
                })
                .catch((err) => {
                    console.log(err)
                    res.redirect("/error")
                });

            // ------------ CONSULTANDO NA TABELA COD -----------------------------------------------------
                
            var resultsNome = await bd.sql(`SELECT * FROM tbs_cod_nome WHERE cod = ${codigos.nomeCod}`).execute()  
            var resultsSobrenome = await bd.sql(`SELECT * FROM tbs_cod_sobrenome where cod = ${codigos.sobrenomeCod}`).execute()
            var resultsEmail = await bd.sql(`SELECT * FROM tbs_cod_email where cod = ${codigos.emailCod}`).execute()

            var master = await somaTotal(resultsNome, resultsSobrenome, resultsEmail)

            var arrayFinal = await bd.sql(`SELECT tbs_animais.animal, tbs_cores.cor, tbs_paises.pais
            FROM tbs_animais 
            INNER JOIN tbs_cores
            ON tbs_animais.total = tbs_cores.total
            INNER JOIN tbs_paises
            ON tbs_animais.total = tbs_paises.total
            LEFT JOIN tbs_cores_excluidas
            ON tbs_cores_excluidas.cor = tbs_cores.cor
            WHERE tbs_cores_excluidas.cor IS NULL
            AND  tbs_animais.total = ${master}`).execute()    

            .catch((error)=>{
                console.log(error)
                res.redirect("/error")
            })
            

            console.log(arrayFinal)


            res.render("result" , {animal: arrayFinal[0].animal, cor: arrayFinal[0].cor, pais: arrayFinal[0].pais})     


        })

})




app.listen(3333, function () { console.log("Server Run") })