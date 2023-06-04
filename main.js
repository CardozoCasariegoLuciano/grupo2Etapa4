const { encryptFile, decryptFile, getKey } = require('./crypto');
const { isValidPath, readFile } = require('./fileHandler');
const { parseArguments } = require('./cli');

/**
 * Función principal del programa.
 * Lee los argumentos de la línea de comandos, valida y procesa los archivos.
 * @returns {Promise<void>}
 */
async function main() {
  try {
    const argv = await parseArguments();

    validateCliArgs(argv);

    const key = await getKey(argv.key, argv.keyFile);

    const content = await readFile(argv._[0]);

    if (argv.decrypt) {
      await decryptFile(content, key, argv._[0]);
    } else {
      await encryptFile(content, key, argv._[0]);
    }
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

/**
 * Valida los argumentos de la línea de comandos.
 * @param {Object} argv - Argumentos de la línea de comandos.
 * @throws {Error} Lanza un error si los argumentos no son válidos.
 */
function validateCliArgs(argv) {
  const isValidFilePath = isValidPath(argv._[0]);
  if (!isValidFilePath) {
    throw new Error("No es una ruta válida");
  }

  if (argv.key && argv.keyFile) {
    throw new Error("Debes usar o --key o --keyFile, no los dos juntos");
  }
}

main();
