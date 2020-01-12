import { Column, Entity, PrimaryColumn } from 'typeorm';

export enum BasketPermissionEnum {
  write = 'write',
  read = 'read',
}

@Entity('basket_permission')
export class BasketPermissionEntity {
  @Column({
    name: 'permission',
    primary: true,
    type: 'enum',
    enum: BasketPermissionEnum,
    default: BasketPermissionEnum.read,
  })
  permission: BasketPermissionEnum;
}
