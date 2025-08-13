import express from 'express';
import bodyParser from 'body-parser';
import pdfParse from 'pdf-parse';

const app = express();

// Increase if your PDFs are large
app.use(bodyParser.json({ limit: '25mb' }));

// Optional: simple CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS,GET');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.get('/', (_req, res) => {
  res.send('PDF Parser is running');
});

app.post('/parse-pdf', async (req, res) => {
  try {
    let { base64 } = req.body;
    if (!base64 || typeof base64 !== 'string') {
      return res.status(400).json({ error: 'Missing base64 input' });
    }

    // Support data URLs like "data:application/pdf;base64,AAAA..."
    const comma = base64.indexOf(',');
    if (base64.startsWith('data:') && comma !== -1) {
      base64 = base64.slice(comma + 1);
    }

    const buffer = Buffer.from(base64, 'base64');
    if (!buffer.length) {
      return res.status(400).json({ error: 'Invalid base64 content' });
    }

    const data = await pdfParse(buffer);
    const text = (data?.text || '').trim();

    if (!text) {
      return res.status(400).json({ error: 'No extractable text found in PDF' });
    }

    res.json({ text });
  } catch (err) {
    res.status(500).json({ error: err?.message || 'Parse failed' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`PDF parser server running on port ${PORT}`);
});
