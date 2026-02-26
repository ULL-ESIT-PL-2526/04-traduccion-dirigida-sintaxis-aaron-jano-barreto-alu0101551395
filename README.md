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
