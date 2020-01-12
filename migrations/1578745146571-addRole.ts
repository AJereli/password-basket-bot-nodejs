import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class addRole1578745146571 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: 'basket_permission',
            columns: [
                {
                    isPrimary: true,
                    isUnique: true,
                    name: 'permission',
                    type: 'varchar',
                },
            ],
        }));

        const rolesForInsert = [
            {
                permission: 'write',
            },
            {
                permission: 'read',
            },
        ];
        await queryRunner.commitTransaction();
        await queryRunner.startTransaction();
        for (const role of rolesForInsert) {
            await queryRunner.connection.query(`INSERT INTO basket_permission (permission) VALUES (\'${role.permission}\')`);
        }

    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('basket_permission');
    }

}
