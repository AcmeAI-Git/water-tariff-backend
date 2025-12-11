import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getDatabaseConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '1234',
  database: process.env.DB_DATABASE || 'water_tariff',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
  ssl: process.env.DB_HOST?.includes('render.com')
    ? { rejectUnauthorized: false }
    : false,
  extra: {
    connectionTimeoutMillis: 10000,
    query_timeout: 10000,
  },
});
