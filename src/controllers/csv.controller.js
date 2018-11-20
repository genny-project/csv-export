import aws from 'aws-sdk';
import * as CSV from 'csv-string';
import path from 'path';
import uuid from 'uuid/v1';
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
  const csvString = req.body || null;
  if (csvString) {
    const check = csvString;
    try {
      const arr = CSV.parse(JSON.stringify(check));
      const filename = uuid();
      const csvWriter = createCsvWriter({
        header: arr[0],
        path: path.join(__dirname, `../../public/uploads/${filename}.csv`),
      });

      const records = arr;

      csvWriter.writeRecords(records) // returns a promise
        .then(() => {
          console.log('...File written on the disk');

          /* s3 upload begins here */
          const dummyFile = {};
          dummyFile.originalFilename = filename;
          dummyFile.path = path.join(__dirname, `../../public/uploads/${filename}.csv`);

          s3Upload(dummyFile, (message) => {
            if (message && message.data) {
              const url = message.data.key;
              return res.status(200).json({ url });
            }
            if (message && message.error) {
              const err = message.error;
              return res.status(200).json({ err });
            }
          });
        });
    } catch (err) {
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
    res.attachment(fileName);
    res.send(data.Body);
  });
};

export { csv, getCsv };
