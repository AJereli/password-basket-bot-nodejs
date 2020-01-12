import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addUserName1578871492237 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn('user', new TableColumn({
            name: 'tg_username',
            type: 'varchar',
            isNullable: true,
        }));

    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumn('user', 'tg_username');
    }

}
