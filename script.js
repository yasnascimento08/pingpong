const config = {
    'velocidade': 3,
    'raqueteWid': 15,
    'raqueteHei': 70,
    'valendo': false,
    'velocidadeBola': 4,
    'direcaoInicial': 1,
    'vencedor': 0,
    'pontuacaoLimite': 15
};

let teclasPressionadas = {};

jogador1 = {
    'x': 0,
    'y': 200 - (config.raqueteHei/2),
    atualizar: () => {
        if (teclasPressionadas['w']) {
            if (jogador1.y > 0 ) {
                jogador1.y -= config.velocidade;
            }
        }
        if (teclasPressionadas['s']) {
            if (jogador1.y < 400 - config.raqueteHei) {
                jogador1.y += config.velocidade;
            }
        }
    },
    desenhar: (ctx) => {
        ctx.fillStyle = 'purple';
        ctx.fillRect(jogador1.x, jogador1.y, config.raqueteWid, config.raqueteHei);
    }
};

jogador2 = {
    'x': 800 - config.raqueteWid,
    'y': 200 - (config.raqueteHei/2),
    atualizar: () => {
        if (teclasPressionadas['ArrowUp']) {
            if (jogador2.y > 0 ) {
                jogador2.y -= config.velocidade;
            }
        }
        if (teclasPressionadas['ArrowDown']) {
            if (jogador2.y < 400 - config.raqueteHei) {
                jogador2.y += config.velocidade;
            }
        }
    },
    desenhar: (ctx) => {
        ctx.fillStyle = 'purple';
        ctx.fillRect(jogador2.x, jogador2.y, config.raqueteWid, config.raqueteHei);
    }
};

bola = {
    'x': 400,
    'y': 200,
    vetorX: config.direcaoInicial == 1 ? config.velocidadeBola : -(config.velocidadeBola),
    vetorY: config.velocidadeBola,
    atualizar: () => {
        if (config.valendo) {
            if ((bola.x == jogador1.x + config.raqueteWid + 13) && (bola.y >= jogador1.y && bola.y <= jogador1.y + config.raqueteHei)) {
                bola.vetorX = -(bola.vetorX);
            }
            if ((bola.x == jogador2.x - 13) && (bola.y >= jogador2.y && bola.y <= jogador2.y + config.raqueteHei)) {
                bola.vetorX = -(bola.vetorX);
            }
            if (bola.x == jogador1.x) {
                config.valendo = false;
                if (!verificaSeAtingiuPontuacao(2)) {
                    setTimeout(() => {  pontoMarcado('1'); }, 1500);
                }
            }
            if (bola.x == jogador2.x + config.raqueteWid) {
                config.valendo = false;
                if (!verificaSeAtingiuPontuacao(1)) {
                    setTimeout(() => {  pontoMarcado('2'); }, 1500);
                }
            }
            if (bola.y == 0) {
                bola.vetorY = -(bola.vetorY);
            }
            if (bola.y == 400) {
                bola.vetorY = -(bola.vetorY);
            }
            bola.x += -(bola.vetorX);
            bola.y += -(bola.vetorY);
        }
    },
    desenhar: (ctx) => {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(bola.x, bola.y, 10, 0, Math.PI + (Math.PI * 2) / 2, true);
        ctx.fill();
    }
};

function pontoMarcado(jogador) {
    if (jogador == '1') {
        bola.x = 400;
        $('#pontos2').text(parseInt($('#pontos2').text()) + 1);
        defineDirecao();
        bola.vetorX = config.direcaoInicial == 1 ? config.velocidadeBola : -(config.velocidadeBola);
        config.valendo = true;
    } else {
        bola.x = 400;
        $('#pontos1').text(parseInt($('#pontos1').text()) + 1);
        defineDirecao();
        bola.vetorX = config.direcaoInicial == 1 ? config.velocidadeBola : -(config.velocidadeBola);
        config.valendo = true;
    }
}

function escutarTeclado() {
    document.addEventListener("keyup", teclaSolta.bind(this));
    document.addEventListener("keydown", teclaPresionada.bind(this));
};

function teclaSolta(e) {
    teclasPressionadas[e.key] = false;
};

function teclaPresionada(e) {
    teclasPressionadas[e.key] = true;
};

function verificaSeAtingiuPontuacao(jogador) {
    if (jogador == 1) {
        if (parseInt($('#pontos1').text()) + 1 == config.pontuacaoLimite) {
            config.vencedor = 1;
            $('.placar-container').addClass('hide');
            $('.vencedor-container').addClass('flex');
            $('#vencedor').text('Jogador 1');
            $('#btn-iniciar').text('Reniciar jogo')
            return true
        }
    }
    if (jogador == 2) {
        if (parseInt($('#pontos2').text()) + 1 == config.pontuacaoLimite) {
            config.vencedor = 2;
            $('.placar-container').addClass('hide');
            $('.vencedor-container').addClass('flex');
            $('#vencedor').text('Jogador 2');
            $('#btn-iniciar').text('Reniciar jogo')
            return true;
        }
    }
    
    return false;
}

function atualizar() {
    if (config.vencedor == 0) {
        desenharArena(jogador1, jogador2, bola);
        escutarTeclado();
        jogador1.atualizar();
        jogador2.atualizar();
        bola.atualizar()
        requestAnimationFrame(atualizar);
    }
};

function desenharArena(jogador1,jogador2, bola) {
    const canvas = document.getElementById("arena");
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, 800, 400);
    
    jogador1.desenhar(ctx);
    jogador2.desenhar(ctx);

    bola.desenhar(ctx);
}

function defineDirecao() {
    let n = Math.floor(Math.random() * 11);
    if (n < 5) {
        config.direcaoInicial = -1;
    }  else{
        config.direcaoInicial = 1;
    }
}

function iniciar() {
    if (config.vencedor == 0) {
        if (config.valendo) {
            config.valendo = false;
            $('#btn-iniciar').text('Iniciar jogo')
        } else {
            config.valendo = true;
            $('#btn-iniciar').text('Pausar')
        }
    } else {
        $('.vencedor-container').toggleClass('flex');
        $('.placar-container').toggleClass('hide');

        $('#pontos1').text('0');
        $('#pontos2').text('0');

        jogador1.y = 200 - (config.raqueteHei/2);
        jogador2.y = 200 - (config.raqueteHei/2);
        bola.x = 400;
        bola.y = 200;

        config.vencedor = 0;
        config.valendo = true;
        $('#btn-iniciar').text('Pausar');

        atualizar();
    }
    
}
    
    
