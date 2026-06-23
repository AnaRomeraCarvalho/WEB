/**
 * script.js — Quadra Sportwear
 *
 * Funcionalidades implementadas:
 *   Opção 1 — Validação do formulário de contato
 *   Opção 4 — Contador de caracteres no textarea
 *   Opção 5 — Botão "Voltar ao Topo"
 *
 * Dependência: jQuery 3.7+ (carregado antes deste arquivo no HTML)
 */

/* ============================================================
   $(document).ready()
   Executa TUDO só depois que o HTML foi completamente lido
   pelo navegador. Sem isso, o jQuery tentaria selecionar
   elementos que ainda não existem no DOM.
   ============================================================ */
$(document).ready(function () {


  /* ----------------------------------------------------------
     OPÇÃO 5 — BOTÃO VOLTAR AO TOPO
     Aparece quando o usuário rola mais de 300px para baixo.
     Ao clicar, anima a página de volta ao topo suavemente.
     ---------------------------------------------------------- */

  const $btnTopo = $('#btn-topo');
  // $btnTopo → jQuery wraps the element, giving us .show()/.hide()/.click() etc.
  // Prefixo $ na variável é convenção: "essa variável guarda um objeto jQuery".

  /* Evento 'scroll' — dispara toda vez que o usuário rola a janela */
  $(window).on('scroll', function () {
    if ($(this).scrollTop() > 300) {
      // scrollTop() → quantos pixels o usuário rolou a partir do topo.
      $btnTopo.removeAttr('hidden');
      // Remove o atributo hidden do HTML, tornando o botão visível.
      // Usamos removeAttr('hidden') ao invés de .show() para manter
      // consistência com o atributo hidden do HTML5.
    } else {
      $btnTopo.attr('hidden', true);
      // Devolve o hidden, escondendo o botão quando volta ao topo.
    }
  });

  /* Clique no botão: anima o scroll suavemente até o topo */
  $btnTopo.on('click', function () {
    $('html, body').animate({ scrollTop: 0 }, 500);
    // .animate() → jQuery anima a propriedade scrollTop de qualquer valor
    // até 0 em 500 milissegundos (meio segundo), criando a rolagem suave.
    // Selecionamos 'html, body' para compatibilidade com diferentes navegadores:
    // alguns usam <html> como elemento de scroll, outros usam <body>.
  });


  /* ----------------------------------------------------------
     OPÇÃO 4 — CONTADOR DE CARACTERES NO TEXTAREA
     Atualiza em tempo real conforme o usuário digita.
     Muda de cor quando se aproxima do limite (500).
     ---------------------------------------------------------- */

  const $textarea     = $('#mensagem');
  const $charsUsados  = $('#chars-usados');
  // Armazenamos a referência jQuery em variável para não re-buscar no DOM
  // a cada evento (melhor performance).

  /* Evento 'input' — dispara para CADA tecla digitada/colada/apagada */
  $textarea.on('input', function () {
    const total  = 500;                   // limite máximo definido no maxlength do HTML
    const usados = $(this).val().length;  // val() retorna o texto atual; .length = nº de chars

    $charsUsados.text(usados);
    // .text(valor) → atualiza o conteúdo de texto do elemento com o novo número.

    /* Muda o estilo visual conforme a proximidade do limite */
    const $contador = $('#contador');
    $contador.removeClass('contador-ok contador-aviso contador-limite');
    // Remove todas as classes de estado anteriores antes de adicionar a nova,
    // evitando acúmulo de classes conflitantes.

    if (usados >= total) {
      $contador.addClass('contador-limite'); // vermelho: limite atingido
    } else if (usados >= total * 0.85) {
      $contador.addClass('contador-aviso');  // laranja/coral: 85%+ usados
    } else {
      $contador.addClass('contador-ok');     // padrão: tudo bem
    }
  });


  /* ----------------------------------------------------------
     OPÇÃO 1 — VALIDAÇÃO DO FORMULÁRIO
     Valida ao clicar em "Enviar". Exibe mensagens de erro
     ao lado de cada campo inválido. Só "envia" se tudo ok.
     ---------------------------------------------------------- */

  $('#form-contato').on('submit', function (e) {
    e.preventDefault();
    // e.preventDefault() → IMPEDE o comportamento padrão do formulário,
    // que seria recarregar a página ou navegar para o action="" do form.
    // Com isso, o JavaScript assume o controle total do submit.

    let formularioValido = true;
    // Flag de controle. Se qualquer campo falhar, vira false e o "envio" é bloqueado.

    /* Limpa todos os erros anteriores antes de revalidar */
    limparTodosOsErros();

    /* ---- Validação individual de cada campo ---- */

    // 1. NOME — obrigatório, mínimo 3 caracteres
    const nome = $('#nome').val().trim();
    // .val() → valor do input. .trim() → remove espaços do início/fim.
    if (nome === '') {
      mostrarErro('nome', 'Por favor, informe seu nome.');
      formularioValido = false;
    } else if (nome.length < 3) {
      mostrarErro('nome', 'O nome deve ter pelo menos 3 caracteres.');
      formularioValido = false;
    }

    // 2. E-MAIL — obrigatório + formato válido
    const email = $('#email').val().trim();
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Expressão regular (RegEx) para validar o formato básico de e-mail:
    // ^[^\s@]+  → começa com um ou mais chars que NÃO sejam espaço ou @
    // @         → deve ter exatamente um @
    // [^\s@]+   → domínio: um ou mais chars sem espaço/@
    // \.        → ponto literal (escapado com \)
    // [^\s@]+$  → extensão: um ou mais chars sem espaço/@ até o final
    if (email === '') {
      mostrarErro('email', 'Por favor, informe seu e-mail.');
      formularioValido = false;
    } else if (!regexEmail.test(email)) {
      mostrarErro('email', 'Informe um e-mail válido. Ex.: nome@email.com');
      formularioValido = false;
    }

    // 3. ASSUNTO — obrigatório (não pode ser o valor vazio "")
    const assunto = $('#assunto').val();
    if (!assunto) {
      mostrarErro('assunto', 'Selecione um assunto para continuar.');
      formularioValido = false;
    }

    // 4. MENSAGEM — obrigatória, mínimo 10 caracteres
    const mensagem = $('#mensagem').val().trim();
    if (mensagem === '') {
      mostrarErro('mensagem', 'Por favor, escreva sua mensagem.');
      formularioValido = false;
    } else if (mensagem.length < 10) {
      mostrarErro('mensagem', 'A mensagem deve ter pelo menos 10 caracteres.');
      formularioValido = false;
    }

    // 5. ACEITE — checkbox deve estar marcado
    if (!$('#aceite').is(':checked')) {
      // .is(':checked') → retorna true se o checkbox estiver marcado.
      // O ! inverte: entra no if quando NÃO está marcado.
      mostrarErro('aceite', 'É necessário aceitar para enviar a mensagem.');
      formularioValido = false;
    }

    /* ---- Se passou em todas as validações ---- */
    if (formularioValido) {
      simularEnvio();
    } else {
      /* Foca no primeiro campo com erro para acessibilidade */
      focarPrimeiroErro();
    }
  });


  /* ----------------------------------------------------------
     FUNÇÕES AUXILIARES
     Separadas do fluxo principal para deixar o código mais
     organizado e legível (princípio de responsabilidade única).
     ---------------------------------------------------------- */

  /**
   * mostrarErro(campo, mensagem)
   * Adiciona a classe de erro ao input/select/textarea e
   * preenche o span de erro com a mensagem.
   */
  function mostrarErro(campo, mensagem) {
    $('#' + campo).addClass('input-erro');
    // .addClass() → adiciona classe CSS sem remover as existentes.
    // Usamos o id do campo para montar o seletor dinamicamente.

    $('#erro-' + campo).text(mensagem);
    // O span de erro de cada campo tem id="erro-{campo}".
    // .text() preenche o conteúdo de texto do span.
  }

  /**
   * limparTodosOsErros()
   * Remove classes e textos de erro de todos os campos.
   * Chamado no início de cada submit para "zerar" o estado.
   */
  function limparTodosOsErros() {
    $('.input-erro').removeClass('input-erro');
    // Seleciona TODOS os elementos com classe input-erro e remove a classe.

    $('.erro-msg').text('');
    // Limpa o texto de todas as mensagens de erro visíveis.
  }

  /**
   * focarPrimeiroErro()
   * Rola a página até o primeiro campo com erro e o foca.
   * Melhora muito a experiência do usuário, principalmente no mobile.
   */
  function focarPrimeiroErro() {
    const $primeiroErro = $('.input-erro').first();
    // .first() → pega apenas o primeiro elemento que corresponde ao seletor.

    if ($primeiroErro.length) {
      // .length > 0 significa que encontrou algum elemento.
      $('html, body').animate(
        { scrollTop: $primeiroErro.offset().top - 120 },
        400
        // .offset().top → posição do elemento em relação ao topo do documento.
        // Subtraímos 120px para que o campo apareça um pouco abaixo do header fixo.
      );
      $primeiroErro.focus();
      // .focus() → posiciona o cursor (e o foco de acessibilidade) no campo.
    }
  }

  /**
   * simularEnvio()
   * Em um projeto real, aqui seria feita a requisição AJAX para o backend.
   * Por ora, apenas mostra o estado de loading no botão e depois exibe
   * a mensagem de sucesso (simulando a resposta do servidor).
   */
  function simularEnvio() {
    const $btn = $('#btn-enviar');

    /* Estado de carregamento */
    $btn.prop('disabled', true).text('Enviando...');
    // .prop('disabled', true) → desabilita o botão para evitar duplo clique.
    // .text() → muda o texto do botão enquanto "processa".

    /* Simula tempo de resposta do servidor (1.5 segundos) */
    setTimeout(function () {
      // setTimeout(fn, ms) → função nativa do JavaScript (não jQuery).
      // Executa fn após ms milissegundos. Simula a espera de uma requisição real.

      /* Esconde o formulário */
      $('#form-contato').hide();
      // .hide() → equivale a aplicar display: none via JavaScript.

      /* Exibe a mensagem de sucesso */
      $('#form-sucesso').removeAttr('hidden');
      // Remove o atributo hidden para tornar o elemento visível.

      /* Rola suavemente até a mensagem de sucesso */
      $('html, body').animate(
        { scrollTop: $('#form-sucesso').offset().top - 120 },
        400
      );

    }, 1500);
  }


  /* ----------------------------------------------------------
     VALIDAÇÃO EM TEMPO REAL (feedback imediato ao sair do campo)
     Melhora a UX: o usuário não precisa esperar o submit para
     saber se preencheu um campo corretamente.
     ---------------------------------------------------------- */

  /* Evento 'blur' → dispara quando o campo PERDE o foco (usuário clica em outro lugar) */
  $('#nome').on('blur', function () {
    const val = $(this).val().trim();
    $('#erro-nome').text('');
    $(this).removeClass('input-erro');
    if (val !== '' && val.length < 3) {
      mostrarErro('nome', 'O nome deve ter pelo menos 3 caracteres.');
    }
  });

  $('#email').on('blur', function () {
    const val = $(this).val().trim();
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    $('#erro-email').text('');
    $(this).removeClass('input-erro');
    if (val !== '' && !regexEmail.test(val)) {
      mostrarErro('email', 'Informe um e-mail válido. Ex.: nome@email.com');
    }
  });

  /* Quando o usuário começa a digitar num campo com erro, limpa o erro daquele campo */
  $('input, select, textarea').on('input change', function () {
    if ($(this).hasClass('input-erro')) {
      // Só age se o campo já tinha um erro marcado.
      $(this).removeClass('input-erro');
      $('#erro-' + $(this).attr('id')).text('');
      // attr('id') → lê o atributo id do elemento para montar o seletor do span de erro.
    }
  });

}); // fim de $(document).ready()