import dotEnv from 'dotenv';

dotEnv.load();


const config = {
  port: process.env.PORT,
};

export default config;
