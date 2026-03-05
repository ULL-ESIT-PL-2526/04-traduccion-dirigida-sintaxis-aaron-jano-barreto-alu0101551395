/* Lexer */
%lex
%%
\s+                   { /* skip whitespace */ }
\/\/.*              { /* skip comments */ }
[0-9]+(\.[0-9]+)?([eE][+-]?[0-9]+)? { return 'number';       }
"**"                  { return 'opow';           }
[-+]                { return 'opad';           }
[*\/]                { return 'opmu';           }
<<EOF>>               { return 'eof';          }
.                     { return 'INVALID';      }
/lex

/* Parser */
%start L
%token number opow opad opmu eof

%left opad opmu
%right opow

%%

L
    : E eof { return $1; }
    ;

E
    : E opad T { $$ = operate($2, $1, $3); }
    | T { $$ = $1; }
    ;

T
    : T opmu R { $$ = operate( $2, $1, $3);}
    | R { $$ = $1; }
    ;

R
    : F opow R {$$ = operate($2, $1, $3);}
    | F  {$$ = $1;}
    ;

F 
    : number {$$ = Number($1);}
    ;
%%

function operate(op, left, right) {
    switch (op) {
        case '+': return left + right;
        case '-': return left - right;
        case '*': return left * right;
        case '/': return left / right;
        case '**': return Math.pow(left, right);
    }
}
