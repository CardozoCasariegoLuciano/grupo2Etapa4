const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

/**
 * Parsea los argumentos de línea de comandos utilizando Yargs.
 * @returns {Promise<Object>} - Objeto con los argumentos parseados.
 */
async function parseArguments() {
  const argv = yargs(hideBin(process.argv))
    .option('key', {
      type: 'string',
      describe: 'Clave para encriptar, debe tener 32 caracteres.',
    })
    .option('keyFile', {
      type: 'string',
      describe: 'Ruta del archivo donde se encuentra la clave para encriptar, debe tener 32 caracteres.',
    })
    .option('decrypt', {
      type: 'boolean',
      default: false,
      describe: 'Desencriptar el archivo. Por defecto, encripta.',
    })
    .help('h')
    .alias('h', 'help')
    .argv;
  
  return argv;
}

module.exports = { parseArguments };
