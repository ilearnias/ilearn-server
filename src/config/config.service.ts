import { Injectable } from '@nestjs/common';
import { Dialect } from 'sequelize';
@Injectable()
export class ConfigurationService {
  get sequelizeOrmConfig() {
    console.log('process.env.DATABASE_HOST', process.env.S3_ACCESS_KEY_ID);
    return {
      dialect: process.env.DATABASE as Dialect,
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    };
  }
  get s3Config() {
    return {
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_KEY_ID,
      region: process.env.S3_REGION,
      signatureVersion: 'v4',
    };
  }

  get jwtConfig() {
    return {
      accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
      refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
      accessTokenExpiration: process.env.ACCESS_TOKEN_EXPIRY,
      refreshTokenExpiration: process.env.REFRESH_TOKEN_EXPIRY,
    };
  }
}
