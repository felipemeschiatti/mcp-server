import express, { Request, Response } from 'express';
import axios from 'axios';

const app = express();
const PORT = 3000;

// Middleware para aceitar JSON nas requisições
app.use(express.json());

// Lista de ferramentas registradas (memória RAM, para fins didáticos)
type Tool = {
  name: string;
  description: string;
};
const tools: Tool[] = [];

// Endpoint de status
app.get('/status', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'MCP Server está rodando!' });
});

// Rota principal (opcional)
app.get('/', (req: Request, res: Response) => {
  res.send('MCP Server funcionando!');
});

// Endpoint para registrar ferramenta (POST /tools/register)
app.post('/tools/register', (req: Request, res: Response) => {
  const { name, description } = req.body;
  if (!name || !description) {
    return res.status(400).json({ error: 'name e description são obrigatórios!' });
  }
  // Evita duplicidade de nome
  if (tools.find(tool => tool.name === name)) {
    return res.status(400).json({ error: 'Ferramenta já registrada!' });
  }
  tools.push({ name, description });
  res.json({ message: 'Ferramenta registrada com sucesso!', tools });
});

// Endpoint para listar ferramentas (GET /tools)
app.get('/tools', (req: Request, res: Response) => {
  res.json(tools);
});

// Endpoint principal MCP
app.post('/mcp', async (req: Request, res: Response) => {
  const { tool, params } = req.body;
  if (tool !== 'cotacao_moeda') {
    return res.status(400).json({ error: 'Ferramenta não suportada.' });
  }
  const { from = 'USD', to = 'BRL' } = params || {};

  try {
    // Consulta cotação usando AwesomeAPI
    const url = `https://economia.awesomeapi.com.br/last/${from}-${to}`;
    const response = await axios.get(url);

    const data = response.data[`${from}${to}`];
    if (!data) {
      return res.status(404).json({ error: 'Moeda não encontrada.' });
    }

    res.json({
      tool: 'cotacao_moeda',
      from,
      to,
      cotacao: data.bid,
      high: data.high,
      low: data.low,
      timestamp: data.create_date,
      info: 'Cotação em tempo real via AwesomeAPI'
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Erro ao consultar cotação.', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor MCP rodando em http://localhost:${PORT}`);
});
