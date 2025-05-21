// Servidor simples para testar a aplicação localmente
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// Mapeamento de extensões de arquivo para tipos MIME
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  // Obter o caminho do arquivo solicitado
  let filePath = '.' + req.url;
  
  // Se a URL for '/', servir o index.html
  if (filePath === './') {
    filePath = './index.html';
  }
  
  // Obter a extensão do arquivo
  const extname = String(path.extname(filePath)).toLowerCase();
  
  // Tipo MIME padrão
  let contentType = MIME_TYPES[extname] || 'application/octet-stream';
  
  // Ler o arquivo
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // Arquivo não encontrado
        fs.readFile('./index.html', (err, content) => {
          if (err) {
            res.writeHead(500);
            res.end('Erro ao carregar o arquivo: ' + err.code);
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
          }
        });
      } else {
        // Outro erro de servidor
        res.writeHead(500);
        res.end('Erro no servidor: ' + error.code);
      }
    } else {
      // Arquivo encontrado, enviar resposta com o tipo MIME correto
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log('Para testar a PWA, use o Chrome e acesse o endereço acima');
  console.log('Para parar o servidor, pressione Ctrl+C');
}); 