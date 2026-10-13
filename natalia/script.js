function entrarPadaria() {
  window.location.href = "padaria.html";
}

function fecharCaixa() {
  document.getElementById("caixa-texto").hidden = true;
  const confetes = document.getElementById("confetes-festa");
  confetes.hidden = true;
  confetes.replaceChildren();
  document.getElementById("porta-secreta").hidden = false;
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.classList.contains("entrada")) {
    const placa = document.querySelector(".placa-aberta");
    const cordinhas = document.querySelectorAll(".cordinha-placa");
    const imagem = new Image();
    imagem.src = "imagem1.jpg";

    function posicionarPlaca() {
      if (!imagem.complete || !imagem.naturalWidth || !imagem.naturalHeight) {
        return;
      }

      const larguraCena = document.documentElement.clientWidth;
      const alturaCena = document.documentElement.clientHeight;
      const escala = Math.max(
        larguraCena / imagem.naturalWidth,
        alturaCena / imagem.naturalHeight
      );
      const larguraImagem = imagem.naturalWidth * escala;
      const alturaImagem = imagem.naturalHeight * escala;
      const alinhamentoHorizontal = window.matchMedia("(max-width: 600px)").matches ? 0.64 : 0.5;
      const alinhamentoVertical = 0.5;
      const centroX = (larguraCena - larguraImagem) * alinhamentoHorizontal + 760 * escala;
      const centroY = (alturaCena - alturaImagem) * alinhamentoVertical + 190 * escala;
      const larguraPlaca = 210 * escala;
      const alturaPlaca = 72 * escala;

      placa.style.left = `${centroX}px`;
      placa.style.top = `${centroY}px`;
      placa.style.width = `${larguraPlaca}px`;
      placa.style.height = `${alturaPlaca}px`;
      cordinhas.forEach((cordinha, index) => {
        const deslocamento = larguraPlaca * 0.34;
        cordinha.style.left = `${centroX + (index === 0 ? -deslocamento : deslocamento)}px`;
        cordinha.style.height = `${Math.max(0, centroY - alturaPlaca / 2)}px`;
      });
    }

    imagem.addEventListener("load", posicionarPlaca);
    window.addEventListener("resize", posicionarPlaca);
    posicionarPlaca();
  }

  if (document.body.classList.contains("padaria")) {
    const cena = document.querySelector(".cena-padaria");
    const imagem = document.querySelector(".imagem-padaria");
    const porta = document.getElementById("porta-secreta");
    const confetes = document.getElementById("confetes-festa");
    const coresConfete = ["#ff4f87", "#ffd447", "#43d9a3", "#5bbcff", "#bb78ff", "#ff8b42"];

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      confetes.hidden = false;

      for (let index = 0; index < 28; index++) {
        const particula = document.createElement("span");
        const ladoEsquerdo = index % 2 === 0;
        particula.className = "confete";
        particula.style.setProperty(
          "--confete-x",
          `${ladoEsquerdo ? Math.random() * 14 : 86 + Math.random() * 14}%`
        );
        particula.style.setProperty("--confete-tamanho", `${6 + Math.random() * 7}px`);
        particula.style.setProperty("--confete-cor", coresConfete[index % coresConfete.length]);
        particula.style.setProperty("--confete-duracao", `${2 + Math.random() * 0.8}s`);
        particula.style.setProperty("--confete-atraso", `${Math.random() * 0.45}s`);
        particula.style.setProperty("--confete-deriva", `${-45 + Math.random() * 90}px`);
        particula.addEventListener("animationend", () => {
          particula.remove();
          if (!confetes.childElementCount) {
            confetes.hidden = true;
          }
        });
        confetes.append(particula);
      }
    }

    function posicionarPorta() {
      if (!imagem.complete || !imagem.naturalWidth || !imagem.naturalHeight) {
        return;
      }

      const larguraCena = cena.clientWidth;
      const alturaCena = cena.clientHeight;
      const escala = Math.max(
        larguraCena / imagem.naturalWidth,
        alturaCena / imagem.naturalHeight
      );
      const larguraImagem = imagem.naturalWidth * escala;
      const alturaImagem = imagem.naturalHeight * escala;
      const alinhamentoHorizontal = window.matchMedia("(max-width: 600px)").matches ? 1 : 0.5;

      porta.style.left = `${(larguraCena - larguraImagem) * alinhamentoHorizontal + 1216 * escala}px`;
      porta.style.top = `${(alturaCena - alturaImagem) * 0.5 + 233 * escala}px`;
      porta.style.width = `${206 * escala}px`;
      porta.style.height = `${511 * escala}px`;
    }

    imagem.addEventListener("load", posicionarPorta);
    window.addEventListener("resize", posicionarPorta);
    posicionarPorta();
  }

  if (document.body.classList.contains("segredo")) {
    const texto = `Desculpe por dar parabéns atrasado e por ser uma pessoa tão problemática.
Justificar os atos do vilão pela história trágica não é o certo.
Não sou completamente um vilão; estou mais para um anti-herói. Porém, ainda sou uma maçã meio podre, que pode empodrecer as outras. É melhor manter distância, como achar uma goiaba muito linda no pé, mas, ao morder, ver que o interior está podre.
Não concordo 100% que eu te procure só para desabafar. Converso sobre tantas coisas, como quando mandava vídeos aleatórios, fofocava, falava sobre teorias da conspiração, coisas que queria comprar ou fazer, cotil, conquistas, entre outras coisas.
Sei que cansa ouvir a pessoa reclamar de uma coisa e que acaba puxando toda a bagagem suja junto.
Por isso, não lhe culpo pelas palavras duras e pelos pensamentos que ainda não me falou.
Também te aconselho a não se aproximar. Afinal, não é porque algo te fez bem um dia que vai continuar te fazendo bem hoje. E, para que isso ocorra, não precisa retornar uma mensagem agradecendo pelo site, pelo feliz aniversário, pela amizade e etc.; eu já sei que você é grata por muita coisa.
Sou grata a ti, Natália, pelos momentos bons que tivemos. Fique bem. ♡`;

    const elementoTexto = document.getElementById("texto-maquina");
    const prefereMovimentoReduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefereMovimentoReduzido) {
      elementoTexto.textContent = texto;
      return;
    }

    let i = 0;
    function escrever() {
      if (i < texto.length) {
        elementoTexto.textContent += texto.charAt(i);
        i++;
        setTimeout(escrever, 25);
      }
    }
    escrever();
  }
});
