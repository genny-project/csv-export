import fs from 'fs';

async function fsRead(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (err, data) => {
      if (err) {
        reject(err);
      }

      resolve(data);
    });
  });
}


export default fsRead;
