class NegociacoesView extends View {

    template(model) {
        return `
            <table class="table table-hover table-bordered">
                <thead>
                    <tr>
                        <th>DATA</th>
                        <th>QUANTIDADE</th>
                        <th>VALOR</th>
                        <th>VOLUME</th>
                    </tr>
                </thead>
                
                <tbody>
                </tbody>
                    ${model.paraArray().map(negociacao =>
                        `
                            <tr>
                                <td>${DateConverter.paraTexto(negociacao.data)}</td>
                                <td>${negociacao.quantidade}</td>
                                <td>${negociacao.valor}</td>
                                <td>${negociacao.volume}</td>
                            </tr>
                        `
                    ).join('')}
                <tfoot>
                        <tr>
                            <td colspan="3"></td>
                            <td>${model.volumeTotal}</td>
                </tfoot>
            </table>
        `
    }

}