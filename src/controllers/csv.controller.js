import aws from 'aws-sdk';
import * as CSV from 'csv-string';
import path from 'path';
import uuid from 'uuid/v1';
import fs from 'fs';
import csvToJson from 'csvtojson';

import s3Upload from '../utils/aws.utils';

import config from '../config';


const BUCKET_NAME = config.bucketName;
const IAM_USER_KEY = config.keyId;
const IAM_USER_SECRET = config.accessKey;
const URL = config.url;

aws.config.update({ accessKeyId: IAM_USER_KEY, secretAccessKey: IAM_USER_SECRET });
const s3bucket = new aws.S3({ params: { Bucket: BUCKET_NAME } });

const createCsvWriter = require('csv-writer').createArrayCsvWriter;

const csv = (req, res) => {
  const { csvString } = req.body || null;

  console.log('request from the body', csvString, '\n \n');
  if (csvString) {
    const check = csvString;
    try {
      const parsedCSV = CSV.parse(check);
      const jsonStringified = JSON.stringify(parsedCSV);

      // console.log('###########');
      // console.log(parsedCSV);
      // console.log(jsonStringified);
      // console.log('#####');

      const arr = parsedCSV;
      const filename = uuid();

      const csvWriter = createCsvWriter({
        header: arr[0],
        path: path.join(__dirname, `../../public/uploads/${filename}.csv`),
      });

      const records = arr.splice(1);

      // const arrFromRecors = Array.from(records);
      // console.log('RRRY conversion', arrFromRecors);

      /** **************** new stuff goes here **************************** */
      /** ****************************************************************** */
      console.log('data to be written as csv file', records);

      csvWriter.writeRecords(records) // returns a promise
        .then(() => {
          console.log('...File written on the disk');

          /* s3 upload begins here */
          const dummyFile = {};
          dummyFile.originalFilename = filename;
          dummyFile.path = path.join(__dirname, `../../public/uploads/${filename}.csv`);

          s3Upload(dummyFile, (message) => {
            if (message && message.data) {
              console.log('uploading to s3');
              console.log(message.data, 'MESSAGE');
              const url = message.data.key;
              return res.status(200).json({ url });
            }
            if (message && message.error) {
              const err = message.error;
              return res.status(200).json({ err });
            }
          });
        }).catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
      res.status(500);
      console.log(' Error While writing csv');
      return res.json({ message: 'Error writing file ' });
    }
  } else {
    return res.status(500).json({ message: "String not found or doesn't exists" });
  }
};


const getCsv = (req, res) => {
  const { fileName } = req.params;
  console.log(fileName);

  const options = {
    Bucket: config.bucketName,
    Key: fileName,
  };

  s3bucket.getObject(options, (err, data) => {
    if (err) {
      console.log(err.stack);
      return res.send({ message: 'Error while getting data from s3 bucket' });
    }

    // res.attachment(data.body);rs
    console.log('DATA FROM S# BUCKET DOWNLOAD', data);
    if (data) {
      console.log('DATA COMING FROM AWS');
      console.log('FILENAME', fileName);
      console.log('DATA', data);
      const bufferData = data.Body;
      return res.send(Buffer.from(bufferData));
    }
    console.log('NO DATA');
  });
};

export { csv, getCsv };


async function fsWrite(filename, data) {
  fs.writeFile('../../public/uploads/filename1.csv', data, (err) => {
    if (err) {
      throw new Error(err);
    }
  });
}
