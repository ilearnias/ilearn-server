import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    ForeignKey,
    BelongsTo,
  } from "sequelize-typescript";
import { Users } from "../USERS/users.entity";
  
  @Table({ tableName: "token_management", timestamps: false })
  export class TokenManagement extends Model<TokenManagement> {
    @PrimaryKey
    @Column({
      type: DataType.BIGINT,
      defaultValue: (max = 999999999999, min = 900000000000) =>
        Math.floor(Math.random() * (max - min + 1)) + min,
    })
    otp: number;
  
    @Column({
      type: DataType.INTEGER,
      allowNull: false,
      unique: true,
      defaultValue: (max = 599999999, min = 100000000) =>
        Math.floor(Math.random() * (max - min + 1)) + min,
    })
    fid: number;
  
    @ForeignKey(() => Users)
    @Column({
      type: DataType.UUID,
      allowNull: false,
    })
    user_id: string;
  
    @BelongsTo(() => Users)
    user_details: Users;
  }
  