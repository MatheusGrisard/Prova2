// Executa apenas o cálculo inicial da página
document.addEventListener("DOMContentLoaded", function () {
    var produtos = document.querySelectorAll(".produto");
    var acumuladorGeral = 0;

    for (let i = 0; i < produtos.length; i++) {
        var produto = produtos[i];

        var tdPreco = produto.querySelector(".info-preco");
        var preco = parseFloat(tdPreco.textContent) || 0;

        var tdQtd = produto.querySelector(".info-qtd");
        var qtd = parseInt(tdQtd.textContent) || 0;

        var tdDesconto = produto.querySelector(".info-desconto");
        var desconto = parseFloat(tdDesconto.textContent) || 0;

        var tdTotal = produto.querySelector(".info-total");
        
        // Calcula o total do item
        var valorTotalItem = (preco * qtd) * (1 - (desconto / 100));
        tdTotal.textContent = "R$ " + valorTotalItem.toFixed(2);
        
        acumuladorGeral += valorTotalItem;
    }

    // Atualiza o rodapé inicial
    var campoTotalGeral = document.querySelector("#valor-total-carrinho");
    if (campoTotalGeral) {
        campoTotalGeral.textContent = "R$ " + acumuladorGeral.toFixed(2);
    }
});