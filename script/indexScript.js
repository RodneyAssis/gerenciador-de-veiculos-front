
const containerVeiculos = document.querySelector(".veiculos__container");

async function buscarEMostrarVeiculos() {
    try {
        const busca = await fetch("http://localhost:1200/veiculo/veiculos");
        const veiculos = await busca.json();

        containerVeiculos.innerHTML = "";

        veiculos.forEach(veiculo=> {
            const veiculoJSON = encodeURIComponent(JSON.stringify(veiculo));

            let cardVeiculosHTML = `
                <div class="card" style="width: 18rem;">
                    <div class="card-body">
                        <h5 class="card-title categoria">Categoria: ${veiculo.categoria}</h5>
                        <p class="card-text">Marca: ${veiculo.marca}</p>
                        <p class="card-text">Modelo: ${veiculo.modelo}</p>
                        <p class="card-text">Ano: ${veiculo.ano}</p>

                        <div class="btn-group" role="group">
                            <button type="button" class="btn btn-danger" data-id="${veiculo.id}" data-categoria="${veiculo.categoria}">Deletar</button>
                            <button type="button" class="btn btn-warning btn-editar" data-id="${veiculo.id}" data-categoria="${veiculo.categoria}">Editar</button>
                            <button type="button" class="btn btn-success btn-visualizar" data-veiculo="${veiculoJSON}">Visualizar</button>
                        </div>
                    </div>
                </div>
            `;

            containerVeiculos.innerHTML += cardVeiculosHTML;
        });
    } catch (error) {
        console.error("Erro ao carregar os veículos:", error);
    }
}

// Função para filtrar por categoria
function filtrarPorCategoria(filtro) {
    const veiculos = document.querySelectorAll(".card");

    for (let veiculo of veiculos) {
        let categoria = veiculo.querySelector(".categoria").textContent.toLowerCase();

        let valorFiltro = filtro.toLowerCase();

        if (!categoria.includes(valorFiltro)) {
            veiculo.style.display = "none"; 
        } else {
            veiculo.style.display = "block"; 
        }
    }
}

