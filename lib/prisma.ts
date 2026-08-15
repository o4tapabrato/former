import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { globalAgent } from 'http';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const pool: Pool = new Pool({
    connectionString: process.env.DATABASE_URI
});

const adapter = new PrismaPg(pool);

const db = globalForPrisma.prisma || new PrismaClient({ adapter });

if(process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = db;
}

