// ============================================================
// 1. VARIÁVEIS GLOBAIS
// ============================================================
let phones = [];
let selectedA = null;
let selectedB = null;

// ============================================================
// 2. INICIALIZAÇÃO
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
    carregarDados();

    const brandA = document.getElementById("brandA");
    const brandB = document.getElementById("brandB");
    const searchA = document.getElementById("searchA");
    const searchB = document.getElementById("searchB");
    const listaA = document.getElementById("listaA");
    const listaB = document.getElementById("listaB");
    const btnComparar = document.getElementById("btnComparar");
    
    // Configuração Inicial dos Campos
    searchA.disabled = true;
    searchB.disabled = true;
    searchA.placeholder = "Selecione uma marca primeiro";
    searchB.placeholder = "Selecione uma marca primeiro";

    // --- LISTENERS DE MARCA (Quando muda o select) ---
    brandA.addEventListener("change", () => {
        configurarCampoBusca(brandA.value, searchA, "A");
    });

    brandB.addEventListener("change", () => {
        configurarCampoBusca(brandB.value, searchB, "B");
    });

    // --- LISTENERS DE DIGITAÇÃO ---
    searchA.addEventListener("input", () => atualizarLista("A"));
    searchB.addEventListener("input", () => atualizarLista("B"));

    // --- FECHAR LISTA AO CLICAR FORA ---
    document.addEventListener("click", (e) => {
        if (!listaA.contains(e.target) && e.target !== searchA) listaA.style.display = "none";
        if (!listaB.contains(e.target) && e.target !== searchB) listaB.style.display = "none";
    });

    // ============================================================
    // 3. LÓGICA DO BOTÃO COMPARAR (VALIDAÇÃO FINAL)
    // ============================================================
    btnComparar.addEventListener("click", () => {
        const status = document.getElementById("statusSelecionados");

        // Validação 1: Selecionou os dois?
        if (!selectedA || !selectedB) {
            alert("Por favor, selecione os dois smartphones antes de comparar.");
            return;
        }

        // Validação 2: São iguais? (TRAVA)
        if (selectedA.id === selectedB.id) {
            alert("Opa! Você selecionou o mesmo celular nos dois lados.\nEscolha modelos diferentes para o duelo!");
            
            if(status) {
                status.textContent = "Erro: Selecione aparelhos diferentes.";
                status.style.color = "#ff5555"; // Texto vermelho
            }
            return;
        }
        
        // Sucesso: Redireciona
        const urlDestino = `comparativo.html?idA=${selectedA.id}&idB=${selectedB.id}`;
        window.location.href = urlDestino;
    });
});

// ============================================================
// 4. FUNÇÕES DE DADOS (CARREGAMENTO MÚLTIPLO)
// ============================================================
function carregarDados() {
    // Lista dos seus arquivos separados
    const arquivos = [
        "data/iphone.json",
        "data/samsung.json",
        "data/xiaomi.json",
        "data/motorola.json"
    ];

    // Carrega todos simultaneamente
    Promise.all(arquivos.map(url => fetch(url).then(res => res.json())))
        .then(resultados => {
            // Junta todos os arrays em um só (Flat)
            phones = resultados.flat();
            popularMarcas();
        })
        .catch(err => {
            console.error("Erro ao carregar dados:", err);
            alert("Erro ao carregar o banco de dados dos celulares.");
        });
}

function popularMarcas() {
    const brandA = document.getElementById("brandA");
    const brandB = document.getElementById("brandB");

    // Cria lista única de marcas e organiza alfabeticamente
    const marcas = [...new Set(phones.map(p => p.brand))].sort();

    marcas.forEach(marca => {
        brandA.appendChild(new Option(marca, marca));
        brandB.appendChild(new Option(marca, marca));
    });
}

// ============================================================
// 5. FUNÇÕES DE INTERFACE
// ============================================================

/* Ativa/Desativa o campo de texto baseado na marca */
function configurarCampoBusca(marca, input, prefixo) {
    if (marca) {
        input.disabled = false;
        input.placeholder = "Pesquise o modelo...";
        input.focus();
    } else {
        input.disabled = true;
        input.value = "";
        input.placeholder = "Selecione uma marca primeiro";
    }
    atualizarLista(prefixo);
}

/* Filtra e exibe a lista de celulares */
function atualizarLista(prefixo) {
    const brandSelect = document.getElementById(`brand${prefixo}`);
    const searchInput = document.getElementById(`search${prefixo}`);
    const lista = document.getElementById(`lista${prefixo}`);

    const marcaSelecionada = brandSelect.value;
    const termo = searchInput.value.trim().toLowerCase();

    if (!marcaSelecionada) {
        lista.style.display = "none";
        return;
    }

    // Filtra primeiro pela marca, depois pelo texto digitado
    let filtrados = phones.filter(p => p.brand === marcaSelecionada);

    if (termo) {
        filtrados = filtrados.filter(p => p.name.toLowerCase().includes(termo));
    }

    // Se não achou nada
    if (filtrados.length === 0) {
        lista.innerHTML = "<p style='padding:12px; font-size:0.9rem; color:#aaa; text-align:center;'>Nenhum modelo encontrado.</p>";
        lista.style.display = "block";
        return;
    }

    // Monta a lista visual
    lista.innerHTML = "";
    filtrados.forEach(phone => {
        const item = document.createElement("div");
        item.className = "item-resultado";
        
        // Miniatura
        const thumb = document.createElement("div");
        thumb.className = "item-thumb";
        const img = document.createElement("img");
        img.src = phone.img;
        thumb.appendChild(img);

        // Nome
        const info = document.createElement("div");
        info.className = "item-info";
        info.textContent = phone.name;

        item.appendChild(thumb);
        item.appendChild(info);

        // Clique
        item.addEventListener("click", () => selecionarModelo(prefixo, phone, searchInput, lista));

        lista.appendChild(item);
    });

    lista.style.display = "block";
}

/* Ação ao selecionar um celular da lista */
function selecionarModelo(prefixo, phone, input, lista) {
    input.value = phone.name;
    lista.style.display = "none";

    if (prefixo === "A") selectedA = phone;
    else selectedB = phone;

    atualizarStatus();
}

/* Atualiza o texto abaixo do botão */
function atualizarStatus() {
    const status = document.getElementById("statusSelecionados");
    status.style.color = ""; // Reseta cor de erro

    if (selectedA && selectedB) {
        status.textContent = `PRONTO PARA O FIGHT: ${selectedA.name} vs ${selectedB.name}`;
    } else if (selectedA) {
        status.textContent = `1º Selecionado: ${selectedA.name}`;
    } else if (selectedB) {
        status.textContent = `2º Selecionado: ${selectedB.name}`;
    } else {
        status.textContent = "";
    }
}