document.addEventListener("DOMContentLoaded", function () {
    var tabelaBody = document.querySelector("#tabela-produtos");
    var botoesAdicionar = document.querySelectorAll(".btn-adicionar-card");
    var notificacaoProduto = document.querySelector("#notificacao-produtos");
    var imagemPadrao = "https://us.maxgaming.com/bilder/artiklar/21321.jpg?m=1648810460";
    var carrinhoVazio = document.querySelector("#carrinho-vazio");
    var cartContent = document.querySelector("#cart-content");
    var btnFinalizar = document.querySelector("#btn-finalizar");

    function criarContainerNotificacao() {
        if (notificacaoProduto) {
            return;
        }

        notificacaoProduto = document.createElement("div");
        notificacaoProduto.id = "notificacao-produtos";
        notificacaoProduto.className = "notificacao escondido";

        var container = document.querySelector("main") || document.body;
        container.insertAdjacentElement("afterbegin", notificacaoProduto);
    }

    function exibirNotificacao(mensagem, tipo) {
        if (!notificacaoProduto) {
            criarContainerNotificacao();
        }

        notificacaoProduto.textContent = mensagem;
        notificacaoProduto.className = "notificacao " + tipo;
        notificacaoProduto.classList.remove("escondido");

        clearTimeout(window.notificacaoTimeout);
        window.notificacaoTimeout = setTimeout(function () {
            notificacaoProduto.classList.add("escondido");
        }, 3200);
    }

    function obterCarrinho() {
        return JSON.parse(localStorage.getItem("carrinhoTechZone")) || [];
    }

    function salvarCarrinho(carrinho) {
        localStorage.setItem("carrinhoTechZone", JSON.stringify(carrinho));
        try {
            window.dispatchEvent(new Event('storage'));
        } catch (e) {
            // fallback: nothing
        }
    }

    function atualizarEstadoCarrinho() {
        var carrinho = obterCarrinho();
        var vazio = carrinho.length === 0;

        if (carrinhoVazio && cartContent) {
            carrinhoVazio.style.display = vazio ? "block" : "none";
            cartContent.style.display = vazio ? "none" : "block";
        }

        if (btnFinalizar) {
            btnFinalizar.disabled = vazio;
            btnFinalizar.title = vazio ? "Adicione produtos ao carrinho para continuar." : "Finalizar compra";
        }
    }

    function atualizarTotalGeral() {
        var carrinho = obterCarrinho();
        var somaGeral = 0;
        var descontoTotal = 0;

        carrinho.forEach(function (item) {
            var preco = parseFloat(item.preco) || 0;
            var qtd = parseInt(item.qtd) || 0;
            var valorTotalItem = preco * qtd;
            somaGeral += valorTotalItem;
        });

        var campoSubtotal = document.querySelector("#subtotal-carrinho");
        var campoFrete = document.querySelector("#frete-carrinho");
        var campoDesconto = document.querySelector("#desconto-carrinho");
        var campoTotalGeral = document.querySelector("#valor-total-carrinho");
        var frete = 0;

        if (campoSubtotal) {
            campoSubtotal.textContent = "R$ " + somaGeral.toFixed(2);
        }
        if (campoFrete) {
            campoFrete.textContent = "R$ " + frete.toFixed(2);
        }
        if (campoDesconto) {
            campoDesconto.textContent = "R$ " + descontoTotal.toFixed(2);
        }
        if (campoTotalGeral) {
            campoTotalGeral.textContent = "R$ " + (somaGeral + frete - descontoTotal).toFixed(2);
        }
    }

    function criarLinhaProduto(item, indice) {
        var produtoTr = document.createElement("tr");
        produtoTr.classList.add("produto");
        produtoTr.dataset.indice = indice;

        var nomeTd = document.createElement("td");
        nomeTd.classList.add("info-produto");
        var produtoInfo = document.createElement("div");
        produtoInfo.classList.add("cart-item-produto");

        var tagImagem = document.createElement("img");
        tagImagem.src = item.foto;
        tagImagem.alt = item.nome;
        tagImagem.onerror = function () {
            tagImagem.src = imagemPadrao;
        };
        tagImagem.classList.add("foto-produto");

        var infoTexto = document.createElement("div");
        infoTexto.classList.add("cart-item-info");
        var nomeTitulo = document.createElement("h4");
        nomeTitulo.textContent = item.nome;
        var descricao = document.createElement("p");
        descricao.textContent = item.categoria ? item.categoria : "Periférico TechZone";
        infoTexto.appendChild(nomeTitulo);
        infoTexto.appendChild(descricao);

        produtoInfo.appendChild(tagImagem);
        produtoInfo.appendChild(infoTexto);
        nomeTd.appendChild(produtoInfo);

        var precoTd = document.createElement("td");
        precoTd.classList.add("info-preco");
        precoTd.textContent = "R$ " + Number(item.preco).toFixed(2);

        var qtdTd = document.createElement("td");
        var quantityControl = document.createElement("div");
        quantityControl.classList.add("quantity-control");

        var btnMenos = document.createElement("button");
        btnMenos.classList.add("quant-menos");
        btnMenos.type = "button";
        btnMenos.textContent = "-";

        var qtdValor = document.createElement("span");
        qtdValor.classList.add("qtd-valor");
        qtdValor.textContent = item.qtd;

        var btnMais = document.createElement("button");
        btnMais.classList.add("quant-mais");
        btnMais.type = "button";
        btnMais.textContent = "+";

        quantityControl.appendChild(btnMenos);
        quantityControl.appendChild(qtdValor);
        quantityControl.appendChild(btnMais);
        qtdTd.appendChild(quantityControl);

        var totalTd = document.createElement("td");
        totalTd.classList.add("info-total");
        totalTd.textContent = "R$ " + (Number(item.preco) * Number(item.qtd)).toFixed(2);

        var acoesTd = document.createElement("td");
        var botaoRemover = document.createElement("button");
        botaoRemover.textContent = "Remover";
        botaoRemover.classList.add("btn-remove-item");
        botaoRemover.type = "button";
        acoesTd.appendChild(botaoRemover);

        produtoTr.appendChild(nomeTd);
        produtoTr.appendChild(precoTd);
        produtoTr.appendChild(qtdTd);
        produtoTr.appendChild(totalTd);
        produtoTr.appendChild(acoesTd);

        return produtoTr;
    }

    function renderizarCarrinho() {
        if (!tabelaBody) {
            return;
        }

        var carrinho = obterCarrinho();
        tabelaBody.innerHTML = "";

        carrinho.forEach(function (item, indice) {
            tabelaBody.appendChild(criarLinhaProduto(item, indice));
        });

        atualizarTotalGeral();
        atualizarEstadoCarrinho();
    }

    function atualizarProdutoQuantidade(indice, delta) {
        var carrinho = obterCarrinho();
        if (!carrinho[indice]) return;

        var novaQtd = carrinho[indice].qtd + delta;
        if (novaQtd < 1) {
            novaQtd = 1;
        }
        if (novaQtd > 4) {
            novaQtd = 4;
        }

        carrinho[indice].qtd = novaQtd;
        salvarCarrinho(carrinho);
        renderizarCarrinho();
    }

    function adicionarAoCarrinho(produto) {
        var carrinho = obterCarrinho();
        var itemExistente = carrinho.find(function (item) {
            return item.nome === produto.nome;
        });

        if (itemExistente) {
            if (itemExistente.qtd + produto.qtd > 4) {
                exibirNotificacao("O limite por produto é de 4 unidades.", "erro");
                return false;
            }

            itemExistente.qtd += produto.qtd;
        } else {
            carrinho.push(produto);
        }

        salvarCarrinho(carrinho);
        return true;
    }

    botoesAdicionar.forEach(function (botao) {
        botao.addEventListener("click", function () {
            var card = botao.closest(".card-produto");
            var inputQtd = card.querySelector(".produto-qtd");
            var qtd = parseInt(inputQtd.value) || 1;

            if (qtd <= 0 || qtd > 4) {
                exibirNotificacao("Escolha uma quantidade entre 1 e 4 unidades.", "erro");
                return;
            }

            var produtoAdicionado = adicionarAoCarrinho({
                nome: card.dataset.nome,
                preco: parseFloat(card.dataset.preco),
                foto: card.dataset.foto,
                qtd: qtd,
                categoria: card.dataset.cat || '',
                desconto: parseFloat(card.dataset.desconto) || 0
            });

            if (produtoAdicionado) {
                inputQtd.value = "1";
                exibirNotificacao("Produto adicionado ao carrinho!", "sucesso");
                renderizarCarrinho();
            }
        });
    });

    if (tabelaBody) {
        tabelaBody.addEventListener("click", function (event) {
            var target = event.target;
            var linhaProduto = target.closest(".produto");
            if (!linhaProduto) return;
            var indice = parseInt(linhaProduto.dataset.indice);

            if (target.classList.contains("btn-remove-item")) {
                var carrinho = obterCarrinho();
                carrinho.splice(indice, 1);
                salvarCarrinho(carrinho);
                renderizarCarrinho();
            }

            if (target.classList.contains("quant-mais")) {
                atualizarProdutoQuantidade(indice, 1);
            }

            if (target.classList.contains("quant-menos")) {
                atualizarProdutoQuantidade(indice, -1);
            }
        });
    }

    renderizarCarrinho();
});
