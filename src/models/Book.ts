import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "@sequelize/core"
import { Attribute, AutoIncrement, PrimaryKey} from "@sequelize/core/decorators-legacy"
import sequelize from "../database";

export class Book extends Model<InferAttributes<Book>, InferCreationAttributes<Book>> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    declare book_id: CreationOptional<Number>;
    
    
}