import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "@sequelize/core";
import { Attribute, BelongsTo, HasMany } from "@sequelize/core/decorators-legacy";
import { User } from "./User";
import { Book } from "./Book";


export default class UserBookCollections extends Model<InferAttributes<UserBookCollections>,InferCreationAttributes<UserBookCollections>> {
    @BelongsTo(() => User, 'user_id')
    declare user: number

    @BelongsTo(() => Book, 'book_id')
    declare book: number

    @Attribute(DataTypes.BOOLEAN)
    declare isFavorite: CreationOptional<boolean>

    @Attribute(DataTypes.STRING)
    declare status: string

    @Attribute(DataTypes.DATE)
    declare createdAt: CreationOptional<Date>
}
