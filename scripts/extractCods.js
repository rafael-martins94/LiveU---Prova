var extrair = function extrairCod(array) {
    cod = {
        nomeCod: "",
        sobrenomeCod: "",
        emailCod: ""
    }


    let n = 0
    for (var i = 0; i < array.length; i++) {
        if (n === 1 && array[i] != "#") {
            cod.nomeCod = cod.nomeCod + array[i]
        }
        if (n === 3 && array[i] != "#") {
            cod.sobrenomeCod = cod.sobrenomeCod + array[i]
        }

        if (n === 5 && array[i] != "#") {
            cod.emailCod = cod.emailCod + array[i]
        }

        //console.log(array[i])
        if (array[i] === "#") {
            n++
        }
    }

    return cod
}

module.exports = extrair;