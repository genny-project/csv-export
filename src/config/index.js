import dotEnv from 'dotenv';

dotEnv.load();


const config = {
  port: process.env.PORT || 7777 ,
};

export default config;
