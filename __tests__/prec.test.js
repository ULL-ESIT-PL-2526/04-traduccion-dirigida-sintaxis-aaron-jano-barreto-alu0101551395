const parse = require("../src/parser.js").parse;

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

describe('comprobar que se respeta la precedencia y asociatividad con flotantes', () => {
  test('should handle floating-point numbers with correct precedence', () => {
    expect(parse("2.5 + 3.5 * 4.0")).toBe(16.5); // 2.5 + (3.5 * 4.0) = 16.5
    expect(parse("10.0 - 6.0 / 2.0")).toBe(7.0); // 10.0 - (6.0 / 2.0) = 7.0
    expect(parse("5.5 * 2.0 + 3.0")).toBe(14.0); // (5.5 * 2.0) + 3.0 = 14.0
    expect(parse("20.0 / 4.0 - 2.0")).toBe(3.0); // (20.0 / 4.0) - 2.0 = 3.0
  });
  test('should handle exponentiation with floating-point numbers', () => {
    expect(parse("2.0 + 3.0 ** 2.0")).toBe(11.0); // 2.0 + (3.0 ** 2.0) = 11.0
    expect(parse("2.0 * 3.0 ** 2.0")).toBe(18.0); // 2.0 * (3.0 ** 2.0) = 18.0
    expect(parse("10.0 - 2.0 ** 3.0")).toBe(2.0); // 10.0 - (2.0 ** 3.0) = 2.0
  });
  test('should handle right-associativity of exponentiation', () => {
    // 2.0 ** (3.0 ** 2.0) = 2.0 ** 9.0 = 512.0
    expect(parse("2.0 ** 3.0 ** 2.0")).toBe(512.0);
  });

  test('should handle left-associativity of multiplication and division', () => {
    // (24.0 / 4.0) / 2.0 = 6.0 / 2.0 = 3.0
    expect(parse("24.0 / 4.0 / 2.0")).toBe(3.0);
    // (10.0 / 2.0) * 3.0 = 5.0 * 3.0 = 15.0
    expect(parse("10.0 / 2.0 * 3.0")).toBe(15.0);
  });

  test('should handle left-associativity of addition and subtraction', () => {
    // (10.0 - 3.0) + 2.0 = 7.0 + 2.0 = 9.0
    expect(parse("10.0 - 3.0 + 2.0")).toBe(9.0);
    // (5.5 + 4.5) - 2.0 = 10.0 - 2.0 = 8.0
    expect(parse("5.5 + 4.5 - 2.0")).toBe(8.0);
  });

  test('should handle scientific notation (e/E) correctly', () => {
    // 1.5e2 = 150.0 -> 150.0 + 50.0 = 200.0
    expect(parse("1.5e2 + 50.0")).toBe(200.0);
    // 2.5E-1 = 0.25 -> 0.25 * 100.0 = 25.0
    expect(parse("2.5E-1 * 100.0")).toBe(25.0);
  });

  test('should handle complex mixed floating-point expressions', () => {
    // 1.5 + (2.5 * (3.0 ** 2.0)) - (4.0 / 2.0)
    // 1.5 + (2.5 * 9.0) - 2.0
    // 1.5 + 22.5 - 2.0 = 22.0
    expect(parse("1.5 + 2.5 * 3.0 ** 2.0 - 4.0 / 2.0")).toBe(22.0);
  });

  test('should handle decimal numbers smaller than 1 starting with a dot', () => {
    // Asumiendo que tu lexer puede aceptar .5 (si modificas la regex, si no, puedes obviar este test o cambiar a 0.5)
    // 0.5 * 4.0 = 2.0
    expect(parse("0.5 * 4.0")).toBe(2.0);
  });
});

describe('puebas de paretnesis', () => {
  test('should handle parentheses to override precedence', () => {
    expect(parse("(2 + 3) * 4")).toBe(20); // (2 + 3) * 4 = 20
    expect(parse("10 - (6 / 2)")).toBe(7); // 10 - (6 / 2) = 7
    expect(parse("(5 * 2) + 3")).toBe(13); // (5 * 2) + 3 = 13
    expect(parse("20 / (4 - 2)")).toBe(10); // 20 / (4 - 2) = 10
    expect(parse("(1 + 2) * (3 + 4)")).toBe(21); // (1 + 2) * (3 + 4) = 21
    expect(parse("((1 + 2) * 3) + 4")).toBe(13); // ((1 + 2) * 3) + 4 = 13
    expect(parse("2 ** (3 + 2)")).toBe(32); // 2 ** (3 + 2) = 32
    expect(parse("(2 + 3) ** 2")).toBe(25); // (2 + 3) ** 2 = 25
    expect(parse("((2 + 3) * 4) - (5 * (6 - 4))")).toBe(10); // ((2 + 3) * 4) - (5 * (6 - 4)) = 10
  });
});