containerVeiculos.addEventListener("click", async (event) => {
    if (event.target.classList.contains("btn-danger")) {
        const card = event.target.closest(".card");
        const idVeiculo = event.target.getAttribute("data-id"); 
        const categoria = event.target.getAttribute("data-categoria"); 

        if (!idVeiculo || !categoria) {
            console.error("ID do veículo ou categoria não encontrados.");
            return;
        }

        const resultado = await Swal.fire({
            title: "Tem certeza?",
            text: "Essa ação não pode ser revertida!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sim, deletar!",
            cancelButtonText: "Não, cancelar!",
            reverseButtons: true
        });

        if (resultado.isConfirmed) {
            try {
                const url = `http://localhost:1200/veiculos/${categoria.toLowerCase()}/${idVeiculo}`;
                const resposta = await fetch(url, {
                    method: "DELETE",
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (!resposta.ok) throw new Error("Erro ao deletar veículo.");

                Swal.fire({
                    title: "Deletado!",
                    text: "O veículo foi removido com sucesso.",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                });

                setTimeout(() => {
                    card.remove();
                }, 2000);

            } catch (erro) {
                console.error("Erro ao excluir veículo:", erro);
                Swal.fire({
                    title: "Erro!",
                    text: "Não foi possível excluir o veículo.",
                    icon: "error"
                });
            }
        } else if (resultado.dismiss === Swal.DismissReason.cancel) {
            Swal.fire({
                title: "Cancelado",
                text: "Operação cancelada",
                icon: "error",
                timer: 1500,
                showConfirmButton: false
            });
        }
    }
});

containerVeiculos.addEventListener("click", (event) => {
    if (event.target.classList.contains("btn-visualizar")) {

        const veiculo = JSON.parse(decodeURIComponent(event.target.getAttribute("data-veiculo")));

        let detalhesHTML = `
            <p><strong>Categoria:</strong> ${veiculo.categoria}</p>
            <p><strong>Marca:</strong> ${veiculo.marca}</p>
            <p><strong>Modelo:</strong> ${veiculo.modelo}</p>
            <p><strong>Cor:</strong> ${veiculo.cor}</p>
            <p><strong>Ano:</strong> ${veiculo.ano}</p>
            <p><strong>Fabricante:</strong> ${veiculo.fabricante}</p>
            <p><strong>Preço:</strong> ${veiculo.preco}</p>
        `;

        if (veiculo.categoria === "Carro") {
            detalhesHTML += `
                <p><strong>Quantidade de portas:</strong> ${veiculo.quantidadePortas}</p>
                <p><strong>Tipo de Combustível:</strong> ${veiculo.tipoCombustivel}</p>
            `;
        } else if (veiculo.categoria === "Moto") {
            detalhesHTML += `
                <p><strong>Cilindrada:</strong> ${veiculo.cilindrada}</p>
            `;
        }

        Swal.fire({
            title: "Detalhes do Veículo",
            imageWidth: 400,
            imageHeight: 200,
            html: detalhesHTML,
            confirmButtonText: "Fechar"
        });
    }
});


containerVeiculos.addEventListener("click", async (event) => {
    if (event.target.classList.contains("btn-editar")) {
       // const card = event.target.closest(".card");
        const idVeiculo = event.target.getAttribute("data-id"); 
        const categoria = event.target.getAttribute("data-categoria"); 

        if (!idVeiculo || !categoria) {
            console.error("ID do veículo ou categoria não encontrados.");
            return;
        }

        try {
            const resposta = await fetch(`http://localhost:1200/veiculos/${categoria.toLowerCase()}/${idVeiculo}`);
            console.log(resposta)
            if (!resposta.ok) throw new Error("Erro ao buscar veículo.");

            const veiculo = await resposta.json();

            const { value: formValues } = await Swal.fire({
                title: "Editar Veículo",
                html: `
                    <input id="swal-marca" class="swal2-input" value="${veiculo.marca}" placeholder="Marca">
                    <input id="swal-modelo" class="swal2-input" value="${veiculo.modelo}" placeholder="Modelo">
                    <input id="swal-ano" class="swal2-input" value="${veiculo.ano}" type="number" placeholder="Ano">
                    <input id="swal-fabricante" class="swal2-input" value="${veiculo.fabricante}" placeholder="Fabricante">
                    <input id="swal-preco" class="swal2-input" value="${veiculo.preco}" type="number" placeholder="Preço">
                    <input id="swal-cor" class="swal2-input" value="${veiculo.cor}" placeholder="Cor">
                    <input id="swal-categoria" class="swal2-input" value="${veiculo.categoria}" readonly placeholder="Categoria">
                    
                    ${veiculo.categoria === "Carro" ? `
                        <input id="swal-qtdPortas" class="swal2-input" value="${veiculo.quantidadePortas}" placeholder="Quantidade de portas">
                        <input id="swal-tipoCombustivel" class="swal2-input" value="${veiculo.tipoCombustivel}" placeholder="Tipo de combustível">
                    ` : ""}
            
                    ${veiculo.categoria === "Moto" ? `
                        <input id="swal-cilindrada" class="swal2-input" value="${veiculo.cilindrada}" placeholder="Cilindrada">
                    ` : ""}
                `,
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: "Salvar",
                cancelButtonText: "Cancelar",
                preConfirm: () => {
                    return {
                        marca: document.getElementById("swal-marca").value,
                        modelo: document.getElementById("swal-modelo").value,
                        ano: document.getElementById("swal-ano").value,
                        fabricante: document.getElementById("swal-fabricante").value,
                        preco: document.getElementById("swal-preco").value,
                        cor: document.getElementById("swal-cor").value,
                        categoria: document.getElementById("swal-categoria").value,
                        quantidadePortas: veiculo.categoria === "Carro" ? document.getElementById("swal-qtdPortas").value : null,
                        tipoCombustivel: veiculo.categoria === "Carro" ? document.getElementById("swal-tipoCombustivel").value : null,
                        cilindrada: veiculo.categoria === "Moto" ? document.getElementById("swal-cilindrada").value : null
                    };
                }
            });
            
            if (formValues) {
                const respostaUpdate = await fetch(`http://localhost:1200/veiculos/${categoria.toLowerCase()}/${idVeiculo}`, {
                    method: "PATCH",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formValues)
                });

                if (!respostaUpdate.ok) throw new Error("Erro ao atualizar veículo.");

                Swal.fire({
                    icon: "success",
                    title: "Veículo atualizado!",
                    text: "Os dados foram alterados com sucesso.",
                    timer: 2000,
                    showConfirmButton: false
                });

                // setTimeout(() => {
                    
                // }, 2000);
            }

        } catch (error) {
            console.error("Erro ao editar veículo:", error);
            Swal.fire({
                icon: "error",
                title: "Erro!",
                text: "Não foi possível atualizar o veículo."
            });
        }
    }
});

buscarEMostrarVeiculos()

