const test = require("node:test");
const assert = require("node:assert/strict");

// Calcula os dias restantes utilizando datas em UTC
function calcularDiasRestantes(validade, hoje) {
    const dataAtual = new Date(hoje + "T00:00:00Z");
    const dataValidade = new Date(validade + "T00:00:00Z");

    return Math.round(
        (dataValidade - dataAtual) / (1000 * 60 * 60 * 24)
    );
}

// Classifica a situação do produto
function verificarValidade(validade, hoje) {
    const dias = calcularDiasRestantes(validade, hoje);

    if (dias < 0) {
        return "Vencido";
    }

    if (dias <= 7) {
        return "Próximo do vencimento";
    }

    return "Dentro do prazo";
}

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
