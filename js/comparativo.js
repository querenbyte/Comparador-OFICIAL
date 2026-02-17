// -------------------------------
// 1. CONFIGURAÇÃO INICIAL
// -------------------------------
const params = new URLSearchParams(window.location.search);
const idA = params.get("idA");
const idB = params.get("idB");
let phones = [];

// -------------------------------
// 2. O BANCO DE DADOS DO GLOSSÁRIO
// -------------------------------
const dicionarioGlossario = [
    { termo: "Dynamic Island", definicao: "Recurso da Apple que transforma a área da câmera em uma ilha interativa para notificações." },
    { termo: "Always-On Display", definicao: "Mantém a tela sempre ligada com baixo brilho para mostrar hora e notificações." },
    { termo: "ProRes", definicao: "Formato de vídeo profissional da Apple com alta fidelidade de cores." },
    { termo: "120 Hz", definicao: "Taxa de atualização: a tela se renova 120 vezes por segundo, deixando tudo mais fluido." },
    { termo: "120Hz", definicao: "Taxa de atualização: a tela se renova 120 vezes por segundo, deixando tudo mais fluido." },
    { termo: "AMOLED", definicao: "Tecnologia de tela com cores vivas e preto real (pixels desligados)." },
    { termo: "Super Retina XDR OLED", definicao: "Tecnologia de tela da Apple com altíssimo contraste e brilho." },
    { termo: "OLED", definicao: "Tecnologia de tela com cores vivas e preto real (pixels desligados)." },
    { termo: "Gorilla Glass Victus 2", definicao: "Vidro de proteção ultra resistente a quedas em concreto." },
    { termo: "Gorilla Victus", definicao: "Vidro super resistente a quedas e riscos." },
    { termo: "Gorilla Glass", definicao: "Marca de vidros resistentes usados em celulares." },
    { termo: "IP68", definicao: "Proteção máxima contra água (mergulho de 1.5m por 30min) e poeira." },
    { termo: "Snapdragon", definicao: "Família de processadores de alto desempenho para Android." },
    { termo: "A16 Bionic", definicao: "Processador da Apple presente nos iPhones 14 Pro e 15." },
    { termo: "A15 Bionic", definicao: "Processador da Apple presente na linha iPhone 13." },
    { termo: "MagSafe", definicao: "Sistema de ímãs na traseira para alinhar carregadores sem fio e carteiras." }
];

dicionarioGlossario.sort((a, b) => b.termo.length - a.termo.length);

// -------------------------------
// 3. CARREGA OS DADOS (ATUALIZADO PARA MÚLTIPLOS ARQUIVOS)
// -------------------------------
const arquivos = [
    "data/iphone.json",
    "data/samsung.json",
    "data/xiaomi.json",
    "data/motorola.json"
];

Promise.all(arquivos.map(url => fetch(url).then(r => r.json())))
    .then(resultados => {
        phones = resultados.flat(); // Junta tudo
        montarComparativo(); // Só inicia depois de carregar tudo
    })
    .catch(err => {
        console.error("Erro ao carregar banco de dados:", err);
    });

