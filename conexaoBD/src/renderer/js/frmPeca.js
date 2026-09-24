document.querySelector("#formPeca").addEventListener("submit", async (e) => {
    e.preventDefault(); // Evita o piscar da tela

    const dados = Object.fromEntries(new FormData(e.target));
    dados.peso = Number(dados.peso);
    dados.quantidade_material = Number(dados.quantidade_material);
    dados.tempo_impressao = Number(dados.tempo_impressao);
    dados.data_impressao = Number(dados.data_impressao);


    // TODO: implementar cadastro (chamada IPC + INSERT na tabela peca_impressa)
    console.log("Peça a cadastrar:", dados);
});

let modoEdicaoPeca = false;
let idEmEdicaoPeca = null;

// Se o main mandar um peca pra editar, preenche o formulário (send/on)
window.api.aoReceberPecaParaEditar((peca) => {
  document.querySelector('#titulo').value = peca.titulo;
  document.querySelector('#cor').value = peca.cor;
  document.querySelector('#peso').value = peca.peso;
  document.querySelector('#quantidade_material').value = peca.quantidade_material;
  document.querySelector('#tempo_impressao').value = peca.tempo_impressao;
  document.querySelector('#data_impressao').value = peca.data_impressao;

  modoEdicaoPeca = true;
  idEmEdicaoPeca = peca.id;
});

document.querySelector('#formPeca').addEventListener('submit', async (evento) => {
  evento.preventDefault();
  const dados = Object.fromEntries(new FormData(evento.target));

  if (modoEdicaoPeca) {
    await window.api.atualizarPeca({ id: idEmEdicaoPeca, ...dados });
  } else {
    await window.api.criarPeca(dados);
  }

  window.close();
});