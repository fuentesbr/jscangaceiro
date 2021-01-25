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

        this._service = new NegociacaoService();

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

    importaNegociacoes() {

        /*this._service.obterNegociacoesDaSemana((err, negociacoes) => {

            if(err) {
                this._mensagem.texto = 'Não foi possível obter as negociações da semana';
                return;
            }

            negociacoes.forEach(negociacao => this._negociacoes.adiciona(negociacao));
            this._mensagem.texto = 'Negociações importadas com sucesso';
        });*/

        /*this._service.obterNegociacoesDaSemana()
            .then(
                negociacoes => {
                    negociacoes.forEach(
                        negociacao => this._negociacoes.adiciona(negociacao)
                    );
                    this._mensagem.texto = 'Negociações importadas com sucesso';
                },
                err => this._mensagem.texto = err
            );*/

        
        // resolvendo primisses de forma sequencial
        /*const negociacoes = [];

        
        this._service
            .obtemNegociacoesDaSemana()
            .then(semana => {

                negociacoes.push(...semana);

                //quando retornamos uma promise, seu retorno é acessível ao encadear uma chamada à then
                return this._service.obtemNegociacoesDaSemanaAnterior();
            })
            .then(anterior => {

                negociacoes.push(...anterior);
                //negociacoes.forEach(negociacao => this._negociacoes.adiciona(negociacao));
                //this._mensagem.texto = 'Negociações importadas com sucesso';
                return this._service.obtemNegociacoesDaSemanaRetrasada()
            })
            .then(retrasada => {
                negociacoes.push(...retrasada);
                negociacoes.forEach(negociacao => this._negociacoes.adiciona(negociacao));
                this._mensagem.texto = 'Negociações importadas com sucesso';
            })
            .catch(err => this._mensagem.text = err);
        */

        //resolvendo promises de forma paralela
        /*Promise.all([
            this._service.obtemNegociacoesDaSemana(),
            this._service.obtemNegociacoesDaSemanaAnterior(),
            this._service.obtemNegociacoesDaSemanaRetrasada()
        ])
        .then(periodo => {
            
            periodo
                .reduce((novoArray, item) => novoArray.concat(item), [])
                .forEach(negociacao => this._negociacoes.adiciona(negociacao));
            this._mensagem.texto = 'Negociações importadas com sucesso';

        })
        .catch(err => this._mensagem.texto = err);*/

        this._service
            .obtemNegociacoesDoPeriodo()
            .then(negociacoes => {

                negociacoes
                    .filter(novaNegociacao => 
                        !this._negociacoes.paraArray().some(negociacaoExistente => 
                            novaNegociacao.equals(negociacaoExistente)    
                        )
                    )
                    .forEach(negociacao => this._negociacoes.adiciona(negociacao));
                this._mensagem.texto = 'Negociações do período importadas com sucesso';
            })
            .catch(err => this._mensagem.texto = err);
    }

}