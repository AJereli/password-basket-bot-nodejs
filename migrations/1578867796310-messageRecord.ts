import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class messageRecord1578867796310 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: 'message_record',
            columns: [
                {
                    name: 'id',
                    isPrimary: true,
                    isGenerated: true,
                    type: 'int',
                },
                {
                    name: 'message_id',
                    type: 'int',
                    isNullable: false,
                },
                {
                    name: 'chat_id',
                    type: 'int',
                    isNullable: false,
                },
                {
                    name: 'telegram_id',
                    type: 'int',
                    isNullable: false,
                },
            ],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('message_record');
    }

}
