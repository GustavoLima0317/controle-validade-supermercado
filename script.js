// Sistema de Controle de Validade - Supermercado Iguatemi

const CHAVE_ESTOQUE = "produtosSupermercado";

function carregarProdutos() {
    try {
        const dados = JSON.parse(localStorage.getItem(CHAVE_ESTOQUE));
        return Array.isArray(dados) ? dados : [];
    } catch {
        return [];
    }
}

let produtos = carregarProdutos();

// Cadastro de produtos
function cadastrarProduto(nome, categoria, quantidade, lote, validade) {
    if (!nome || !categoria || !lote || !validade ||
        !Number.isInteger(Number(quantidade)) ||
        Number(quantidade) <= 0) {
        return false;
    }

    const data = new Date(validade + "T00:00:00");

    if (Number.isNaN(data.getTime())) {
        return false;
    }

    const produto = {
        id: Date.now().toString() + Math.random().toString(36).slice(2),
        nome: nome.trim(),
        categoria: categoria.trim(),
        quantidade: Number(quantidade),
        lote: lote.trim(),
        validade: validade
    };

    produtos.push(produto);
    salvarProdutos();
    return true;
}

// Armazenamento local
function salvarProdutos() {
    localStorage.setItem(CHAVE_ESTOQUE, JSON.stringify(produtos));
}

// Cálculo de dias restantes
function calcularDiasRestantes(validade) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const vencimento = new Date(validade + "T00:00:00");

    return Math.round(
        (vencimento - hoje) / (1000 * 60 * 60 * 24)
    );
}

// Classificação dos alertas
function verificarValidade(validade) {
    const dias = calcularDiasRestantes(validade);

    if (dias < 0) {
        return "Vencido";
    }

    if (dias <= 7) {
        return "Próximo do vencimento";
    }

    return "Dentro do prazo";
}

// Exclusão de produtos
function excluirProduto(id) {
    produtos = produtos.filter(produto => produto.id !== id);
    salvarProdutos();
}

// Consulta dos produtos cadastrados
function listarProdutos() {
    return produtos.map(produto => ({
        ...produto,
        situacao: verificarValidade(produto.validade)
    }));
}
