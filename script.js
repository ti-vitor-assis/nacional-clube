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
