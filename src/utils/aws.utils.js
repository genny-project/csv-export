import aws from 'aws-sdk';
import fs from 'fs';
import config from '../config';

const BUCKET_NAME = config.bucketName;
const IAM_USER_KEY = config.keyId;
const IAM_USER_SECRET = config.accessKey;
const message = {};

aws.config.update({ accessKeyId: IAM_USER_KEY, secretAccessKey: IAM_USER_SECRET });

const upload = (file1, callback) => {
  const file = file1;

  fs.readFile(file.path, (err, data) => {
    if (err) {
      message.error = ' File is not available';
      console.log('MESSAGE ERROR', message.error);
      throw err;
    }
    const s3bucket = new aws.S3({ params: { Bucket: BUCKET_NAME } });
    s3bucket.createBucket(() => {
      const params = {
        Key: `${file.originalFilename}.csv`, // file.name doesn't exist as a property
        Body: data,
      };

      try {
        s3bucket.upload(params, (err, data) => {
          // Whether there is an error or not, delete the temp file
          fs.unlink(file.path, (err) => {
            if (err) {
              console.error(err);
            }
            console.log('Temp File Delete');
          });

          console.log('PRINT FILE:', file);
          if (err) {
            console.log('ERROR MSG: ', err);
            // res.status(500).send(err);
          }

          message.data = data;
          callback(message);
          console.log(data, 'response back from aws');
          console.log('Successfully uploaded data');
        });
      } catch (err) {
        console.warn('Error uploading the file to S3 Bucket');
        console.warn('****************************** ERROR MESSAGE **********************');
        console.log(err);
      }
    });
  });
};


export default upload;
