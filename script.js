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

        // Atualização da lista de produtos na interface
function atualizarLista() {
    const lista = document.getElementById("listaProdutos");

    if (!lista) return;

    lista.innerHTML = "";

    const cadastrados = listarProdutos();

    if (cadastrados.length === 0) {
        const mensagem = document.createElement("p");
        mensagem.textContent = "Nenhum produto cadastrado.";
        lista.appendChild(mensagem);
        return;
    }

    cadastrados.forEach(produto => {
        const item = document.createElement("div");
        const titulo = document.createElement("h3");
        const detalhes = document.createElement("p");
        const situacao = document.createElement("p");
        const botao = document.createElement("button");

        titulo.textContent = produto.nome;

        const [ano, mes, dia] = produto.validade.split("-");

        detalhes.textContent =
            `Categoria: ${produto.categoria} | ` +
            `Quantidade: ${produto.quantidade} | ` +
            `Lote: ${produto.lote} | ` +
            `Validade: ${dia}/${mes}/${ano}`;

        situacao.textContent = produto.situacao;

        if (produto.situacao === "Vencido") {
            item.className = "alerta-vermelho";
        } else if (produto.situacao === "Próximo do vencimento") {
            item.className = "alerta-amarelo";
        } else {
            item.className = "alerta-verde";
        }

        item.style.padding = "15px";
        item.style.marginBottom = "10px";
        item.style.borderRadius = "5px";

        botao.textContent = "Excluir produto";
        botao.type = "button";

        botao.addEventListener("click", () => {
            excluirProduto(produto.id);
            atualizarLista();
        });

        item.append(titulo, detalhes, situacao, botao);
        lista.appendChild(item);
    });
}

// Conexão do formulário com o cadastro
document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("formProduto");

    if (formulario) {
        formulario.addEventListener("submit", evento => {
            evento.preventDefault();

            const nome = document.getElementById("nome").value;
            const categoria = document.getElementById("categoria").value;
            const quantidade = document.getElementById("quantidade").value;
            const lote = document.getElementById("lote").value;
            const validade = document.getElementById("validade").value;

            const sucesso = cadastrarProduto(
                nome, categoria, quantidade, lote, validade
            );

            if (sucesso) {
                formulario.reset();
                atualizarLista();
                alert("Produto cadastrado com sucesso!");
            } else {
                alert("Verifique os dados informados.");
            }
        });
    }

    atualizarLista();
});
        ...produto,
        situacao: verificarValidade(produto.validade)
    }));
}
