class DataInvalidaException extends ApplicationExcpetion {

    constructor() {

        super('A data deve estar no formato dd/mm/aaaa');
    }
}