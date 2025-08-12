import express from 'express';
import bodyParser from 'body-parser';
import pdfParse from 'pdf-parse';

const app = express();
app.use(bodyParser.json({ limit: '10mb' }));

app.post('/parse-pdf', async (req, res) => {
  try {
    const { base64 } = req.body;
    if (!base64) return res.status(400).json({ error: 'Missing base64 input' });

    const buffer = Buffer.from(base64, 'base64');
    const data = await pdfParse(buffer);

    res.json({ text: data.text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('✅ PDF Parser is running');
});

app.listen(3000, () => {
  console.log('🚀 PDF parser server running on port 3000');
});
