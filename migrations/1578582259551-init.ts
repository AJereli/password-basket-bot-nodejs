import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class init1578582259551 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: 'user',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                },
                {
                    name: 'name',
                    type: 'varchar',
                },
                {
                    name: 'telegram_id',
                    type: 'int',
                },
                {
                    name: 'created_date',
                    type: 'date',
                    default: 'now()',
                },
                {
                    name: 'updated_date',
                    type: 'date',
                    default: 'now()',
                },
            ],
            uniques: [
                {
                    columnNames: ['telegram_id'],
                },
            ],
        }), true);

        await queryRunner.createTable(new Table({
            name: 'basket',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                },
                {
                    name: 'title',
                    type: 'varchar',
                },
                {
                    name: 'description',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'user_id',
                    type: 'int',
                },
                {
                    name: 'created_date',
                    type: 'date',
                    default: 'now()',
                },
                {
                    name: 'updated_date',
                    type: 'date',
                    default: 'now()',
                },
            ],
            uniques: [
                {
                    columnNames: ['user_id', 'title'],
                },
            ],
            foreignKeys: [
                {
                    columnNames: ['user_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: 'user',
                    onDelete: 'CASCADE',
                },
            ],
        }));

        await queryRunner.createTable(new Table({
            name: 'credentials',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                },
                {
                    name: 'title',
                    type: 'varchar',
                },
                {
                    name: 'login',
                    type: 'varchar',
                },
                {
                    name: 'password',
                    type: 'varchar',
                },
                {
                    name: 'basket_id',
                    type: 'int',
                },
                {
                    name: 'created_date',
                    type: 'date',
                    default: 'now()',
                },
                {
                    name: 'updated_date',
                    type: 'date',
                    default: 'now()',
                },
            ],
            // uniques: [
            //     {
            //         columnNames: ['basket_id', 'title'],
            //     },
            // ],
            foreignKeys: [
                {
                    columnNames: ['basket_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: 'basket',
                    onDelete: 'CASCADE',
                },
            ],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('credentials');
        await queryRunner.dropTable('basket');
        await queryRunner.dropTable('user');

    }

}
