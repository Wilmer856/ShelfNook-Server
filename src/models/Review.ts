import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "@sequelize/core";
import { Attribute, BelongsTo, HasMany } from "@sequelize/core/decorators-legacy";
import { User } from "./User";
import { Book } from "./Book";


export default class Review extends Model<InferAttributes<Review>, InferCreationAttributes<Review>> {
    @BelongsTo(() => User, 'user_id')
    declare user: number

    @BelongsTo(() => Book, 'book_id')
    declare book: number

    @Attribute(DataTypes.INTEGER)
    declare rating: number

    @Attribute(DataTypes.STRING)
    declare review: string

    @Attribute(DataTypes.DATE)
    declare createdAt: CreationOptional<Date>
}