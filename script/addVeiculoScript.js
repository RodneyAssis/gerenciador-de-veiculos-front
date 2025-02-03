const marca = document.getElementsByName("marca")[0];
const modelo = document.getElementsByName("modelo")[0];
const ano = document.getElementsByName("data")[0];
const fabricante = document.getElementsByName("fabricante")[0];
const preco = document.getElementsByName("preco")[0];
const cor = document.getElementsByName("cor")[0];

const categoriaRadios = document.getElementsByName("categoria");
const qtdPortas = document.getElementsByName("qtdPortas")[0];
const tipoCombustivel = document.getElementsByName("tipoCombustivel")[0];
const cilindrada = document.getElementsByName("cilindrada")[0];

const formulario = document.querySelector("form");

const btnenviar = document.querySelector(".enviar");
const btnCancelar = document.querySelector(".cancelar");

// Função para habilitar/desabilitar inputs com base na categoria selecionada
categoriaRadios.forEach(radio => {
    radio.addEventListener("change", () => {
        if (radio.value === "Carro") {
            qtdPortas.disabled = false;
            tipoCombustivel.disabled = false;
            cilindrada.disabled = true;
            cilindrada.value = ""; 

        } else if (radio.value === "Moto") {
            qtdPortas.disabled = true;
            tipoCombustivel.disabled = true;
            cilindrada.disabled = false;
            qtdPortas.value = "";
            tipoCombustivel.value = "";
        }
    });
});

btnenviar.addEventListener("click", async (event) => {
    event.preventDefault();

    // Pegando o valor da categoria selecionada
    let categoriaSelecionada = "";
    categoriaRadios.forEach(radio => {
        if (radio.checked) {
            categoriaSelecionada = radio.value;
        }
    });

    let veiculoData = {
        marca: marca.value,
        modelo: modelo.value,
        ano: ano.value,
        fabricante: fabricante.value,
        preco: preco.value,
        cor: cor.value,
        tipoCategoria: categoriaSelecionada
    };

    if (categoriaSelecionada === "Carro") {
        veiculoData.quantidadePortas = qtdPortas.value;
        veiculoData.tipoCombustivel = tipoCombustivel.value;
    } else if (categoriaSelecionada === "Moto") {
        veiculoData.cilindrada = cilindrada.value;
    }

    if (Object.values(veiculoData).some(valor => valor.trim() === "")) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Parece que você esqueceu de preencher algum campo.",
            });
            return;
        } 

    try {
        const resposta = await fetch(`http://localhost:1200/veiculo`, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(veiculoData)
        });

        if (resposta.ok) {
            await Swal.fire({
                icon: "success",
                title: "Veículo adicionado com sucesso!",
                showConfirmButton: false,
                timer: 3000
            });
            
            // Aguarda um pouco antes de recarregar a página
            setTimeout(() => {
                location.reload(); 
            }, 5000); 
            //formulario.reset(); // Limpa os campos

            qtdPortas.disabled = true;
            tipoCombustivel.disabled = true;
            cilindrada.disabled = true;

        } else {
            throw new Error("Erro ao adicionar veículo.");
        }

    } catch (error) {
        console.error(error);
        Swal.fire({
            icon: "error",
            title: "Erro!",
            text: "Não foi possível adicionar o veículo.",
        });
    }
});

btnCancelar.addEventListener("click", async (event) => {
    event.preventDefault();

    const resultado = await swal.fire({
        title: "Tem certeza que deseja cancelar?",
        text: "O veiculo não será cadastrado!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim",
        cancelButtonText: "Não",
        reverseButtons: true
    });
    if (resultado.isConfirmed) {
        formulario.reset();

        Swal.fire({
            title: "Cancelado!",
            text: "Operação cancelada, os campos foram limpos.",
            icon: "error"
        });

        } else if (resultado.dismiss === Swal.DismissReason.cancel) {
           return;
        }

});