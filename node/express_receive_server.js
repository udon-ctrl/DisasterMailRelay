const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const app = express();
app.use(bodyParser.json({ limit: '2mb' }));

app.post('/submit', (req, res) => {
  const payload = req.body;
  const outPath = path.join(__dirname, 'outbound_message.json');
  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2), 'utf8');
  exec('node receive_and_decrypt_and_send.js', (err, stdout, stderr) => {
    if (err) {
      console.error('Error executing decrypt/send:', err);
    }
    console.log(stdout);
    console.error(stderr);
  });
  res.json({ ok: true, saved: outPath });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Express receiver listening on ${port}`));
