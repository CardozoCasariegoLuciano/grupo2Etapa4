const fs = require('fs').promises;

/**
 * Verifica si la ruta de archivo es válida.
 * @param {string} filePath - Ruta del archivo.
 * @returns {Promise<boolean>} - `true` si la ruta es válida, `false` en caso contrario.
 */
async function isValidPath(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Lee el contenido de un archivo.
 * @param {string} filePath - Ruta del archivo.
 * @returns {Promise<string>} - Contenido del archivo.
 * @throws {Error} - Error al leer el archivo.
 */
async function readFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    return content;
  } catch (error) {
    throw new Error('Error al leer el archivo');
  }
}

/**
 * Crea un archivo con el contenido especificado.
 * @param {string} filePath - Ruta del archivo a crear.
 * @param {string} content - Contenido del archivo.
 * @returns {Promise<void>}
 * @throws {Error} - Error al crear el archivo.
 */
async function createFile(filePath, content) {
  try {
    await fs.writeFile(filePath, content);
    console.log("El archivo se ha creado correctamente.");
  } catch (error) {
    throw new Error('Error al crear el archivo');
  }
}

module.exports = { isValidPath, readFile, createFile };
