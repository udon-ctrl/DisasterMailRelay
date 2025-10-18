const { generateKeyPairSync } = require("crypto");
const fs = require("fs");

const { publicKey, privateKey } = generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: { type: "pkcs1", format: "pem" },
  privateKeyEncoding: { type: "pkcs1", format: "pem" },
});

fs.writeFileSync("private_key.pem", privateKey, { encoding: "utf8", mode: 0o600 });
fs.writeFileSync("public_key.pem", publicKey, { encoding: "utf8" });

console.log("RSA keypair generated: private_key.pem, public_key.pem");
