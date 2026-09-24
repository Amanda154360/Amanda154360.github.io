let insumosCarregados = []; // guardamos a lista pra achar o insumo certo depois

let idParaExcluir = null;

const formatarMoeda = (valor) => `R$ ${Number(valor).toFixed(2)}`;

const formatarData = (data) => {
    const d = new Date(data);
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    return `${dia}/${mes}/${d.getFullYear()}`;
};

// o botao Excluir do lado do Editar, na mesma celula de Acoes
const carregarInsumos = async () => {
  insumosCarregados = await window.api.listarInsumos();

  const linhas = insumosCarregados.map((insumo) => `
    <tr>
      <td>${insumo.tipo}</td>
      <td>${insumo.nome}</td>
      <td>${formatarMoeda(insumo.valor)}</td>
      <td>${formatarData(insumo.data_aquisicao)}</td>
      <td>
        <button class="btn btn-sm btn-primary" onclick="editarInsumo(${insumo.id})">Editar</button>
        <button class="btn btn-sm btn-danger" onclick="abrirConfirmacaoExclusao(${insumo.id})">Excluir</button>
      </td>
    </tr>
  `).join('');

  document.querySelector('#tbodyInsumos').innerHTML = linhas;
};

const editarInsumo = (id) => {
  const insumo = insumosCarregados.find((i) => i.id === id);
  window.api.editarInsumo(insumo);
};


const abrirConfirmacaoExclusao = (id) => {
  const insumo = insumosCarregados.find((item) => item.id === id);

  document.getElementById('nomeInsumoExcluir').textContent = insumo.nome;
  idParaExcluir = id;

  const modal = new bootstrap.Modal(
    document.getElementById('modalConfirmarExclusao')
  );
  modal.show();
};


document.querySelector('#btnConfirmarExclusao')
  .addEventListener('click', async () => {
    await window.api.excluirInsumo(idParaExcluir);

    const modal = bootstrap.Modal.getInstance(
      document.querySelector('#modalConfirmarExclusao')
    );
    modal.hide();

    carregarInsumos(); // mesma função da Aula 3
  });

carregarInsumos();

/////////////////////////////////////////////////////
let pecasCarregados = [];
let idParaExcluirPeca = null;

const carregarPeca = async () => {
  pecaCarregados = await window.api.listarPecas();

  const linhas = pecaCarregados.map((peca) => `
    <tr>
      <td>${peca.titulo}</td>
      <td>${peca.cor}</td>
      <td>${peca.peso}</td>
      <td>${peca.quantidade_material}</td>
      <td>${peca.tempo_impressao}</td>
      <td>${formatarData(peca.data_impressao)}</td>
      <td>
        <button class="btn btn-sm btn-primary" onclick="editarPeca(${peca.id})">Editar</button>
        <button class="btn btn-sm btn-danger" onclick="abrirConfirmacaoExclusaoPeca(${peca.id})">Excluir</button>
      </td>
    </tr>
  `).join('');

  document.querySelector('#tbodypeca').innerHTML = linhas;
};

const editarPeca = (id) => {
  const peca = pecaCarregados.find((i) => i.id === id);
  window.api.editarPeca(peca);
};


const abrirConfirmacaoExclusaoPeca = (id) => {
  const peca = pecaCarregados.find((item) => item.id === id);

  document.getElementById('tituloPecaExcluir').textContent = peca.titulo;
  idParaExcluirPeca = id;

  const modalPeca = new bootstrap.ModalPeca(
    document.getElementById('modalConfirmarExclusaoPeca')
  );
  modalPeca.show();
};


document.querySelector('#btnConfirmarExclusaoPeca')
  .addEventListener('click', async () => {
    await window.api.excluirPeca(idParaExcluirPeca);

    const modalPeca = bootstrap.Modal.getInstance(
      document.querySelector('#modalConfirmarExclusaoPeca')
    );
    modalPeca.hide();

    carregarPecas();
  });