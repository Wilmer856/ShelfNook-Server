import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "@sequelize/core"
import { Attribute, AutoIncrement, NotNull, PrimaryKey} from "@sequelize/core/decorators-legacy"

export class Book extends Model<InferAttributes<Book>, InferCreationAttributes<Book>> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    declare book_id: CreationOptional<Number>;

    @Attribute(DataTypes.STRING)
    declare google_books_id: string

    @Attribute(DataTypes.STRING)
    @NotNull
    declare title: string

    @Attribute(DataTypes.STRING)
    @NotNull
    declare author: string

    @Attribute(DataTypes.STRING)
    declare genre: string

    @Attribute(DataTypes.INTEGER)
    declare publishedYear: Number

    @Attribute(DataTypes.STRING)
    declare description: string
}
