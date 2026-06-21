document.addEventListener("DOMContentLoaded", function () {
    var formContato = document.querySelector("#form-contato");
    var campoNome = document.querySelector("#contato-nome");
    var campoEmail = document.querySelector("#contato-email");
    var campoMensagem = document.querySelector("#contato-msg");
    var erroNome = document.querySelector("#erro-nome");
    var erroEmail = document.querySelector("#erro-email");
    var erroMsg = document.querySelector("#erro-msg");
    var statusBox = document.querySelector("#form-status");

    function limparErros() {
        [erroNome, erroEmail, erroMsg].forEach(function (el) {
            if (el) el.textContent = "";
        });
    }

    function exibirStatus(mensagem) {
        if (!statusBox) return;
        statusBox.textContent = mensagem;
        statusBox.classList.remove("escondido");
    }

    function validarEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    if (formContato) {
        formContato.addEventListener("submit", function (event) {
            event.preventDefault();
            limparErros();

            var valido = true;

            if (!campoNome || !campoNome.value.trim()) {
                if (erroNome) erroNome.textContent = "Por favor, informe seu nome.";
                valido = false;
            }

            if (!campoEmail || !campoEmail.value.trim()) {
                if (erroEmail) erroEmail.textContent = "Por favor, informe seu e-mail.";
                valido = false;
            } else if (!validarEmail(campoEmail.value.trim())) {
                if (erroEmail) erroEmail.textContent = "Informe um e-mail válido.";
                valido = false;
            }

            if (!campoMensagem || !campoMensagem.value.trim()) {
                if (erroMsg) erroMsg.textContent = "Por favor, escreva sua mensagem.";
                valido = false;
            }

            if (!valido) return;

            // sucesso
            exibirStatus("Mensagem enviada com sucesso!");
            formContato.reset();
        });
    }
});