// -------------------------------
// 4. MONTA O COMPARATIVO
// -------------------------------
function montarComparativo() {

    const A = phones.find(p => p.id === idA);
    const B = phones.find(p => p.id === idB);

    if (!A || !B) {
        console.error("Aparelhos não encontrados (IDs inválidos ou JSON não carregado).");
        return;
    }

    // Preenche Imagens e Nomes (Topo)
    if(document.getElementById("imgTopA")) document.getElementById("imgTopA").src = A.img_top || A.img;
    if(document.getElementById("imgTopB")) document.getElementById("imgTopB").src = B.img_top || B.img;

    if (document.getElementById("nomeTopA")) {
        document.getElementById("nomeTopA").textContent = A.name;
        document.getElementById("nomeTopB").textContent = B.name;
    }

    if(document.getElementById("tituloA")) document.getElementById("tituloA").textContent = A.name;
    if(document.getElementById("tituloB")) document.getElementById("tituloB").textContent = B.name;

    // Formata Preço e Links (Topo)
    const formataValor = v => (typeof v === "number") ? v.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : "—";

    if(document.getElementById("cardA-preco")) document.getElementById("cardA-preco").textContent = A.preco ? formataValor(A.preco) : "—";
    if(document.getElementById("cardA-link")) document.getElementById("cardA-link").href = A.link_afiliado || "#";
    
    if(document.getElementById("cardB-preco")) document.getElementById("cardB-preco").textContent = B.preco ? formataValor(B.preco) : "—";
    if(document.getElementById("cardB-link")) document.getElementById("cardB-link").href = B.link_afiliado || "#";

    // --- CONFIGURA BOTÕES DO RODAPÉ (NOVO) ---
    if(document.getElementById("btnFinalA")) {
        document.getElementById("btnFinalA").href = A.link_afiliado || "#";
        document.getElementById("nomeFinalA").textContent = A.name;
    }

    if(document.getElementById("btnFinalB")) {
        document.getElementById("btnFinalB").href = B.link_afiliado || "#";
        document.getElementById("nomeFinalB").textContent = B.name;
    }

    // --- ESTRUTURA DA TABELA ---
    const estruturaTabela = [
        { tipo: 'titulo', texto: 'DESIGN & CORPO' },
        { chave: 'dimensoes', label: 'Dimensões' },
        { chave: 'peso', label: 'Peso' },
        { chave: 'construcao', label: 'Construção / IP' },

        { tipo: 'titulo', texto: 'TELA & IMAGEM' },
        { chave: 'tela_tipo', label: 'Tipo de Tela' },
        { chave: 'tela_tamanho', label: 'Tamanho' },
        { chave: 'tela_resolucao', label: 'Resolução' },
        { chave: 'tela_hz', label: 'Taxa de Atualização' },

        { tipo: 'titulo', texto: 'DESEMPENHO & SISTEMA' },
        { chave: 'sistema', label: 'Sistema Operacional' },
        { chave: 'processador', label: 'Chipset (Processador)' },
        { chave: 'ram', label: 'Memória RAM' },
        { chave: 'armazenamento', label: 'Armazenamento Interno' },
        
        { tipo: 'titulo', texto: 'CÂMERAS' },
        { chave: 'camera_traseira', label: 'Câmera Traseira' },
        { chave: 'camera_frontal', label: 'Câmera Frontal' },
        { chave: 'video_traseira', label: 'Vídeo' },
        { chave: 'recursos_camera', label: 'Recursos' },

        { tipo: 'titulo', texto: 'CONECTIVIDADE & EXTRAS' },
        { chave: 'rede', label: 'Rede (5G/4G)' },
        { chave: 'conectividade', label: 'Wi-Fi / Bluetooth' },
        { chave: 'biometria', label: 'Biometria' },
        { chave: 'som', label: 'Áudio' },

        { tipo: 'titulo', texto: 'BATERIA & CARGA' },
        { chave: 'bateria', label: 'Capacidade' },
        { chave: 'carregamento', label: 'Velocidade de Carga' },
        { chave: 'conteudo_caixa', label: 'Na Caixa' }
    ];

    const tbody = document.getElementById("linhas-especificacoes");
    if (!tbody) return;
    tbody.innerHTML = "";

    estruturaTabela.forEach(item => {
        // TÍTULO DE SEÇÃO
        if (item.tipo === 'titulo') {
            const trTitulo = document.createElement("tr");
            trTitulo.className = "linha-titulo-secao"; 
            trTitulo.innerHTML = `<td colspan="3">${item.texto}</td>`;
            tbody.appendChild(trTitulo);
            return; 
        }

        // LINHA NORMAL
        const tr = document.createElement("tr");
        let textoA = A.specs?.[item.chave] || "-";
        let textoB = B.specs?.[item.chave] || "-";

        textoA = aplicarGlossarioSeguro(textoA);
        textoB = aplicarGlossarioSeguro(textoB);

        tr.innerHTML = `
            <td>${item.label}</td>
            <td>${textoA}</td>
            <td>${textoB}</td>
        `;
        tbody.appendChild(tr);
    });
}

// -------------------------------
// FUNÇÕES AUXILIARES (GLOSSÁRIO E MODAL)
// -------------------------------
function aplicarGlossarioSeguro(textoOriginal) {
    if (!textoOriginal || textoOriginal === "-") return textoOriginal;
    let textoProcessado = textoOriginal;
    let placeholders = []; 

    dicionarioGlossario.forEach((item, index) => {
        const termo = item.termo;
        if (textoProcessado.includes(termo)) {
            const placeholderKey = `__GLOSS_${index}__`;
            const definicao = item.definicao.replace(/"/g, '&quot;').replace(/'/g, "\\'");
            const htmlFinal = `<span class="termo-glossario" onclick="abrirSheet('${termo}', '${definicao}')">${termo}</span>`;
            
            placeholders.push({ key: placeholderKey, html: htmlFinal });
            textoProcessado = textoProcessado.split(termo).join(placeholderKey);
        }
    });

    placeholders.forEach(p => {
        textoProcessado = textoProcessado.split(p.key).join(p.html);
    });
    return textoProcessado;
}

function abrirSheet(titulo, texto) {
    const modal = document.getElementById('sheet-overlay');
    if(modal) {
        document.getElementById('sheet-titulo').textContent = titulo;
        document.getElementById('sheet-texto').textContent = texto;
        modal.classList.add('ativo');
        document.body.style.overflow = 'hidden';
    }
}

function fecharSheet() {
    const modal = document.getElementById('sheet-overlay');
    if(modal) modal.classList.remove('ativo');
    document.body.style.overflow = '';
}

document.addEventListener('click', (e) => {
    const modal = document.getElementById('sheet-overlay');
    if (modal && e.target === modal) fecharSheet();
});