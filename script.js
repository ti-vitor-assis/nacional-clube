// Fecha o menu do celular ao clicar em um link
$(function () {
    $('#menuPrincipal a').on('click', function () {
        $('#menuPrincipal').collapse('hide');
    });
});

// Aviso de frete grátis: aparece depois de 1,5s e, se fechar, não volta até fechar a aba
$(function () {
    var $aviso = $('#avisoFrete');
    var CHAVE = 'avisoFreteFechado';
    var fechado = false;

    try {
        fechado = sessionStorage.getItem(CHAVE) === '1';
    } catch (e) { }

    if (fechado) return;

    setTimeout(function () {
        $aviso.prop('hidden', false);
        // espera um quadro pra animação de entrada funcionar
        requestAnimationFrame(function () {
            $aviso.addClass('visivel');
        });
    }, 1500);

    $aviso.find('.aviso-fechar').on('click', function () {
        $aviso.removeClass('visivel');
        setTimeout(function () {
            $aviso.prop('hidden', true);
        }, 300);
        try {
            sessionStorage.setItem(CHAVE, '1');
        } catch (e) { }
    });
});

// ==================== WHATSAPP ====================
// Número num lugar só. Todo link com a classe .js-zap ganha a mensagem do data-msg já escrita.
var ZAP_NUMERO = '5511947084137';

$(function () {
    $('.js-zap').each(function () {
        var msg = $(this).attr('data-msg');
        var link = 'https://wa.me/' + ZAP_NUMERO;
        if (msg) link += '?text=' + encodeURIComponent(msg);
        $(this).attr('href', link);
    });
});

// ==================== CONTAGEM REGRESSIVA: DROP 02 ====================
// A data fica no data-alvo da #contagem no HTML
$(function () {
    var $contagem = $('#contagem');
    if (!$contagem.length) return;

    var alvo = new Date($contagem.attr('data-alvo')).getTime();
    if (isNaN(alvo)) return;

    // Botão "Salvar na agenda": abre o Google Agenda já com o evento preenchido (1h de duração)
    function formatoAgenda(ms) {
        // 2027-02-03T22:00:00.000Z -> 20270203T220000Z
        return new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    }
    $('#dropAgenda').attr('href',
        'https://calendar.google.com/calendar/render?action=TEMPLATE' +
        '&text=' + encodeURIComponent('Drop 02 • Nacional Clube') +
        '&dates=' + formatoAgenda(alvo) + '/' + formatoAgenda(alvo + 60 * 60 * 1000) +
        '&details=' + encodeURIComponent('Lançamento do Drop 02 da Nacional Clube. https://ti-vitor-assis.github.io/nacional-clube/'));

    var $num = {
        dias: $contagem.find('[data-unidade="dias"]'),
        horas: $contagem.find('[data-unidade="horas"]'),
        min: $contagem.find('[data-unidade="min"]'),
        seg: $contagem.find('[data-unidade="seg"]')
    };

    function doisDigitos(n) {
        return n < 10 ? '0' + n : String(n);
    }

    var relogio;

    function atualiza() {
        var falta = alvo - Date.now();

        // Chegou a hora: zera tudo e muda o título
        if (falta <= 0) {
            clearInterval(relogio);
            $num.dias.text('00'); $num.horas.text('00'); $num.min.text('00'); $num.seg.text('00');
            $('#dropTitulo').text('O Drop 02 chegou!');
            return;
        }

        var s = Math.floor(falta / 1000);
        $num.dias.text(doisDigitos(Math.floor(s / 86400)));
        $num.horas.text(doisDigitos(Math.floor(s % 86400 / 3600)));
        $num.min.text(doisDigitos(Math.floor(s % 3600 / 60)));
        $num.seg.text(doisDigitos(s % 60));
    }

    atualiza();
    relogio = setInterval(atualiza, 1000);
});

// ==================== ANIMAÇÃO AO ROLAR ====================
// Cada .revelar aparece quando entra na tela (uma vez só)
$(function () {
    var itens = document.querySelectorAll('.revelar');

    // Navegador antigo: mostra tudo direto
    if (!('IntersectionObserver' in window)) {
        $(itens).addClass('visivel');
        return;
    }

    var observador = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('visivel');
                observador.unobserve(entrada.target);
            }
        });
    }, { threshold: 0.15 });

    itens.forEach(function (item) {
        observador.observe(item);
    });
});
