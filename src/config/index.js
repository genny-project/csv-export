import dotEnv from 'dotenv';

dotEnv.load();


const config = {
  port: process.env.PORT || 7777,
  bucketName: process.env.BUCKET_NAME || null,
  accessKey: process.env.SECRET_ACCESS_KEY || null,
  keyId: process.env.ACCESS_KEY_ID || null,
  awsRegion: process.env.REGION,
  url: process.env.URL,
};

export default config;
