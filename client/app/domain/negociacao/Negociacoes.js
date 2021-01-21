class Negociacoes {

    constructor() {

        this._negociacoes = [];
        //this._armadilha = armadilha; - implementação do proxy - cap 9
        //this._contexto = contexto;
        Object.freeze(this);
    }

    adiciona(negociacao) {

        this._negociacoes.push(negociacao);

        //this._armadilha.call(this._contexto, this); /uso da função call, pag 176
        //this._armadilha(this); - implementação do proxy - cap 9
    }

    paraArray() {

        return [].concat(this._negociacoes);
    }

    get volumeTotal(){

        return this._negociacoes
            .reduce((total, negociacao) =>
                total + negociacao.volume, 0);
    }

    esvazia() {

        this._negociacoes.length = 0;

        //this._armadilha.call(this._contexto, this);
        //this._armadilha(this); - implementação do proxy - cap 9
    }

}