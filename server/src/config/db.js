import 'dotenv/config';
import pkgClient from '@prisma/client';
const { PrismaClient } = pkgClient;

import { PrismaPg } from '@prisma/adapter-pg';


import pg from 'pg';
const { Pool } = pg;

// 1. Create a connection pool using the native pg driver
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// 2. Create the Prisma adapter for PostgreSQL
const adapter = new PrismaPg(pool);

// 3. Initialize Prisma Client with the driver adapter
const prisma = new PrismaClient({ adapter });

export default prisma;
