const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

// Edit these for demo
const plainText = "これは災害連絡のテストメッセージです。集合場所は体育館です。";
const recipientEmail = "udonudonudon12@icloud.com";
const ttlSeconds = 3600;

const publicKeyPem = fs.readFileSync(path.join(__dirname, 'public_key.pem'), 'utf8');

const aesKey = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);
const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, iv);
let ciphertext = cipher.update(Buffer.from(plainText, 'utf8'));
ciphertext = Buffer.concat([ciphertext, cipher.final()]);
const encryptedBodyBuffer = Buffer.concat([iv, ciphertext]);
const encrypted_body_b64 = encryptedBodyBuffer.toString('base64');

const encryptedKeyBuffer = crypto.publicEncrypt(
  {
    key: publicKeyPem,
    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
  },
  aesKey
);
const encrypted_key_b64 = encryptedKeyBuffer.toString('base64');

const payload = {
  protocol: "DisasterMailRelay/1.0",
  message_id: crypto.randomUUID(),
  ttl: ttlSeconds,
  to: recipientEmail,
  encrypted_body: encrypted_body_b64,
  encrypted_key: encrypted_key_b64,
  created_at: new Date().toISOString()
};

const outboundPath = path.join(__dirname, 'outbound_message.json');
fs.writeFileSync(outboundPath, JSON.stringify(payload, null, 2), 'utf8');
console.log('Encrypted JSON written to', outboundPath);

const qrPath = path.join(__dirname, 'outbound_qr.png');
QRCode.toFile(qrPath, JSON.stringify(payload), { errorCorrectionLevel: 'M', width: 1024 })
  .then(() => console.log('QR written to', qrPath))
  .catch(err => console.error('QR error', err));
