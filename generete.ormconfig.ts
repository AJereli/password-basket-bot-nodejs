import {config} from 'dotenv';
import * as fs from 'fs';

config();

const ormconfigjson = `
{
    "type": "posgres",
    "host": "${process.env.DB_HOST}",
    "port": ${process.env.DB_PORT},
    "username": "${process.env.DB_USER}",
    "password": "${process.env.DB_PASS}",
    "database": "${process.env.DB_NAME}",
    "migrations": ["migration/*.ts"],
    "cli": {
        "migrationsDir": "migration"
    }
}
`

fs.writeFileSync('ormconfig.json', ormconfigjson);