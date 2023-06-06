// crypto.js
const CryptoJS = require("crypto-js");
const { readFile, createFile } = require('./fileHandler');
const path = require('path');

var iv = CryptoJS.lib.WordArray.random(16);

/**
 * Función para cifrar los datos
 * @param {string} data - Datos a cifrar
 * @param {string} key - Clave de cifrado
 * @returns {string} - Texto cifrado
 */
function encryptData(data, key) {
  const keyWordArray = CryptoJS.enc.Utf8.parse(key);
  const encrypted = CryptoJS.AES.encrypt(data, keyWordArray, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
    iv: iv
  });
  return encrypted.toString();
}

/**
 * Función para descifrar los datos
 * @param {string} ciphertext - Texto cifrado
 * @param {string} key - Clave de descifrado
 * @returns {string} - Texto descifrado
 */
function decryptData(ciphertext, key) {
  const keyWordArray = CryptoJS.enc.Utf8.parse(key);
  const decrypted = CryptoJS.AES.decrypt(ciphertext, keyWordArray, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
    iv: iv
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}

/**
 * Función para establecer y validar la clave
 * @param {string} keyOption - Clave proporcionada como opción
 * @param {string} keyFileOption - Ruta del archivo que contiene la clave
 * @returns {Promise<string>} - Clave válida
 */
async function getKey(keyOption, keyFileOption) {
  let key = "";

  if (keyOption) {
    if (keyOption.length !== 32) {
      throw new Error("La clave debe tener 32 caracteres");
    }
    key = keyOption;
  }

  if (keyFileOption) {
    const keyFromFile = await readFile(keyFileOption);
    if (keyFromFile.length !== 32) {
      throw new Error("La clave del archivo debe tener 32 caracteres");
    }
    key = keyFromFile;
  }

  if (!key) {
    throw new Error("La clave de encriptacion/desencriptacion es requerida para ejecutar el programa (usar --key 'SU_CLAVE')")
   
  }

  return key;
}

/**
 * Función para encriptar un archivo
 * @param {string} content - Contenido del archivo
 * @param {string} key - Clave de cifrado
 * @param {string} filePath - Ruta del archivo
 * @returns {Promise<void>}
 */
async function encryptFile(content, key, filePath) {
  const ciphertext = encryptData(content, key);
  const encryptedFileName = getOutputFileName(filePath, "_encriptado");
  await createFile(encryptedFileName, ciphertext);
}

/**
 * Función para desencriptar un archivo
 * @param {string} content - Contenido del archivo
 * @param {string} key - Clave de descifrado
 * @param {string} filePath - Ruta del archivo
 * @returns {Promise<void>}
 */
async function decryptFile(content, key, filePath) {
  const decryptedData = decryptData(content, key);
  const decryptedFileName = getOutputFileName(filePath, "_desencriptado");
  await createFile(decryptedFileName, decryptedData);
}

/**
 * Función para obtener el nombre de archivo de salida
 * @param {string} filePath - Ruta del archivo de entrada
 * @param {string} suffix - Sufijo para el nombre de archivo de salida
 * @returns {string} - Nombre de archivo de salida
 */
function getOutputFileName(filePath, suffix) {
  const fileName = path.basename(filePath);
  const fileExt = path.extname(filePath);
  const baseName = fileName.slice(0, fileName.length - fileExt.length);
  return `${baseName}${fileExt}${suffix}`;
}

module.exports = {
  encryptData,
  decryptData,
  getKey,
  encryptFile,
  decryptFile
};
