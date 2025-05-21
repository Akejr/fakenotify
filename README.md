# Notificações Falsas - App de Brincadeira

Este é um aplicativo PWA (Progressive Web App) que permite criar notificações falsas de aplicativos bancários como Nubank, PicPay e Mercado Pago. O aplicativo foi desenvolvido apenas para fins de brincadeira e não deve ser usado para enganar ou prejudicar outras pessoas.

## Como usar

1. Abra o arquivo `index.html` no seu navegador
2. Escolha o aplicativo que deseja imitar
3. Selecione o tipo de notificação
4. Digite o nome do remetente e o valor
5. Defina o atraso em segundos
6. Clique em "Gerar Notificação"
7. Aguarde o tempo definido para ver a notificação

## Testando com o servidor local

Para aproveitar todos os recursos da PWA, é recomendado usar um servidor local:

1. Certifique-se de que você tem o Node.js instalado no seu computador
2. Abra o terminal na pasta do projeto
3. Execute o comando: `node server.js`
4. Acesse no navegador: `http://localhost:3000`

## Gerando os ícones

Antes de usar, você precisa gerar os ícones para os apps:

1. Abra o arquivo HTML no navegador
2. Abra o console do navegador (F12)
3. Cole o conteúdo do arquivo `generate-icons.js` no console e execute
4. Para cada ícone exibido, clique com o botão direito na URL e escolha "Abrir em nova guia"
5. Na nova guia, clique com o botão direito na imagem e escolha "Salvar imagem como"
6. Salve na pasta 'icons' com os nomes adequados:
   - nubank-icon.png
   - picpay-icon.png
   - mercadopago-icon.png
   - icon-192x192.png
   - icon-512x512.png

## Instalação como PWA

Para instalar o aplicativo no seu celular ou computador:

### No Android:
1. Abra o site no Google Chrome
2. Toque no ícone de menu (três pontos)
3. Selecione "Adicionar à tela inicial" ou "Instalar aplicativo"

### No iOS:
1. Abra o site no Safari
2. Toque no ícone de compartilhamento (caixa com seta para cima)
3. Role para baixo e toque em "Adicionar à Tela de Início"

### No Desktop:
1. Abra o site no Google Chrome, Microsoft Edge ou outro navegador compatível
2. Clique no ícone de instalação na barra de endereço (ou no menu)
3. Clique em "Instalar"

## Observações

- O aplicativo requer permissão para mostrar notificações
- Algumas funcionalidades podem não estar disponíveis em navegadores antigos
- Em iOS, as notificações nativas podem não funcionar devido a restrições da Apple
- O aplicativo funciona offline depois de instalado como PWA
- Este aplicativo é apenas para diversão e brincadeiras, use com responsabilidade

## Licença

Este projeto está disponível para uso livre, não comercial. 