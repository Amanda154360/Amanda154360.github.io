const { app, BrowserWindow, Menu, Tray, dialog, ipcMain } = require('electron');
const path = require('path');
const conexao = require('./conexao');

let tray = null; // A variável do ícone precisa ser global para não sumir!

// Testa a conexão com o banco assim que o app sobe.
const testarConexaoBanco = () => {
    conexao.query('SELECT 1', (erro) => {
        if (erro) {
            console.error('Erro ao conectar ao MySQL:', erro.message);
            dialog.showErrorBox(
                'Erro de conexão com o banco',
                `Não foi possível conectar ao MySQL.\n\n${erro.message}`
            );
            return;
        }
        console.log('Conectado ao MySQL com sucesso!');
    });
};

const abrirModalInsumo = (janelaPai, insumo = null) => {
    const janelaModal = new BrowserWindow({
        width: 500,
        height: 600,
        parent: janelaPai,
        modal: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    janelaModal.loadFile(path.join(__dirname, '../renderer/frmInsumo.html'));

    //janelaModal.webContents.openDevTools();


    // Só existe insumo quando estamos ABRINDO EM MODO EDIÇÃO
    if (insumo) {
        janelaModal.webContents.once('did-finish-load', () => {
            janelaModal.webContents.send('insumo:preencher', insumo);
        });
    }
};



const abrirModalPeca = (janelaPrincipal) => {
    const janelaModal = new BrowserWindow({
        width: 400, height: 600,
        parent: janelaPrincipal, modal: true
    });
    janelaModal.removeMenu();
    janelaModal.loadFile(path.join(__dirname, '../renderer/frmPeca.html'));
};

app.whenReady().then(() => {

    testarConexaoBanco();

    const janelaPrincipal = new BrowserWindow({
        width: 1000, height: 700,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    // Volta uma pasta (sai de 'main', entra em 'renderer')
    janelaPrincipal.loadFile(path.join(__dirname, '../renderer/frmPrincipal.html'));

    janelaPrincipal.webContents.openDevTools();

    // Chamado quando o usuário clica em "Editar" na tabela
    ipcMain.handle('insumo:abrirEdicao', (evento, insumo) => {
        abrirModalInsumo(janelaPrincipal, insumo);
    });

    ipcMain.handle('peca:abrirEdicaoPeca', (evento, peca) => {
        abrirModalPeca(janelaPrincipal, peca);
    });

    criarMenuPrincipal(janelaPrincipal);
    criarTray(janelaPrincipal);


    //-----------
    // INSERIR
    //-----------
    ipcMain.handle('insumo:criar', (evento, insumo) => {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO insumo (tipo, nome, valor, data_aquisicao) VALUES (?, ?, ?, ?)';

            conexao.query(sql, [insumo.tipo, insumo.nome, insumo.valor, insumo.data_aquisicao], (erro, resultado) => {
                if (erro) {
                    reject(erro);
                    return;
                }
                resolve({ id: resultado.insertId, ...insumo });
            });
        });
    });


    //-----------
    // LISTAR
    //-----------
    ipcMain.handle('insumo:listar', () => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM insumo ORDER BY data_aquisicao DESC';

            conexao.query(sql, (erro, resultado) => {
                if (erro) {
                    reject(erro);
                    return;
                }
                resolve(resultado);
            });
        });
    });


    //ATUALIZAR
    ipcMain.handle('insumo:atualizar', (evento, insumo) => {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE insumo SET tipo = ?, nome = ?, valor = ?, data_aquisicao = ? WHERE id = ?';
            const valores = [insumo.tipo, insumo.nome, insumo.valor, insumo.data_aquisicao, insumo.id];

            conexao.query(sql, valores, (erro, resultado) => {
                if (erro) {
                    reject(erro);
                } else {
                    resolve(resultado);
                }
            });
        });
    });

    //EXCLUIR
    ipcMain.handle('insumo:excluir', (evento, id) => {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM insumo WHERE id = ?';

            conexao.query(sql, [id], (erro, resultado) => {
                if (erro) {
                    reject(erro);
                    return;
                }
                resolve(resultado);
            });
        });
    });

});

