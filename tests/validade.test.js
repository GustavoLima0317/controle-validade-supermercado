const test = require("node:test");
const assert = require("node:assert/strict");

const {
    calcularDiasRestantes,
    verificarValidade
} = require("../script.js");

// TESTE 1
test("Produto dentro do prazo", () => {
    assert.equal(
        verificarValidade("2026-12-30", "2026-10-11"),
        "Dentro do prazo"
    );
});

// TESTE 2
test("Produto próximo do vencimento", () => {
    assert.equal(
        verificarValidade("2026-10-15", "2026-10-11"),
        "Próximo do vencimento"
    );
});

// TESTE 3
test("Produto vencido", () => {
    assert.equal(
        verificarValidade("2026-10-05", "2026-10-11"),
        "Vencido"
    );
});

// TESTE 4
test("Produto vencendo hoje", () => {
    assert.equal(
        calcularDiasRestantes("2026-10-11", "2026-10-11"),
        0
    );
});

// TESTE 5
test("Cálculo de dias restantes", () => {
    assert.equal(
        calcularDiasRestantes("2026-10-16", "2026-10-11"),
        5
    );
});
