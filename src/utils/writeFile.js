import fs from 'fs';

async function fsWrite(filename, data) {
  fs.writeFile('../../public/uploads/filename1.csv', data, (err) => {
    if (err) {
      throw new Error(err);
    }
  });
}

export default fsWrite;