//////
//-----------
    // INSERIR
    //-----------
    ipcMain.handle('peca:criar', (evento, peca) => {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO peca (titulo, cor, peso, quantidade_material, tempo_impressao ,data_impressao) VALUES (?, ?, ?, ?, ?, ?)';

            conexao.query(sql, [peca.titulo, peca.cor, peca.peso, peca.quantidade_material, peca.tempo_impressao, peca.data_impressao], (erro, resultado) => {
                if (erro) {
                    reject(erro);
                    return;
                }
                resolve({ id: resultado.insertId, ...peca });
            });
        });
    });


    //-----------
    // LISTAR
    //-----------
    ipcMain.handle('peca:listar', () => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM peca ORDER BY data_aquisicao DESC';

            conexao.query(sql, (erro, resultado) => {
                if (erro) {
                    reject(erro);
                    return;
                }
                resolve(resultado);
            });
        });
    });


    //ATUALIZAR
    ipcMain.handle('peca:atualizar', (evento, peca) => {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE peca SET titulo = ?, cor = ?, peso = ?, quantidade_material = ?, tempo_impressao = ? ,data_impressao = ? WHERE id = ?';
            const valores = [peca.titulo, peca.cor, peca.peso, peca.quantidade_material, peca.tempo_impressao, peca.data_impressao, peca.id];

            conexao.query(sql, valores, (erro, resultado) => {
                if (erro) {
                    reject(erro);
                } else {
                    resolve(resultado);
                }
            });
        });
    });

    //EXCLUIR
    ipcMain.handle('peca:excluir', (evento, id) => {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM peca WHERE id = ?';

            conexao.query(sql, [id], (erro, resultado) => {
                if (erro) {
                    reject(erro);
                    return;
                }
                resolve(resultado);
            });
        });
    });

const criarMenuPrincipal = (janelaPrincipal) => {
    // 1. A Receita do Menu
    const templateDoMenu = [
        {
            label: 'Cadastros',
            submenu: [
                { label: 'Insumos', click: () => abrirModalInsumo(janelaPrincipal) },
                { label: 'Peça Impressa', click: () => abrirModalPeca(janelaPrincipal) }
            ]
        },
        {
            label: 'Sistema',
            submenu: [
                { label: 'Sair Imediatamente', role: 'quit', accelerator: 'CmdOrCtrl+Q' }
            ]
        }
    ];

    // 2. Transforma a receita em um Menu de verdade
    const menuReal = Menu.buildFromTemplate(templateDoMenu);

    // 3. Aplica o menu à nossa aplicação inteira!
    Menu.setApplicationMenu(menuReal);
}

const criarTray = (janela) => {
    // ... (depois de aplicar o menu) ...

    // O caminho da imagem que você baixou
    const iconeCaminho = path.join(__dirname, 'icone.png');

    // Cria o ícone no cantinho do relógio
    tray = new Tray(iconeCaminho);

    // Define a mensagem que aparece ao passar o mouse por cima
    tray.setToolTip('Meu Super App rodando no fundo!');

    const menuDoTray = Menu.buildFromTemplate([
        {
            label: 'Abrir Painel',
            click: () => {
                // Se a janela estiver escondida, mostre de novo!
                janela.show();
            }
        },
        { type: 'separator' },
        {
            label: 'Encerrar', click: () => {
                app.isQuitting = true; // Define uma flag para fechar de vez
                app.quit();
            }
        }

    ]);

    // 3. Intercepte o fechamento da janela
    janela.on('close', (event) => {
        if (!app.isQuitting) {
            event.preventDefault(); // Impede o fechamento real
            janela.hide();      // Apenas esconde a janela
        }
    });

    // Gruda esse menu no clique com o botão direito do ícone!
    tray.setContextMenu(menuDoTray);
}