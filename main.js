// Importar la biblioteca Crypto-JS
const CryptoJS = require("crypto-js");
const fs = require("fs");

key = "";
type = "encrypt";

// TODO: Que el archivo creado tenga el mismo nombre que el original + _cifrado o original + _descifrado
// TODO: Matener el tipo de archivo al crear la encriptacion
// TODO: Mover logica en otros archivos
// TODO: Atrapar el caso en el que se ingrese la ruta "../" o similares

//Extras
//TODO agregar color a las respuetas
//TODO crear un flag para guardar en un archivo nuevo la key que se haya usado

function main() {
  const argument = process.argv[2];
  if (argument == "-h") {
    printHelp();
    return;
  }

  const error = setAndValidateData();
  if (error == 1) {
    return;
  }

  const content = readFile(argument);
  if (type === "encrypt") {
    const ciphertext = encryptData(content, key);
    CreateFile("./cifrado.txt", ciphertext);
  }

  if (type === "decrypt") {
    const decryptedData = decryptData(content, key);
    CreateFile("./descifrado.txt", decryptedData);
  }
}

function setAndValidateData() {
  const isValidPAth = checkPath(process.argv[2]);
  if (!isValidPAth) {
    console.log("No es una ruta valida");
    return 1;
  }

  for (let index = 3; index < process.argv.length; index++) {
    arg = process.argv[index].split("=");
    option = arg[0];
    value = arg[1];

    switch (option) {
      case "--key":
        if (key != "") {
          console.log("tenes que usar o --key o --keyFile, no los dos juntos");
          return 1;
        }
        if (value.length != 32) {
          console.log("La clave tiene que tener 32 caracteres");
          return 1;
        }
        key = value;
        break;

      case "--keyFile":
        if (key != "") {
          console.log("tenes que usar o --key o --keyFile, no los dos juntos");
          return 1;
        }
        const isValidPAth = checkPath(value);
        if (!isValidPAth) {
          console.log("--keyFile no es una ruta valida");
          return 1;
        }
        keyFromfile = readFile(value);
        if (keyFromfile.length != 32) {
          console.log("La clave tiene que tener 32 caracteres");
          return 1;
        }
        key = keyFromfile;
        break;

      case "--decrypt":
        type = "decrypt";
        break;

      default:
        console.log("Algo no salio bien, revisa la ayuda con -h");
        return 1;
    }
  }

  if (key == "") {
    console.log("Sera usada la clave por defecto");
    key = "LaclavePorDefectoAlgoritmoAES256";
  }
}

function checkPath(ruta) {
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

    content = readFile(filePath);
    if (content == "" && type == "decrypt") {
      console.log("Fallo");
      console.log(
        "Probablemente la clave de descifrado es distinta a la de cifrado"
      );
      console.log("  o el archivo ingresado no esta previamente cifrado");
    } else {
      console.log("El archivo se ha creado correctamente.");
    }
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

function printHelp() {
  console.log("Command: node main.js [FileToEncript] [OPTIONS] \n");
  console.log("Options:");

  console.log(
    "-h                     Mostar ayuda en pantalla"
  );
  console.log(
    "--key=[TEXT]           ingresa una clave para encriptar, tiene que ser mayor de 32 caracteres"
  );
  console.log(
    "--keyFile=[PATH]       ingresa el archivo donde este la clave para encriptar, tiene que ser mayor de 32 caracteres"
  );
  console.log(
    "--decrypt              Desencriptar archivo, Por defecto encripta"
  );

  console.log("\n NOTA: cada opcion se escribe sin espacios, respetando el signo = y el nombre de la opcion ")
  console.log("las opciones se separan entre si con espacios")
}

main();
