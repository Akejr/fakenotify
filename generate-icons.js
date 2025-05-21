// Este script gera ícones de cores sólidas para representar os aplicativos
// Deve ser executado no console do navegador após o HTML e CSS estarem carregados

function createCanvas(width, height, color, text) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  
  // Fundo com cor sólida
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
  
  // Adicionar texto (inicial)
  if (text) {
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${Math.floor(width/2)}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, width/2, height/2);
  }
  
  return canvas;
}

function generateIconDataURL(width, height, color, text) {
  const canvas = createCanvas(width, height, color, text);
  return canvas.toDataURL('image/png');
}

// Cores dos apps
const nubankColor = '#8A05BE';
const picpayColor = '#11C76F';
const mercadoPagoColor = '#009EE3';

// Gerar ícones de app
console.log('Ícone Nubank:', generateIconDataURL(192, 192, nubankColor, 'N'));
console.log('Ícone PicPay:', generateIconDataURL(192, 192, picpayColor, 'P'));
console.log('Ícone Mercado Pago:', generateIconDataURL(192, 192, mercadoPagoColor, 'M'));

// Ícones da aplicação
console.log('Ícone App 192x192:', generateIconDataURL(192, 192, nubankColor, 'NF'));
console.log('Ícone App 512x512:', generateIconDataURL(512, 512, nubankColor, 'NF'));

// Instrução para o usuário
console.log(`
INSTRUÇÕES:
1. Abra o arquivo HTML no navegador
2. Abra o console do navegador (F12)
3. Cole este código no console e execute
4. Para cada ícone exibido, clique com o botão direito na URL e escolha "Abrir em nova guia"
5. Na nova guia, clique com o botão direito na imagem e escolha "Salvar imagem como"
6. Salve na pasta 'icons' com os nomes:
   - nubank-icon.png
   - picpay-icon.png
   - mercadopago-icon.png
   - icon-192x192.png
   - icon-512x512.png
`); 