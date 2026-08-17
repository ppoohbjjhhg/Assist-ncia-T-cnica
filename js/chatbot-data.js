/**
 * Base de conhecimento do assistente NovaTech.
 * -----------------------------------------------------------
 * Isto é um assistente baseado em regras (keyword matching),
 * 100% client-side — não precisa de servidor, chave de API
 * nem custo por mensagem. Ele resolve as dúvidas mais comuns
 * e sempre direciona o fechamento para o WhatsApp humano.
 *
 * Para evoluir para IA generativa (Claude) no futuro, veja
 * docs/README-projeto.md → seção "Evoluindo o assistente".
 *
 * EDITE OS ARRAYS ABAIXO com as informações reais do cliente.
 */

const WHATSAPP_NUMBER = "5581991546997";
const whatsappLink = (msg) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

const KB = {
  bairros: [
    "nova caruaru","universitario","universitário","salgado","santa rosa","indianopolis","indianópolis",
    "mauricio de nassau","maurício de nassau","petropolis","petrópolis","cidade jardim","xique xique","xique-xique",
    "vassoural","agamenon","cidade alta","riachao","riachão","sao francisco","são francisco","panorama","caruaru"
  ],
  marcas: ["brastemp","electrolux","consul","lg","samsung","panasonic"],
  servicos: [
    { chave:["geladeira","freezer","frigobar","refrigerad"], nome:"Conserto de Geladeira, Freezer e Frigobar" },
    { chave:["maquina de lavar","máquina de lavar","lava e seca","lavadora","secadora"], nome:"Conserto de Máquina de Lavar e Lava e Seca" },
    { chave:["lava-louças","lava loucas","lava-loucas","louça"], nome:"Conserto de Lava-Louças" },
    { chave:["micro-ondas","microondas","micro ondas"], nome:"Conserto de Micro-ondas" }
  ]
};

// Perguntas / respostas por intenção. Cada item tem palavras-chave
// e uma resposta. A primeira intenção com match "vence". henrique
const INTENTS = [
  {
    id:"ar-condicionado",
    keywords:["ar condicionado","ar-condicionado","split","climatizador"],
    reply:"No momento o site lista conserto de geladeira, freezer, frigobar, máquina de lavar, lava e seca, lava-louças e micro-ondas. Para ar-condicionado, confirme direto no WhatsApp — a equipe informa se atende.",
    cta:"Perguntar sobre ar-condicionado no WhatsApp"
  },
  {
    id:"endereco",
    keywords:["endereco","endereço","onde fica","localizacao","localização","loja","fica onde"],
    reply:"Nossa base fica na Rua Lima e Silva, 57 — bairro Petrópolis, Caruaru/PE. O atendimento em si é feito na casa ou comércio do cliente, em qualquer bairro atendido.",
    cta:"Confirmar endereço no WhatsApp"
  },
  {
    id:"bairro",
    keywords:[
      "bairro","atende minha regiao","atende minha região","atendem ai","voces vem","vocês vêm","atende onde eu moro",
      "voces atendem","vocês atendem","atendem em","caruaru todo","toda caruaru",
      "nova caruaru","universitario","universitário","salgado","santa rosa","indianopolis","indianópolis",
      "mauricio de nassau","maurício de nassau","petropolis","petrópolis","cidade jardim","xique xique",
      "vassoural","agamenon","cidade alta","riachao","riachão","sao francisco","são francisco","panorama"
    ],
    reply:"Atendemos toda Caruaru: Nova Caruaru, Universitário, Salgado, Santa Rosa, Indianópolis, Maurício de Nassau, Petrópolis, Cidade Jardim, Xique Xique, Vassoural, Agamenon, Cidade Alta, Riachão, São Francisco e Panorama. Não viu seu bairro? A equipe confirma na hora pelo WhatsApp.",
    cta:"Confirmar meu bairro no WhatsApp"
  },
  {
    id:"marca",
    keywords:["marca","brastemp","electrolux","consul","lg","samsung","panasonic"],
    reply:"Trabalhamos com as principais marcas do mercado: Brastemp, Electrolux, Consul, LG, Samsung e Panasonic. Se o seu aparelho é de outra marca, geralmente também atendemos — confirme pelo WhatsApp.",
    cta:"Perguntar sobre minha marca"
  },
  {
    id:"preco",
    keywords:["preco","preço","valor","quanto custa","orcamento","orçamento","caro","barato"],
    reply:"O valor depende do defeito identificado no diagnóstico. Depois de avaliar o aparelho, é passado um orçamento transparente antes de qualquer serviço — sem surpresa na hora de pagar.",
    cta:"Pedir um orçamento agora"
  },
  {
    id:"garantia",
    keywords:["garantia","confiavel","confiável","seguro"],
    reply:"Todo serviço realizado sai com garantia por escrito, cobrindo tanto a peça trocada quanto a mão de obra.",
    cta:"Falar com um técnico"
  },
  {
    id:"prazo",
    keywords:["mesmo dia","quando","prazo","demora","rapido","rápido","hoje"],
    reply:"Na maioria dos casos o atendimento é feito no mesmo dia, dependendo da agenda e da região. Bairros mais próximos da nossa base no Petrópolis costumam ter prioridade de deslocamento.",
    cta:"Verificar disponibilidade hoje"
  },
  {
    id:"servico-geladeira",
    keywords:["geladeira","freezer","frigobar","não gela","nao gela","gelando","fazendo gelo"],
    reply:"Fazemos conserto de geladeira, freezer e frigobar de todas as marcas, com peças originais e garantia de fábrica na peça e na mão de obra.",
    cta:"Falar sobre minha geladeira"
  },
  {
    id:"servico-lavadora",
    keywords:["lavadora","máquina de lavar","maquina de lavar","lava e seca","não centrifuga","nao centrifuga","vazando"],
    reply:"Somos especialistas em máquina de lavar, lava e seca e secadoras, com diagnóstico ágil nas principais marcas do mercado.",
    cta:"Falar sobre minha máquina"
  },
  {
    id:"servico-loucas",
    keywords:["lava-louças","lava loucas","louça","louças"],
    reply:"Diagnosticamos e resolvemos problemas técnicos gerais em lava-louças de todas as principais marcas.",
    cta:"Falar sobre minha lava-louças"
  },
  {
    id:"servico-microondas",
    keywords:["micro-ondas","microondas","micro ondas"],
    reply:"Fazemos conserto de micro-ondas de todas as principais marcas, com agilidade e qualidade.",
    cta:"Falar sobre meu micro-ondas"
  },
  {
    id:"domicilio",
    keywords:["domicilio","domicílio","em casa","vem aqui","vao ate","vão até","loja"],
    reply:"Atendemos em domicílio e em estabelecimentos comerciais em toda Caruaru, incluindo expositoras e frigobares comerciais.",
    cta:"Agendar visita técnica"
  }
];

const FALLBACK = {
  reply:"Essa eu não tenho certeza — mas o time humano resolve rapidinho no WhatsApp. Pode perguntar sobre bairros atendidos, marcas, tipo de aparelho ou como funciona o orçamento também.",
  cta:"Falar com um técnico agora"
};