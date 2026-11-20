import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  legacyApi: {
    baseUrl: string;
    timeout: number;
  };
}

const config: Config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  legacyApi: {
    baseUrl: process.env.LEGACY_API_URL || 'http://localhost:8000',
    timeout: parseInt(process.env.LEGACY_API_TIMEOUT || '30000', 10),
  },
};

export default config;
