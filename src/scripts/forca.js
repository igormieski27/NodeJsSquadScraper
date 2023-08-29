const fs = require("fs");

// Função para gerar um valor aleatório entre min e max (incluindo min, excluindo max)
function gerarAleatorio(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

// Função para calcular o valor de força com base no valor de mercado
function calcularForca(valorDeMercado) {
  let forcaBase = 40;
  let adicional1 = 10;
  let adicional2 = gerarAleatorio(5, 21);
  console.log(valorDeMercado);
  if (valorDeMercado > 600000 && valorDeMercado <= 999999) {
    adicional1 = 10;
    adicional2 = gerarAleatorio(0, 21);
  } else if (valorDeMercado > 1000000 && valorDeMercado <= 8000000) {
    adicional1 = 20;
    adicional2 = gerarAleatorio(10, 28);
  } else if (valorDeMercado > 8000000 && valorDeMercado <= 9000000) {
    adicional1 = 25;
    adicional2 = gerarAleatorio(0, 25);
  } else if (valorDeMercado > 9000000) {
    adicional1 = 30;
    adicional2 = gerarAleatorio(0, 29);
    console.log();
  }

  const forca = forcaBase + adicional1 + adicional2;
  return Math.min(99, forca); // Garante que a força não ultrapasse 99
}

// Função para processar e adicionar atributo "forca" aos jogadores
function adicionarForca(jogadores) {
  for (const timeKey in jogadores.times) {
    const plantel = jogadores.times[timeKey].plantel;
    for (const jogador of plantel) {
      jogador.forca = calcularForca(jogador.valorDeMercado);
      console.log(
        jogador.nome,
        " valor: ",
        jogador.valorDeMercado + " força: " + jogador.forca
      );
    }
  }
  return jogadores;
}

// Lê o arquivo JSON com os jogadores
fs.readFile("times.json", "utf8", (err, data) => {
  if (err) {
    console.error("Erro ao ler o arquivo:", err);
    return;
  }

  try {
    const jogadores = JSON.parse(data);
    const jogadoresComForca = adicionarForca(jogadores);

    // Salva o resultado de volta no arquivo
    fs.writeFile(
      "results/jogadores_com_forca.json",
      JSON.stringify(jogadoresComForca, null, 2),
      "utf8",
      (err) => {
        if (err) {
          console.error("Erro ao salvar o arquivo:", err);
          return;
        }
        console.log('Atributo "forca" adicionado e arquivo salvo com sucesso.');
      }
    );
  } catch (parseError) {
    console.error("Erro ao fazer o parse do JSON:", parseError);
  }
});
