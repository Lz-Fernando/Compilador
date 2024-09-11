const tokensReservados = [
    { type: 'PROGRAM', regex: /PROGRAM/ },
    { type: 'BOOLEAN', regex: /BOOLEAN/ },
    { type: 'INTEGER', regex: /INTEGER/ },
    { type: 'BEGIN', regex: /BEGIN/ },
    { type: 'END', regex: /END/ },
    { type: 'WHILE', regex: /WHILE/ },
    { type: 'DO', regex: /DO/ },
    { type: 'READ', regex: /READ/ },
    { type: 'VAR', regex: /VAR/ },
    { type: 'FALSE', regex: /FALSE/ },
    { type: 'TRUE', regex: /TRUE/ },
    { type: 'WRITE', regex: /WRITE/ },
    { type: 'ID', regex: /[a-zA-Z_]\w{0,15}/ },
    { type: 'NUM', regex: /\d+/ },
    { type: 'OP', regex: /[+\-*/]/ },
    { type: 'RELOP', regex: /[<>]=?|==|<>/ },
    { type: 'ASSIGN', regex: /:=/ },
    { type: 'SEMI', regex: /;/ },
    { type: 'LPAREN', regex: /\(/ },
    { type: 'RPAREN', regex: /\)/ },
    { type: 'COLON', regex: /:/ },
    { type: 'DOT', regex: /\./ },
    { type: 'WHITESPACE', regex: /[ \t]+/ },
    { type: 'NEWLINE', regex: /\n/ },
    { type: 'MISMATCH', regex: /./ }
];

function lexica (codigo) {
    let tokens = [];
    let numlinha = 1;

    while (codigo.length > 0) {
        let combinou = false;

        for (let { type, regex} of tokensReservados) {
            const combinar = regex.exec(codigo);

            if (combinar && combinar.index === 0) {
                const valor = combinar[0];

                if (type === 'NEWLINE') {
                    numlinha++;
                } 
                
                else if (type === 'MISMATCH') {
                    throw new Error (`Token inesperado ${valor} na linha ${numlinha}`);
                }

                else {
                    tokens.push({type, valor});
                }

                codigo = codigo.slice(valor.length);
                combinou = true;
                break;
            }
        }

        if (!combinou) {
            throw new Error (`Erro de análise léxica na linha ${numlinha}`);
        }
    }

    return tokens;
}

const codigo = `
PROGRAM exemplo;
VAR x : INTEGER;
BEGIN
    x := 10;
    WRITE(x);
END.
`;

try {
    const tokens = lexica(codigo);
    tokens.forEach( token => 
        console.log(token));
} catch (erro) {
    console.error(erro.message);
}