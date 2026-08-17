<<<<<<< HEAD
# NovaTech Assistência Técnica — Site novo (protótipo de venda)
=======
# Eaeficaz Refrigeração — Site novo (protótipo de venda)
>>>>>>> 8ed2d3ed1fc2e7f672866e5e4ccb4608e0fdc2e5

Site estático (HTML + CSS + JS puro — **sem build, sem Node, sem npm**), pensado para
funcionar em qualquer hospedagem simples e para você conseguir editar mesmo de um
computador sem permissão de instalar programas.

## Estrutura

```
<<<<<<< HEAD
novatech-site/
=======
eaeficaz-site/
>>>>>>> 8ed2d3ed1fc2e7f672866e5e4ccb4608e0fdc2e5
├── index.html              → toda a página (uma landing page só)
├── css/styles.css          → todo o visual (cores, fontes, animações, responsividade)
├── js/main.js              → interações (menu, scroll reveal, slider antes/depois, FAQ, assistente)
├── js/chatbot-data.js      → base de perguntas/respostas do assistente (edite aqui)
├── img/                    → imagens (hoje com placeholders — troque pelas reais)
│   └── antes-depois/       → fotos do "antes e depois"
└── docs/
    ├── README-projeto.md   → este arquivo
    └── briefing-cliente.md → lista de perguntas para o dono do site
```

## Como visualizar

Não precisa instalar nada. Duas formas:

1. **Mais simples:** abra o arquivo `index.html` direto no navegador (clique duas vezes).
2. **Melhor para testar o carregamento de imagens:** se algum dia tiver acesso a um
   terminal com Python, rode `python3 -m http.server 8000` dentro da pasta e acesse
   `http://localhost:8000`.

## Como subir para o ar (sem instalar nada)

Como é HTML puro, dá pra publicar em qualquer um desses, direto do navegador:

- **GitHub Pages** (grátis): suba a pasta para um repositório no GitHub → Settings →
  Pages → escolha a branch `main` → o site fica em `https://SEUUSUARIO.github.io/REPO`.
- **Netlify / Vercel** (grátis): arraste a pasta inteira no painel deles (drag-and-drop),
  sem precisar de linha de comando.
- **Hospedagem atual do cliente**: se ele já tem hospedagem (o domínio
<<<<<<< HEAD
  o cliente já tenha hospedagem própria — nesse caso, basta enviar os arquivos por FTP; senão, GitHub Pages/Netlify resolvem sem custo.
=======
  `eaeficazrefrigeracao.com.br` sugere que sim), basta enviar os arquivos por FTP.
>>>>>>> 8ed2d3ed1fc2e7f672866e5e4ccb4608e0fdc2e5

## O que trocar antes de entregar ao cliente

1. **Imagens** — todas em `img/` são placeholders gerados (fundo verde-petróleo com o
   nome do item escrito). Troque por fotos reais dos aparelhos e dos atendimentos.
   Isso é o item de maior impacto na conversão nesse nicho — clientes decidem
   principalmente pela confiança visual.
2. **Galeria antes/depois** (`img/antes-depois/`) — troque pelos pares de fotos reais.
   Peça autorização por escrito do cliente final antes de publicar qualquer foto de
   ambiente residencial.
<<<<<<< HEAD
3. **Textos e números** — telefone/WhatsApp e endereço já estão com os dados reais
   informados pelo cliente: (81) 99154-6997 e Rua Lima e Silva, 57 — Petrópolis,
   Caruaru/PE. Se algum desses dados mudar, atualize em `index.html` (aparece em vários
   pontos: topo, seção "Onde atendemos", rodapé) e em `js/chatbot-data.js`
   (`WHATSAPP_NUMBER`).
=======
3. **Textos e números** — telefone/WhatsApp já estão configurados com o número atual
   do site (`(81) 99109-8838`). Confirme se é esse mesmo número que o dono quer manter.
>>>>>>> 8ed2d3ed1fc2e7f672866e5e4ccb4608e0fdc2e5
4. **`js/chatbot-data.js`** — é onde fica o "cérebro" do assistente. Adicione mais
   perguntas reais que os clientes costumam fazer no WhatsApp.

## Assistente de dúvidas — como funciona hoje e como evoluir

O assistente que aparece no canto da tela **hoje é baseado em regras** (palavras-chave
→ resposta pronta), definido em `js/chatbot-data.js`. Vantagens dessa escolha para
começar:

- Funciona 100% no navegador, sem servidor, sem chave de API, sem custo por mensagem.
- Você consegue editar as respostas sem programar (só editar o arquivo de texto).
- Não corre risco de "inventar" informação errada sobre preço ou prazo.

### Evoluindo para uma IA generativa de verdade (ex: Claude)

Se no futuro vocês quiserem um assistente que realmente entende perguntas abertas
(não só palavras-chave), o caminho é:

1. Criar uma função de backend simples (Vercel Functions, Netlify Functions ou
   Cloudflare Workers — todas com plano grátis e sem precisar de servidor próprio)
   que recebe a pergunta do site e chama a API da Anthropic com a chave guardada
   em segredo no servidor (**nunca** coloque uma chave de API dentro do
   HTML/JS do site — qualquer visitante conseguiria roubá-la).
2. Trocar, em `js/main.js`, a função `answer()` para chamar essa função de backend
   em vez de procurar nos `INTENTS` locais.
3. Manter a base de conhecimento (bairros, marcas, serviços) como contexto enviado
   junto de cada pergunta, para a IA responder só com informação real da empresa.

Esse passo exige um pouco de programação de backend — quando chegar a hora, me
chame que eu monto essa parte com você.
