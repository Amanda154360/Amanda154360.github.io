const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  criarInsumo: (insumo) => ipcRenderer.invoke('insumo:criar', insumo),
  listarInsumos: () => ipcRenderer.invoke('insumo:listar'),

  // NOVO — invoke/handle: abre o modal já em modo edição
  editarInsumo: (insumo) => ipcRenderer.invoke('insumo:abrirEdicao', insumo),

  // NOVO — send/on: o main AVISA o formulário, sem que ele pergunte nada
  aoReceberInsumoParaEditar: (callback) =>
    ipcRenderer.on('insumo:preencher', (evento, insumo) => callback(insumo)),

  // NOVO — invoke/handle: salva a edição
  atualizarInsumo: (dados) => ipcRenderer.invoke('insumo:atualizar', dados),
  // NOVO -- invoke/handle: o frmPrincipal.js espera a exclusao terminar
  // antes de fechar o modal e recarregar a lista
  excluirInsumo: (id) => ipcRenderer.invoke('insumo:excluir', id),


  ///////////////////
  criarPeca: (peca) => ipcRenderer.invoke('peca:criar', peca),
  listarPecas: () => ipcRenderer.invoke('peca:listar'),

  // NOVO — invoke/handle: abre o modal já em modo edição
  editarPeca: (peca) => ipcRenderer.invoke('peca:abrirEdicaoPeca', peca),

  // NOVO — send/on: o main AVISA o formulário, sem que ele pergunte nada
  aoReceberPecaParaEditar: (callback) =>
    ipcRenderer.on('peca:preencher', (evento, peca) => callback(peca)),

  // NOVO — invoke/handle: salva a edição
  atualizarPeca: (dados) => ipcRenderer.invoke('peca:atualizar', dados),
  // NOVO -- invoke/handle: o frmPrincipal.js espera a exclusao terminar
  // antes de fechar o modal e recarregar a lista
  excluirPeca: (id) => ipcRenderer.invoke('peca:excluir', id)
});