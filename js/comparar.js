document.addEventListener("DOMContentLoaded", () => {

    const btn = document.getElementById("btnComparar");

    btn.addEventListener("click", () => {

        if (!selectedA || !selectedB) {
            alert("Selecione os dois smartphones antes de comparar.");
            return;
        }

        const url = `comparativo.html?idA=${selectedA.id}&idB=${selectedB.id}`;
        window.location.href = url;
    });

});
