const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('MCP Server funcionando!');
});

server.listen(3000, () => {
  console.log('Servidor MCP rodando em http://localhost:3000');
});
