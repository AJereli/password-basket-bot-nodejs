import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class userBasketRelation1578830479394 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: 'user_basket',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                },
                {
                    name: 'user_id',
                    type: 'int',
                    isNullable: false,
                },
                {
                    name: 'basket_id',
                    type: 'int',
                    isNullable: false,
                },
                {
                    name: 'permission',
                    type: 'varchar',
                    isNullable: false,
                },
            ],
            uniques: [
                {
                    columnNames: ['user_id', 'basket_id'],
                },
            ],
            foreignKeys: [
                {
                    columnNames: ['user_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: 'user',
                    onDelete: 'CASCADE',
                },
                {
                    columnNames: ['basket_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: 'basket',
                    onDelete: 'CASCADE',
                },
                {
                    columnNames: ['permission'],
                    referencedColumnNames: ['permission'],
                    referencedTableName: 'basket_permission',
                },
            ],
        }));

        await queryRunner.dropColumn('basket', 'user_id');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
