const tokensReservados = [
    { type: 'COMMENT', regex: /\/\/.*$/gm },
    
    { type: 'PROGRAM', regex: /PROGRAM/ , atributo: 'PROGRAM'},
    { type: 'BOOLEAN', regex: /BOOLEAN/ , atributo: 'BOOLEAN'},
    { type: 'INTEGER', regex: /INTEGER/ , atributo: 'INTEGER'},
    { type: 'BEGIN', regex: /BEGIN/ , atributo: 'BEGIN'},
    { type: 'END', regex: /END/ , atributo: 'END'},
    { type: 'WHILE', regex: /WHILE/ , atributo: 'WHILE'},
    { type: 'DO', regex: /DO/ , atributo: 'DO'},
    { type: 'READ', regex: /READ/ , atributo: 'READ'},
    { type: 'VAR', regex: /VAR/ , atributo: 'VAR'},
    { type: 'FALSE', regex: /FALSE/ , atributo: 'FALSE'},
    { type: 'TRUE', regex: /TRUE/ , atributo: 'TRUE'},
    { type: 'WRITE', regex: /WRITE/ , atributo: 'WRITE'},

    { type: 'NUM', regex: /\d+/ , atributo: ''},
    { type: 'ID', regex: /[a-zA-Z_]\w{0,15}/ , atributo: ''},

    { type: 'OPAD', regex: /\+/ , atributo: 'MAIS'},
    { type: 'OPAD', regex: /-/ , atributo: 'MENOS'},
    { type: 'OPMULT', regex: /\*/ , atributo: 'VEZES'},
    { type: 'OPMULT', regex: /\// , atributo: 'DIV'},

    { type: 'OPREL', regex: /</ , atributo: 'MENOR'},
    { type: 'OPREL', regex: /<=/ , atributo: 'MENIG'},
    { type: 'OPREL', regex: />/ , atributo: 'MAIOR'},
    { type: 'OPREL', regex: /=>/ , atributo: 'MAIG'},
    { type: 'OPREL', regex: /==/ , atributo: 'IGUAL'},
    { type: 'OPREL', regex: /<>/ , atributo: 'DIFER'},

    { type: 'OPLOG', regex: /AND/ , atributo: 'AND'},
    { type: 'OPLOG', regex: /OR/ , atributo: 'OR'},

    { type: 'OPNEG', regex: /[~]/ , atributo: 'NEG'},
    
    { type: 'PVIG', regex: /;/ , atributo: 'PVIG'},
    { type: 'PONTO', regex: /\./ , atributo: 'PONTO'},
    { type: 'ATRIB', regex: /:=/ , atributo: 'ATRIB'},
    { type: 'DPONTOS', regex: /:/ , atributo: 'DPONTOS'},
    { type: 'VIG', regex: /,/ , atributo: 'VIG'},
    { type: 'ABPAR', regex: /\(/ , atributo: 'ABPAR'},
    { type: 'FPAR', regex: /\)/ , atributo: 'FPAR'},

    { type: 'DESCARTE', regex: /[ \t]+/ },

    { type: 'NOVALINHA', regex: /\n/ },
    { type: 'MISMATCH', regex: /./ }
];

function lexica (codigo) {
    let tokens = [];
    let numlinha = 1;

    while (codigo.length > 0) {
        let combinou = false;

        for (let { type, regex, atributo} of tokensReservados) {
            const combinar = regex.exec(codigo);

            if (combinar && combinar.index === 0) {
                const valor = combinar[0];

                if (type != 'DESCARTE' && type != 'COMMENT') {
                    if (type === 'NOVALINHA') {
                        numlinha++;
                    } 
                    
                    else if (type === 'MISMATCH') {
                        throw new Error (`Token inesperado ${valor} na linha ${numlinha}`);
                    }
    
                    else {
                        if (type === 'NUM' | type === 'ID') {
                            atributo = valor
                        }
                        tokens.push({type, valor, atributo});
                    }
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

let codigo = `
PROGRAM exemplo;
//Este e um comentario que deve ser descartado
VAR x : INTEGER;
BEGIN
    x := 10; // Outro comentario aqui
    WRITE(x);
END.
`;

console.log('Código inicial: \n', codigo);

let codigoLimpo = codigo.replace(/\/\/.*$/gm, ' ');
console.log('Código limpo: \n',codigoLimpo);

try {
    const tokens = lexica(codigoLimpo);
    tokens.forEach( token => 
        console.log(token));
} catch (erro) {
    console.error(erro.message);
}

function addElement(){
    const div = document.getElementById('div1');

    const t1 = document.createElement('p');
    t1.classList.add('title');
    t1.textContent = 'Código Inicial: ';

    const t2 = document.createElement('p');
    t2.classList.add('title');
    t2.textContent = 'Código Limpo: ';

    const initialCode = document.createElement('pre');
    initialCode.classList.add('code');
    initialCode.textContent = codigo;

    const cleanCode = document.createElement('pre');
    cleanCode.classList.add('code');
    cleanCode.textContent = codigoLimpo;

    div.appendChild(t1);
    div.appendChild(initialCode);
    div.appendChild(t2);
    div.appendChild(cleanCode);
}

function tokensSh(tokens){
    const div = document.getElementById('div1');
    const t3 = document.createElement('p');
    t3.classList.add('title');
    t3.textContent = 'Tokens: ';

    const tokenList = document.createElement('pre');
    tokenList.classList.add('code');

    tokens.forEach(token => {
        tokenList.textContent += `Type: ${token.type}, Value: ${token.valor}, Attribute: ${token.atributo}\n`;
    });

    div.appendChild(t3);
    div.appendChild(tokenList);
}

document.body.onload = function(){
    addElement();

    try {
        const tokens = lexica(codigoLimpo);
        tokensSh(tokens);
    } catch (erro) {
        console.error(erro.message);
    }
}