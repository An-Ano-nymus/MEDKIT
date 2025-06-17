const express = require('express');
const multer = require('multer');
const { PythonShell } = require('python-shell');
const path = require('path');
const fs = require('fs');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('file'), async (req, res) => {
  const filePath = req.file?.path;
  const sourceLang = req.body?.sourceLang || 'en';
  const targetLang = req.body?.targetLang;

  if (!filePath || !targetLang) {
    return res.status(400).json({ error: 'Missing file or target language' });
  }

  res.writeHead(200, {
    'Content-Type': 'text/plain',
    'Transfer-Encoding': 'chunked',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  console.log("Running LLaMA Translator with:", filePath, sourceLang, targetLang);

  try {
   const pyshell = new PythonShell(path.join(__dirname, '../python_scripts/translator_by_llama.py'), {
  args: [filePath, sourceLang, targetLang],
  pythonOptions: ['-u'],
  encoding : 'utf-8'
});


    pyshell.stdout.on('data', (line) => {
      res.write(line + '\n');
    });

    pyshell.stderr.on('data', (errLine) => {
      res.write(`[ERROR] ${errLine}\n`);
    });

    pyshell.on('close', (code) => {
      fs.unlinkSync(filePath); // delete uploaded file
      res.end();
    });

    pyshell.on('error', (err) => {
      fs.unlinkSync(filePath);
      res.write(`[FATAL ERROR] ${err.message}\n`);
      res.end();
    });

  } catch (err) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res.write(`[SERVER ERROR] ${err.message}\n`);
    res.end();
  }
});

module.exports = router;
