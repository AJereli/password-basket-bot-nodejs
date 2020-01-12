import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('message_record')
export class MessageRecordEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({name: 'message_id'})
  messageId: number;

  @Column({name: 'chat_id'})
  chatId: number;

  @Column({name: 'telegram_id'})
  telegramId: number;
}
