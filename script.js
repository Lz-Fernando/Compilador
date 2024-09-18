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
    { type: 'OPREL', regex: /<>/ , atributo: 'DIFER'},
    { type: 'OPREL', regex: /==/ , atributo: 'IGUAL'},

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
//Comentário que será descartado
VAR 
    x, y : INTEGER;
BEGIN
    x := 10;
    y := x * 2; // Atribuição com operação aritmética
    WHILE x < y DO
    BEGIN
        WRITE(x); // Escreve o valor de x
        x := x + 1; // Incrementa x
    WRITE(Finalizado);
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

/* gramática
Prog       --> PROGRAM IDENTIFIER PVIG Decls CmdComp PONTO

Decls      --> ε | VAR ListDecl

ListDecl   --> DeclTip PVIG ListDecl | DeclTip PVIG

DeclTip    --> ListId DPONTOS Tip

ListId     --> IDENTIFIER | IDENTIFIER VIG ListId

Tip        --> INTEGER | BOOLEAN | ID

CmdComp    --> BEGIN ListCmd END

ListCmd    --> Cmd PVIG ListCmd | Cmd

Cmd        --> CmdWhile | CmdRead | CmdWrite | CmdAtrib | CmdComp

CmdWhile   --> WHILE Expr DO Cmd

CmdRead    --> READ ABPAR ListId FPAR

CmdWrite   --> WRITE ABPAR ListW FPAR

ListW      --> ElemW | ElemW VIG ListW

ElemW      --> STRING | Expr

CmdAtrib   --> IDENTIFIER ATRIB Expr

Expr       --> Expr OPREL Expr
            | Expr OPAD Expr
            | Expr OPMULT Expr
            | OPNEG Expr
            | Term

Term       --> IDENTIFIER
            | CTE
            | ABPAR Expr FPAR
            | TRUE
            | FALSE
            | OPNEG Term
*/

// Analisador lexico

function parser(tokens) {
    let currentTokenIndex = 0;
    
    function currentToken() {
        return tokens[currentTokenIndex];
    }

    function match(expectedType) {
        if (currentToken().type === expectedType) {
            currentTokenIndex++;
        } else {
            throw new Error(`Erro: esperado ${expectedType}, encontrado ${currentToken().type}`);
        }
    }

    // Implementação de cada regra da gramática
    
    function Prog() {
        match('PROGRAM');
        match('ID');  // Identificador
        match('PVIG');  // ;
        Decls();
        CmdComp();
        match('PONTO');  // .
    }

    function Decls() {
        if (currentToken().type === 'VAR') {
            match('VAR');
            ListDecl();
        }
    }

    function ListDecl() {
        DeclTip();
        while (currentToken().type === 'VIG') {  // ,
            match('VIG');
            DeclTip();
        }
    }

    function DeclTip() {
        ListId();
        match('DPONTOS');  // :
        Tip();
        match('PVIG');  // ;
    }

    function ListId() {
        match('ID');  // Identificador
        if (currentToken().type === 'VIG') {
            match('VIG');
            ListId();
        }
    }

    function Tip() {
        if (currentToken().type === 'INTEGER') {
            match('INTEGER');
        } else if (currentToken().type === 'BOOLEAN') {
            match('BOOLEAN');
        } else if (currentToken().type === 'ID') {  // Tipos definidos pelo usuário
            match('ID');
        } else {
            throw new Error('Tipo esperado');
        }
    }

    function CmdComp() {
        match('BEGIN');
        ListCmd();
        match('END');
    }

    function ListCmd() {
        Cmd();
        while (currentToken().type === 'PVIG') {  // ;
            match('PVIG');
            Cmd();
        }
    }

    function Cmd() {
        console.log("Token atual em Cmd():", currentToken());  // Adicione isto para ver qual token está causando o erro
        if (currentToken().type === 'ID') {
            CmdAtrib();
        } else if (currentToken().type === 'WHILE') {
            CmdWhile();
        } else if (currentToken().type === 'READ') {
            CmdRead();
        } else if (currentToken().type === 'WRITE') {
            CmdWrite();
        } else if (currentToken().type === 'BEGIN') {
            CmdComp();
        } else {
            throw new Error('Comando inválido');
        }
    }

    function CmdAtrib() {
        match('ID');  // Identificador
        match('ATRIB');  // :=
        Expr();  // Expressão após o operador de atribuição
    }
    function CmdWhile() {
        match('WHILE');
        Expr();
        match('DO');
        Cmd();
    }

    function CmdRead() {
        match('READ');
        match('ABPAR');  // (
        ListId();
        match('FPAR');  // )
    }

    function CmdWrite() {
        match('WRITE');
        match('ABPAR');  // (
        ListW();
        match('FPAR');  // )
    }

    function ListW() {
        ElemW();
        while (currentToken().type === 'VIG') {
            match('VIG');
            ElemW();
        }
    }

    function ElemW() {
        if (currentToken().type === 'ID') {
            match('ID');
        } else {
            Expr();
        }
    }

    function Expr() {
        ExprRel();
    }
    
    function ExprRel() {
        ExprAdd();
        while (['MENOR', 'MENIG', 'MAIOR', 'MAIG', 'IGUAL', 'DIFER'].includes(currentToken().atributo)) {
            match('OPREL');  // Operador relacional
            ExprAdd();
        }
    }
    
    function ExprAdd() {
        ExprMult();
        while (['MAIS', 'MENOS'].includes(currentToken().atributo)) {
            match('OPAD');  // Operador de adição ou subtração
            ExprMult();
        }
    }
    
    function ExprMult() {
        Term();
        while (['VEZES', 'DIV'].includes(currentToken().atributo)) {
            match('OPMULT');  // Operador de multiplicação ou divisão
            Term();
        }
    }
    
    function Term() {
        if (currentToken().type === 'OPNEG') {
            match('OPNEG');  // Operador de negação
            Term();
        } else if (['ID', 'NUM', 'TRUE', 'FALSE'].includes(currentToken().type)) {
            match(currentToken().type);  // Identificador, número ou valores booleanos
        } else if (currentToken().type === 'ABPAR') {
            match('ABPAR');  // (
            Expr();  // Expressão entre parênteses
            match('FPAR');  // )
        } else {
            throw new Error('Termo esperado');
        }
    }   

    // Início da análise sintática
    Prog();
    
    // Verifica se todos os tokens foram consumidos
    if (currentTokenIndex !== tokens.length) {
        throw new Error('Tokens restantes após a análise');
    }
}

// Exemplo de uso
const tokens = lexica(codigoLimpo);  // A função léxica já foi fornecida
try {
    parser(tokens);
    console.log('Análise sintática concluída com sucesso.');
} catch (erro) {
    console.error(erro.message);
}