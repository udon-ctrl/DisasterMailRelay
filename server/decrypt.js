const crypto = require("crypto");
const fs = require("fs");
const { sendMail } = require("./send_mail"); // 先ほど作ったsendMail関数

// 受け取るJSON（A案）
const encryptedJson = {
  protocol: "DisasterMailRelay/1.0",
  message_id: "abc123",
  ttl: 3600,
  encrypted_body: "BASE64でAES暗号化された本文",
  encrypted_key: "BASE64でRSA暗号化されたAES鍵"
};

// ==== 1. RSA鍵でAESキーを復号 ====
// ここでは秘密鍵ファイルを用意している前提
const privateKeyPem = fs.readFileSync("private_key.pem", "utf8");

// encrypted_key は Base64 なので Buffer に変換
const encryptedKeyBuffer = Buffer.from(encryptedJson.encrypted_key, "base64");

// RSA復号で AES キーを取り出す
const aesKey = crypto.privateDecrypt(
  {
    key: privateKeyPem,
    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
  },
  encryptedKeyBuffer
);

// ==== 2. AESで本文を復号 ====
// encrypted_body は Base64エンコードされている
const encryptedBodyBuffer = Buffer.from(encryptedJson.encrypted_body, "base64");

// AES-256-CBC 例（IVは最初の16バイトに含まれている想定）
const iv = encryptedBodyBuffer.slice(0, 16);
const ciphertext = encryptedBodyBuffer.slice(16);

const decipher = crypto.createDecipheriv("aes-256-cbc", aesKey, iv);
let decrypted = decipher.update(ciphertext);
decrypted = Buffer.concat([decrypted, decipher.final()]);

const plainText = decrypted.toString("utf8");

console.log("復号された本文:", plainText);

// ==== 3. sendMail() に渡す ====
sendMail("recipient@example.com", "災害メール", plainText);
