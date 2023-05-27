// Importar la biblioteca Crypto-JS
const CryptoJS = require("crypto-js");
const fs = require("fs");

const key = "unaClaveDeMinimo32CaracteresParaQueSeaValida";

{/* TODO: facilitarle al usuario el uso de su propia clave sáb 27 may 2023 19:34:01  */}
{/* TODO: usando flags cifrar o desifrar el archivo sáb 27 may 2023 19:34:01  */}
{/* TODO: Completar la ayuda al usuario cuando usa el flag -h sáb 27 may 2023 19:35:20  */}
{/* TODO: Atrapar el caso en el que se ingrese la ruta "../" sáb 27 may 2023 19:37:42  */}
{/* TODO: Que el archivo creado tenga el mismo nombre que el original + _cifrado sáb 27 may 2023 19:42:15  */}

function main() {
  const argument = process.argv[2];
  if (argument == "-h") {
    console.log("quiere ver la ayuda");
    return;
  }
  const isValidPAth = verificarRutaExistente(argument);
  if (!isValidPAth) {
    console.log("No es una ruta valida");
    return;
  }
  const content = readFile(argument);

  const ciphertext = encryptData(content, key);
  CreateFile("./cifrado.txt", ciphertext);

  const decryptedData = decryptData(ciphertext, key);
  console.log("Texto descifrado:", decryptedData);
}

function verificarRutaExistente(ruta) {
  try {
    fs.accessSync(ruta, fs.constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
}

function readFile(filePath) {
  content = fs.readFileSync(filePath, "utf8", (err, data) => {
    if (err) {
      console.log("Error al leer el archivo:", err);
      return;
    }
    return data;
  });
  return content;
}

function CreateFile(filePath, content) {
  fs.writeFile(filePath, content, (err) => {
    if (err) {
      console.log("Error al crear el archivo:", err);
      return;
    }

    console.log("El archivo se ha creado correctamente.");
  });
}

// Función para cifrar los datos
function encryptData(data, key) {
  // Convertir la clave a formato WordArray
  const keyWordArray = CryptoJS.enc.Utf8.parse(key);

  // Realizar el cifrado AES-256 utilizando la clave
  const encrypted = CryptoJS.AES.encrypt(data, keyWordArray, {
    mode: CryptoJS.mode.ECB, // Modo de operación: Electronic Codebook (ECB)
    padding: CryptoJS.pad.Pkcs7, // Esquema de relleno: PKCS7
  });

  // Devolver el texto cifrado como string
  return encrypted.toString();
}

// Función para descifrar los datos
function decryptData(ciphertext, key) {
  // Convertir la clave a formato WordArray
  const keyWordArray = CryptoJS.enc.Utf8.parse(key);

  // Realizar el descifrado AES-256 utilizando la clave
  const decrypted = CryptoJS.AES.decrypt(ciphertext, keyWordArray, {
    mode: CryptoJS.mode.ECB, // Modo de operación: Electronic Codebook (ECB)
    padding: CryptoJS.pad.Pkcs7, // Esquema de relleno: PKCS7
  });

  // Devolver el texto descifrado como string
  return decrypted.toString(CryptoJS.enc.Utf8);
}

main();
