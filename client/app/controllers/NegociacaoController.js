class NegociacaoController {

    constructor() {

        const $ = document.querySelector.bind(document);
        
        this._inputData = $('#data');
        this._inputQuantidade = $('#quantidade');
        this._inputValor = $('#valor');

        /*
        // const self = this; solução mostrada mas não usada... copia this para chamar NegociacaoController, dentro do loop saia Negociacoes - pag 175
        this._negociacoes = new Negociacoes(model => {
            this._negociacoesView.update(model);
        });*/

        //const self = this;

        /* this._negociacoes = new Proxy(new Negociacoes(), {
            
            get(target, prop, receiver) {

                if(typeof(target[prop]) == typeof(Function) && ['adiciona', 'esvazia'].includes(prop)) {
                    return function() {
                        console.log(`"${prop}" disparou a armadilha`);
                        target[prop].apply(target, arguments);
                        self._negociacoesView.update(target);
                    }
                } else {

                    return target[prop];
                }
            }
        }); */

        this._negociacoes = new Bind(
            new Negociacoes(),
            new NegociacoesView('#negociacoes'),
            'adiciona', 'esvazia'
        );

        //this._negociacoesView = new NegociacoesView('#negociacoes');
        //this._negociacoesView.update(this._negociacoes);

        this._mensagem = new Bind(
            new Mensagem(),
            new MensagemView('#mensagemView'),
            'texto'
        );
        
        //this._mensagemView = new MensagemView('#mensagemView');
        //this._mensagemView.update(this._mensagem);

    }

    _limpaFormulario() {

        this._inputData.value = '';
        this._inputQuantidade.value = 1;
        this._inputValor.value = 0.0;
        this._inputData.focus();

    }

    _criaNegoiacao() {
        return new Negociacao(
            DateConverter.paraData(this._inputData.value),
            parseInt(this._inputQuantidade.value),
            parseFloat(this._inputValor.value)
        );
    }

    adiciona(event) {

        try{
            event.preventDefault();
            this._negociacoes.adiciona(this._criaNegoiacao());
            this._mensagem.texto = 'Negociação adicionada com sucesso';
            this._limpaFormulario();
        } catch(err) {
            console.log(err);
            console.log(err.stack);

            if(err instanceof DataInvalidaException) {
                this._mensagem.texto = err.message;
            } else {
                this._mensagem.texto = 'Um erro não esperado aconteceu. Entre em contato com o suporte.';
            }
        }
    }

    apaga() {

        this._negociacoes.esvazia();
        this._mensagem.texto = "Negociações apagadas com sucesso";
    }

}