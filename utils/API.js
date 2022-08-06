module.exports = function resposta_API(objeto, res, status=200, isOK=true){
    if(isOK){
        objeto.erroGeral = 'nao';
        return res.status(status).json(objeto);
    }else{
        objeto.erroGeral = 'sim';
        return res.status(status).json(objeto);
    }
}