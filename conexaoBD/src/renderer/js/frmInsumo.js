let modoEdicao = false;
let idEmEdicao = null;

// Se o main mandar um insumo pra editar, preenche o formulário (send/on)
window.api.aoReceberInsumoParaEditar((insumo) => {
  document.querySelector('#tipo').value = insumo.tipo;
  document.querySelector('#nome').value = insumo.nome;
  document.querySelector('#valor').value = insumo.valor;
  document.querySelector('#data_aquisicao').value = insumo.data_aquisicao;

  modoEdicao = true;
  idEmEdicao = insumo.id;
});

document.querySelector('#formInsumo').addEventListener('submit', async (evento) => {
  evento.preventDefault();
  const dados = Object.fromEntries(new FormData(evento.target));

  if (modoEdicao) {
    await window.api.atualizarInsumo({ id: idEmEdicao, ...dados });
  } else {
    await window.api.criarInsumo(dados);
  }

  window.close(); // fecha o modal; frmPrincipal recarrega quando o foco voltar
});