# Syntax Directed Translation with Jison

Jison is a tool that receives as input a Syntax Directed Translation and produces as output a JavaScript parser  that executes
the semantic actions in a bottom up ortraversing of the parse tree.
 

## Compile the grammar to a parser

See file [grammar.jison](./src/grammar.jison) for the grammar specification. To compile it to a parser, run the following command in the terminal:
``` 
➜  jison git:(main) ✗ npx jison grammar.jison -o parser.js
```

## Use the parser

After compiling the grammar to a parser, you can use it in your JavaScript code. For example, you can run the following code in a Node.js environment:

```
➜  jison git:(main) ✗ node                                
Welcome to Node.js v25.6.0.
Type ".help" for more information.
> p = require("./parser.js")
{
  parser: { yy: {} },
  Parser: [Function: Parser],
  parse: [Function (anonymous)],
  main: [Function: commonjsMain]
}
> p.parse("2*3")
6
```

# Práctica 4: Traducción dirigida por la sintaxis: léxico

Esta es la cuarta práctica de la asignatura de Procesadores de Lenguajes del Grado en Ingeniería Informática de la Universidad de La Laguna. La cual tiene como objetivo familiarizarse con los siguientes elementos:

1. Syntax Directed Definition - sdd
2. Jison
    - Más concretamente el especificación del analizador léxico que se encuentra dentro del bloque %lex
3. Expresiones regulares
4. Tests de jest.

## Desarrollo de las tareas

### 1. Analisis del repositorio del proyecto

- Se instalaron las dependencias del proyecto definidas en package.json mediante `npm i`.
- Se ejecuta Jison para producir el parser `npx jison src/grammar.jison -o src/parser.js`.
- Y se ejecutan las pruebas de Jest `npm test` comprobando que todas son superadas.

### 2. La parte donde se definen los tokens en un fichero Jison se denomina especificación del analizador léxico o lexer y se encuentra dentro del bloque %lex.
El del fichero grammar.jison es el siguiente:
```js
/* Lexer */
%lex
%%
\s+ { /* skip whitespace */; }
[0-9]+ { return 'NUMBER'; }
"**" { return 'OP'; }
[-+*/] { return 'OP'; }
<<EOF>> { return 'EOF'; }
. { return 'INVALID'; }
/lex
```

#### 2.1.  Describa la diferencia entre /* skip whitespace */ y devolver un token: 

/* skip whitespace */ no devuelve ningún token, simplemente ignora los espacios en blanco y el lexer continúa leyendo la siguiente entrada.

En cambio, devolver un token (return 'NUMBER';, por ejemplo) envía ese token al parser para que forme parte del análisis sintáctico.

#### 2.2. Escriba la secuencia exacta de tokens producidos para la entrada 123**45+@.

NUMBER OP NUMBER OP INVALID EOF

#### 2.3 Indique por qué ** debe aparecer antes que [-+*/]

"**" debe aparecer antes que [-+*/] porque el lexer aplica las reglas en orden cuando varias expresiones pueden coincidir con la misma entrada.

Si [-+*/] estuviera antes, al leer ** reconocerían dos tokens OP (uno por cada *) en lugar de un único token OP correspondiente a la potencia.

#### 2.4 Explique cuándo se devuelve EOF

Se devuelve EOF cuando el lexer alcanza el final de la entrada y ya no quedan más caracteres por analizar.

#### 2.5 Explique por qué existe la regla . que devuelve INVALID.

La regla . que devuelve INVALID existe para capturar cualquier carácter que no coincida con las reglas anteriores.

Si aparece un símbolo no válido (por ejemplo @), el lexer no se detiene ni falla silenciosamente, sino que genera explícitamente el token INVALID, permitiendo detectar y manejar errores léxicos.

#### 3. Modifique el analizador léxico de grammar.jison para que se salte los comentarios de una línea que empiezan por //.

Se puso:
```js
\/\/.*\n { /* skip comments */; }
```
porque:

\\/\\/ reconoce literalmente // (la barra se escapa con \\).

.* consume cualquier carácter después de //.

\n asegura que el comentario se consuma hasta el final de la línea.

No se devuelve ningún token, por lo que el comentario se ignora.

#### 4. Modifique el analizador léxico de grammar.jison para que reconozca números en punto flotante como 2.35e-3, 2.35e+3, 2.35E-3, 2.35 y 23.

Se puso:
```js
[0-9]+(\.[0-9]+)?([eE][+-]?[0-9]+)? { return 'NUMBER';       }
```
porque:

[0-9]+ → parte entera

(\.[0-9]+)? → parte decimal opcional

([eE][+-]?[0-9]+)? → exponente opcional, con +, - o sin signo


#### 5. Añada pruebas para las modificaciones del analizador léxico de grammar.jison

Tests añadidos:

```js
describe('Comment handling', () => {
  test('should ignore comments in the input', () => {
    expect(parse("3 + 5 // this is a comment\n")).toBe(8);
    expect(parse("10 - 4 - 3 // another comment\n + 2 - 2")).toBe(3);
    expect(parse("7 - 5 - 1 // comment at end\n + 2")).toBe(3);
  });
});

describe('Decimal and scientific notation handling', () => {
  test('should parse decimal numbers', () => {
    expect(parse("3.14 + 2.86")).toBe(6);
    expect(parse("0.1 + 0.2")).toBeCloseTo(0.3);
    expect(parse("1.5 * 2")).toBe(3);
  });

  test('should parse scientific notation', () => {
    expect(parse("1e3 + 2e3")).toBe(3000);
    expect(parse("5e-1 + 5e-1")).toBe(1);
    expect(parse("2e2 * 3e-2")).toBe(6);
  });
});
```