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

# Práctica 5: Traducción dirigida por la sintaxis: gramática

Esta es la quinta práctica de la asignatura de Procesadores de Lenguajes del Grado en Ingeniería Informática de la Universidad de La Laguna. El objetivo principal de esta práctica es profundizar en el uso de herramientas de generación de analizadores sintácticos como Jison, mediante la transición de una gramática simple y ambigua hacia una implementación robusta que respete las reglas de precedencia y asociatividad de operadores. A través del análisis de derivaciones y árboles sintácticos, el estudiante deberá identificar las limitaciones de una Definición Dirigida por la Sintaxis (SDD) básica para luego refactorizarla, integrando jerarquías de operadores (aditivos, multiplicativos y de potencia), recursividad a la derecha para la asociatividad de la potencia y el manejo de subexpresiones entre paréntesis. Todo el proceso está guiado por el desarrollo basado en pruebas (TDD), donde la validación mediante Jest garantiza que la lógica semántica de la calculadora se alinee finalmente con los convenios estándar de los lenguajes de programación y las matemáticas.

## Desarrollo de las tareas

1. Partiendo de la gramática y las siguientes frases 4.0-2.0*3.0, 2\**3**2 y 7-4/2:
  1.1. Escriba la derivación para cada una de las frases.
  - 4.0 - 2.0 * 3.0  
  L -> E eof  
  -> E op T eof  
  -> E op T op T eof  
  -> T op T op T eof  
  -> number op T op T eof  
  -> 4.0 - T op T eof  
  -> 4.0 - number op T eof  
  -> 4.0 - 2.0 * T eof  
  -> 4.0 - 2.0 * number eof  
  -> 4.0 -2.0 * 3.0 eof  

  - 2\**3**2  
  L -> E eof  
  -> E op T eof  
  -> E op T op T eof  
  -> T op T op T eof  
  -> number op T op T eof  
  -> 2 ** T op T eof  
  -> 2 ** number op T eof  
  -> 2 ** 3 ** T eof  
  -> 2 ** 3 ** number eof  
  -> 2 ** 3 ** 2 eof  

  - 7 - 4 / 2  
  L -> E eof  
  -> E op T eof  
  -> E op T op T eof  
  -> T op T op T eof  
  -> number op T op T eof  
  -> 7 - T op T eof  
  -> 7 - number op T eof  
  -> 7 - 4 / T eof  
  -> 7 - 4 / number eof  
  -> 7 - 4 / 2 eof  

  1.2. Escriba el árbol de análisis sintáctico (*parse tree*) para cada una de las frases.

  - 4.0 - 2.0 * 3.0  
```
          L
       /     \
      E      eof
    / | \
   E  op  T
   | (*)  |
  /|\   number(3.0)
 E op T
 | (-) |
 T   number(2.0)
 |
number(4.0)
```
  - 2\**3**2  
```
          L
       /     \
      E      eof
    / | \
   E  op  T
   | (**) |
  /|\   number(2)
 E op T
 |(**)|
 T  number(3)
 |
number(2)
```
  - 7 - 4 / 2  
```
          L
       /     \
      E      eof
    / | \
   E  op  T
   | (/)  |
  /|\   number(2)
 E op T
 | (-) |
 T   number(4)
 |
number(7)
```

  1.3. ¿En qué orden se evaluan las acciones semánticas para cada una de las frases?
  Nótese que la evaluación a la que da lugar la sdd para las frases no se corresponde con los
  convenios de evaluación establecidos en matemáticas y los lenguajes de programación.
  1.4. Añada un fichero prec.test.js al directorio **\_\_test__** con las siguientes pruebas y compruebe que con la implementación actual fallan.
  ```js
  describe('Parser Failing Tests', () => {
    test('should handle multiplication and division before addition and subtraction', () => {
      expect(parse("2 + 3 * 4")).toBe(14); // 2 + (3 * 4) = 14
      expect(parse("10 - 6 / 2")).toBe(7); // 10 - (6 / 2) = 7
      expect(parse("5 * 2 + 3")).toBe(13); // (5 * 2) + 3 = 13
      expect(parse("20 / 4 - 2")).toBe(3); // (20 / 4) - 2 = 3
    });
    test('should handle exponentiation with highest precedence', () => {
      expect(parse("2 + 3 ** 2")).toBe(11); // 2 + (3 ** 2) = 11
      expect(parse("2 * 3 ** 2")).toBe(18); // 2 * (3 ** 2) = 18
      expect(parse("10 - 2 ** 3")).toBe(2); // 10 - (2 ** 3) = 2
    });
    test('should handle right associativity for exponentiation', () => {
      expect(parse("2 ** 3 ** 2")).toBe(512); // 2 ** (3 ** 2) = 2 ** 9 = 512
      expect(parse("3 ** 2 ** 2")).toBe(81); // 3 ** (2 ** 2) = 3 ** 4 = 81
    });
    test('should handle mixed operations with correct precedence', () => {
      expect(parse("1 + 2 * 3 - 4")).toBe(3); // 1 + (2 * 3) - 4 = 3
      expect(parse("15 / 3 + 2 * 4")).toBe(13); // (15 / 3) + (2 * 4) = 13
      expect(parse("10 - 3 * 2 + 1")).toBe(5); // 10 - (3 * 2) + 1 = 5
    });
    test('should handle expressions with exponentiation precedence', () => {
      expect(parse("2 ** 3 + 1")).toBe(9); // (2 ** 3) + 1 = 9
      expect(parse("3 + 2 ** 4")).toBe(19); // 3 + (2 ** 4) = 19
      expect(parse("2 * 3 ** 2 + 1")).toBe(19); // 2 * (3 ** 2) + 1 = 19
    });
    test('should handle various realistic calculations with correct precedence', () => {
      expect(parse("1 + 2 * 3")).toBe(7); // 1 + (2 * 3) = 7
      expect(parse("6 / 2 + 4")).toBe(7); // (6 / 2) + 4 = 7
      expect(parse("2 ** 2 + 1")).toBe(5); // (2 ** 2) + 1 = 5
      expect(parse("10 / 2 / 5")).toBe(1); // (10 / 2) / 5 = 1
      expect(parse("100 - 50 + 25")).toBe(75); // (100 - 50) + 25 = 75
      expect(parse("2 * 3 + 4 * 5")).toBe(26); // (2 * 3) + (4 * 5) = 26
    });
  });
  ```