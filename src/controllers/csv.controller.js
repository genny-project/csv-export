import aws from 'aws-sdk';
import * as CSV from 'csv-string';
import path from 'path';
import uuid from 'uuid/v1';

import s3Upload from '../utils/aws.utils';
import config from '../config';


const BUCKET_NAME = config.bucketName;
const IAM_USER_KEY = config.keyId;
const IAM_USER_SECRET = config.accessKey;

aws.config.update({ accessKeyId: IAM_USER_KEY, secretAccessKey: IAM_USER_SECRET });
const s3bucket = new aws.S3({ params: { Bucket: BUCKET_NAME } });

const createCsvWriter = require('csv-writer').createArrayCsvWriter;

const csv = (req, res) => {
  const { csvString } = req.body || null;

  console.log('request from the body', csvString, '\n \n');
  if (csvString || csvString !== '' || csvString !== undefined || csvString !== null || csvString !== 'undefined') {
    try {
      // get the  array out of the string supplieed
      const parsedCSV = CSV.parse(csvString);
      const arr = parsedCSV;

      // Generate a unique filename for every filename we are creating
      const filename = uuid();

      // seperate the data into header and body
      // the first row in an array is an header in csv
      // rest of them are body part in CSV
      const header = arr[0];
      const body = arr.splice(1);

      console.log(header);
      console.log(body);

      // write header data
      const csvWriter = createCsvWriter({
        header,
        path: path.join(__dirname, `../../public/uploads/${filename}.csv`),
      });

      // write the body data

      csvWriter.writeRecords(body) // returns a promise
        .then(() => {
          console.log('...File written on the disk');
          console.log('s3 upload begins');
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
      console.log('Error While writing csv');
      console.log(err);
      res.status(500);
      return res.json({ message: 'Error writing file ' });
    }
  } else {
    return res.status(500).json({ message: "String not found or doesn't exists" });
  }
};


// method for downloading csv file from the filename provided
const getCsv = (req, res) => {
  const { fileName } = req.params;
  console.log(fileName);

  // configure bucket options
  const options = {
    Bucket: config.bucketName,
    Key: fileName,
  };

  // find the data in s3
  s3bucket.getObject(options, (err, data) => {
    if (err) {
      console.log(err.stack);
      return res.json({ message: 'Error while getting data from s3 bucket' });
    }

    // res.attachment(data.body);rs
    console.log('DATA FROM S# BUCKET DOWNLOAD', data);

    // if existssend the data as an attachment
    try {
      if (data) {
        console.log('DATA COMING FROM AWS');
        console.log('FILENAME', fileName);
        console.log('DATA', data);
        const bufferData = data.Body;
        return res.send(Buffer.from(bufferData)); // using new buffer API
      }
    } catch (err) {
      console.log('No data received from s3 please try again');
      return res.json({ message: ' No data received from s3' });
    }


    console.log('NO DATA');
  });
};

export { csv, getCsv };
