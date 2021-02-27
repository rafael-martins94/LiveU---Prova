var total = function(resultadoNome, resultadoSobrenome, resultadoEmail) {

    

    var somaNome = parseInt(resultadoNome[0].cod) + parseInt(resultadoNome[0].soma)
    var somaSobrenome = parseInt(resultadoSobrenome[0].cod) + parseInt(resultadoSobrenome[0].soma)
    var somaEmail = parseInt(resultadoEmail[0].cod) + parseInt(resultadoEmail[0].soma)

    var subTotal = somaNome + somaSobrenome + somaEmail



    return subTotal

}


module.exports = total;

