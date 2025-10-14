// generate_rsa_keys.js
const { generateKeyPairSync } = require("crypto");
const fs = require("fs");

// RSA 2048bit 鍵ペアを生成して PEM で保存する（実行時に private_key.pem / public_key.pem が作られる）
const { publicKey, privateKey } = generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: { type: "pkcs1", format: "pem" },  // 公開鍵
  privateKeyEncoding: { type: "pkcs1", format: "pem" }, // 秘密鍵
});

fs.writeFileSync("private_key.pem", privateKey, "utf8");
fs.writeFileSync("public_key.pem", publicKey, "utf8");

console.log("RSA鍵ペアを生成しました: private_key.pem, public_key.pem");
