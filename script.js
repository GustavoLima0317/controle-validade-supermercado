// Sistema de Controle de Validade - Supermercado Iguatemi

const CHAVE_ESTOQUE = "produtosSupermercado";
const CHAVE_CONTRASTE = "altoContraste";

// Carregamento dos produtos armazenados
function carregarProdutos() {
    if (typeof localStorage === "undefined") {
        return [];
    }

    try {
        const dados = JSON.parse(localStorage.getItem(CHAVE_ESTOQUE));
        return Array.isArray(dados) ? dados : [];
    } catch {
        return [];
    }
}

// Inicialização dos produtos
let produtos = carregarProdutos();

// Cadastro de produtos
function cadastrarProduto(nome, categoria, quantidade, lote, validade) {
    if (
        !nome || !nome.trim() ||
        !categoria || !categoria.trim() ||
        !lote || !lote.trim() ||
        !validade ||
        !Number.isInteger(Number(quantidade)) ||
        Number(quantidade) <= 0
    ) {
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
    if (typeof localStorage !== "undefined") {
        localStorage.setItem(
            CHAVE_ESTOQUE,
            JSON.stringify(produtos)
        );
    }
}

// Calcula a diferença entre datas em dias de calendário
function calcularDiasRestantes(validade, hoje = new Date()) {

    const dataAtual = typeof hoje === "string"
        ? new Date(hoje + "T00:00:00")
        : hoje;

    const dataAtualUTC = Date.UTC(
        dataAtual.getFullYear(),
        dataAtual.getMonth(),
        dataAtual.getDate()
    );

    const [ano, mes, dia] = validade.split("-").map(Number);

    const vencimentoUTC = Date.UTC(ano, mes - 1, dia);

    return Math.round(
        (vencimentoUTC - dataAtualUTC) / 86400000
    );
}

// Classificação dos alertas
function verificarValidade(validade, hoje = new Date()) {
    const dias = calcularDiasRestantes(validade, hoje);

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
    produtos = produtos.filter(
        produto => produto.id !== id
    );

    salvarProdutos();
}

// Consulta dos produtos cadastrados
function listarProdutos() {
    return produtos.map(produto => ({
        ...produto,
        situacao: verificarValidade(produto.validade)
    }));
}

// Atualização da lista de produtos na interface
function atualizarLista() {

    // Impede erros durante testes no Node.js
    if (typeof document === "undefined") {
        return;
    }

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

        } else if (
            produto.situacao === "Próximo do vencimento"
        ) {
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

        item.append(
            titulo,
            detalhes,
            situacao,
            botao
        );

        lista.appendChild(item);
    });
}

// ==========================================
// RECURSO DE ACESSIBILIDADE
// MODO DE ALTO CONTRASTE
// ==========================================

// Atualiza o texto e o estado do botão
function atualizarBotaoContraste() {

    if (typeof document === "undefined") {
        return;
    }

    const botao = document.getElementById("botaoContraste");

    if (!botao) return;

    const ativado = document.body.classList.contains(
        "alto-contraste"
    );

    botao.textContent = ativado
        ? "Desativar alto contraste"
        : "Ativar alto contraste";

    botao.setAttribute("aria-pressed", String(ativado));
}

// Ativa ou desativa o modo de alto contraste
function alternarContraste() {

    if (typeof document === "undefined") {
        return;
    }

    document.body.classList.toggle("alto-contraste");

    const ativado = document.body.classList.contains(
        "alto-contraste"
    );

    // Salva a preferência do usuário
    if (typeof localStorage !== "undefined") {
        localStorage.setItem(
            CHAVE_CONTRASTE,
            String(ativado)
        );
    }

    atualizarBotaoContraste();
}

// Recupera a preferência de acessibilidade
function carregarPreferenciaContraste() {

    if (typeof document === "undefined") {
        return;
    }

    if (typeof localStorage !== "undefined") {

        const preferencia = localStorage.getItem(
            CHAVE_CONTRASTE
        );

        if (preferencia === "true") {
            document.body.classList.add("alto-contraste");
        }
    }

    atualizarBotaoContraste();
}

// ==========================================
// INICIALIZAÇÃO DO SISTEMA
// ==========================================

// Executa somente quando estiver no navegador
if (typeof document !== "undefined") {

    document.addEventListener("DOMContentLoaded", () => {

        // Inicialização do recurso de acessibilidade
        carregarPreferenciaContraste();

        const botaoContraste = document.getElementById(
            "botaoContraste"
        );

        if (botaoContraste) {
            botaoContraste.addEventListener(
                "click",
                alternarContraste
            );
        }

        // Formulário de cadastro
        const formulario = document.getElementById(
            "formProduto"
        );

        if (formulario) {

            formulario.addEventListener("submit", evento => {

                evento.preventDefault();

                const nome = document.getElementById("nome").value;
                const categoria = document.getElementById("categoria").value;
                const quantidade = document.getElementById("quantidade").value;
                const lote = document.getElementById("lote").value;
                const validade = document.getElementById("validade").value;

                const sucesso = cadastrarProduto(
                    nome,
                    categoria,
                    quantidade,
                    lote,
                    validade
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
}

// ==========================================
// EXPORTAÇÃO PARA TESTES AUTOMATIZADOS
// ==========================================

// Permite executar os testes no Node.js
// sem afetar o funcionamento no navegador

if (typeof module !== "undefined" && module.exports) {

    module.exports = {
        carregarProdutos,
        cadastrarProduto,
        salvarProdutos,
        calcularDiasRestantes,
        verificarValidade,
        excluirProduto,
        listarProdutos,
        atualizarLista,
        alternarContraste,
        carregarPreferenciaContraste,
        atualizarBotaoContraste
    };
}
