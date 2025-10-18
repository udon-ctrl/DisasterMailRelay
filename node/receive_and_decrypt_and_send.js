const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { sendMail } = require("./send_mail");

const inboundPath = path.join(__dirname, "outbound_message.json");

if (!fs.existsSync(inboundPath)) {
  console.error("outbound_message.json not found. run encrypt_and_qr.js first or POST payload to express server.");
  process.exit(1);
}

const payload = JSON.parse(fs.readFileSync(inboundPath, "utf8"));

// TTL check
if (payload.created_at && payload.ttl) {
  const createdAt = new Date(payload.created_at);
  const now = new Date();
  const elapsed = Math.floor((now - createdAt) / 1000);
  if (elapsed > payload.ttl) {
    console.error("Message TTL expired. elapsed:", elapsed);
    process.exit(1);
  }
}

// RSA private key
const privateKeyPem = fs.readFileSync(path.join(__dirname, "private_key.pem"), "utf8");

let aesKey;
try {
  const encryptedKeyBuffer = Buffer.from(payload.encrypted_key, "base64");
  aesKey = crypto.privateDecrypt(
    {
      key: privateKeyPem,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    },
    encryptedKeyBuffer
  );
} catch (err) {
  console.error("RSA decrypt AES key failed:", err);
  process.exit(1);
}

try {
  const encryptedBodyBuffer = Buffer.from(payload.encrypted_body, "base64");
  const iv = encryptedBodyBuffer.slice(0, 16);
  const ciphertext = encryptedBodyBuffer.slice(16);

  const decipher = crypto.createDecipheriv("aes-256-cbc", aesKey, iv);
  let decrypted = decipher.update(ciphertext);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  const plainText = decrypted.toString("utf8");

  console.log("Decrypted plaintext:\n", plainText);

  sendMail(payload.to, `[災害伝言リレー] 体育館に集合してください`, plainText)
    .then((info) => {
      console.log("Email sent:", info && info.messageId ? info.messageId : "(no messageId)");
    })
    .catch((err) => {
      console.error("SendMail failed:", err);
    });
} catch (err) {
  console.error("AES decrypt failed:", err);
  process.exit(1);
}
