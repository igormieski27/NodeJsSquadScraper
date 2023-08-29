const axios = require("axios");
const cheerio = require("cheerio");
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const fs = require("fs");

function parseValue(value) {
  const regex = /([\d.,]+)\s*(\w+)/;
  const match = value.match(regex);

  if (match) {
    const numberPart = match[1].replace(",", ".");
    const unitPart = match[2].toLowerCase();

    const units = {
      mil: 1000,
      mi: 1000000,
      bi: 1000000000,
    };

    if (units[unitPart]) {
      return parseFloat(numberPart) * units[unitPart];
    }
  }

  return null;
}

async function fazerScrapingTransfermarkt(url) {
  try {
    const resposta = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
        Referer: "https://www.google.com/", // Insira um referenciador válido aqui
      },
    });
    const $ = cheerio.load(resposta.data);

    const jogadores = [];

    $(".items tr").each((indice, elemento) => {
      const $linha = $(elemento);
      const eImpar = $linha.hasClass("odd");

      if (eImpar || $linha.hasClass("even")) {
        const nome = $linha.find(".hauptlink a").text().trim();
        const posicao = $linha.find(".posrela td").eq(2).text().trim();
        const idadeCompleta = $linha.find(".zentriert").eq(1).text().trim();
        const idade = idadeCompleta.split("(")[1].split(")")[0];
        const altura = eImpar
          ? $linha.find(".zentriert").eq(2).text().trim()
          : $linha.find(".zentriert").eq(3).text().trim();
        const pePreferido = eImpar
          ? $linha.find(".zentriert").eq(3).text().trim()
          : $linha.find(".zentriert").eq(4).text().trim();
        const valorDeMercado = $linha.find(".rechts.hauptlink").text().trim();
        const valorConvertido = parseValue(valorDeMercado);

        jogadores.push({
          nome,
          posicao,
          idade,
          altura,
          pePreferido,
          valorDeMercado: valorConvertido,
        });
      }
    });
    ("");
    return jogadores;
    // Restante do código de scraping
  } catch (erro) {
    console.error("Erro ao fazer scraping dos dados:", erro);
    return [];
  }
}

const urlLista = [
  {
    time: "América-MG",
    url: "https://www.transfermarkt.com.br/america-mineiro/kader/verein/2863/saison_id/2023/plus/1",
  },
  {
    time: "Athletico-PR",
    url: "https://www.transfermarkt.com.br/athletico-paranaense/kader/verein/679/saison_id/2023/plus/1",
  },
  {
    time: "Atlético-MG",
    url: "https://www.transfermarkt.com.br/atletico-mineiro/kader/verein/330/saison_id/2023/plus/1",
  },
  {
    time: "Bahia",
    url: "https://www.transfermarkt.com.br/ec-bahia/kader/verein/10010/saison_id/2023/plus/1",
  },
  {
    time: "Botafogo",
    url: "https://www.transfermarkt.com.br/botafogo-fr/kader/verein/537/saison_id/2023/plus/1",
  },
  {
    time: "Corinthians",
    url: "https://www.transfermarkt.com.br/sc-corinthians/kader/verein/199/saison_id/2023/plus/1",
  },
  {
    time: "Coritiba",
    url: "https://www.transfermarkt.com.br/coritiba-fc/kader/verein/776/saison_id/2023/plus/1",
  },
  {
    time: "Cruzeiro",
    url: "https://www.transfermarkt.com.br/cruzeiro-ec/kader/verein/609/saison_id/2023/plus/1",
  },
  {
    time: "Cuiabá",
    url: "https://www.transfermarkt.com.br/cuiaba-ec/kader/verein/28022/saison_id/2023/plus/1",
  },
  {
    time: "Flamengo",
    url: "https://www.transfermarkt.com.br/cr-flamengo/kader/verein/614/saison_id/2023/plus/1",
  },
  {
    time: "Fluminense",
    url: "https://www.transfermarkt.com.br/fluminense-fc/kader/verein/2462/saison_id/2023/plus/1",
  },
  {
    time: "Fortaleza",
    url: "https://www.transfermarkt.com.br/fortaleza-ec/kader/verein/10870/saison_id/2023/plus/1",
  },
  {
    time: "Goiás",
    url: "https://www.transfermarkt.com.br/goias-ec/kader/verein/3197/saison_id/2023/plus/1",
  },
  {
    time: "Grêmio",
    url: "https://www.transfermarkt.com.br/gremio-fbpa/kader/verein/210/saison_id/2023/plus/1",
  },
  {
    time: "Internacional",
    url: "https://www.transfermarkt.com.br/sc-internacional/kader/verein/6600/saison_id/2023/plus/1",
  },
  {
    time: "Palmeiras",
    url: "https://www.transfermarkt.com.br/se-palmeiras/kader/verein/1023/saison_id/2023/plus/1",
  },
  {
    time: "RB Bragantino",
    url: "https://www.transfermarkt.com.br/rb-bragantino/kader/verein/8793/saison_id/2023/plus/1",
  },
  {
    time: "Santos",
    url: "https://www.transfermarkt.com.br/santos-fc/kader/verein/221/saison_id/2023/plus/1",
  },
  {
    time: "Sao Paulo",
    url: "https://www.transfermarkt.com.br/sao-paulo-fc/kader/verein/585/saison_id/2023/plus/1",
  },
  {
    time: "Vasco",
    url: "https://www.transfermarkt.com.br/cr-vasco-da-gama/kader/verein/978/saison_id/2023/plus/1",
  },
];

async function scrapeAllUrls(urls) {
  const results = {};

  for (const urlInfo of urls) {
    console.log(`Scraping ${urlInfo.time}...`);
    await sleep(1500); // Delay de 20 segundos

    try {
      const jogadores = await fazerScrapingTransfermarkt(urlInfo.url);
      results[urlInfo.time] = { plantel: jogadores };
      console.log(`Scraping de ${urlInfo.time} concluído.`);
    } catch (error) {
      console.error(`Erro ao fazer scraping de ${urlInfo.time}:`, error);
    }
  }

  return results;
}

scrapeAllUrls(urlLista)
  .then((results) => {
    const finalResult = { times: results };
    const jsonContent = JSON.stringify(finalResult, null, 2);

    fs.writeFile("results/times.json", jsonContent, (err) => {
      if (err) {
        console.error("Erro ao escrever o arquivo times.json:", err);
      } else {
        console.log("Arquivo times.json foi salvo com sucesso.");
      }
    });
  })
  .catch((err) => {
    console.error("Erro:", err);
  });
