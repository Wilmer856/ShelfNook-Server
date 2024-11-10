import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "@sequelize/core";
import { Attribute, AutoIncrement, NotNull, PrimaryKey, Unique} from "@sequelize/core/decorators-legacy";

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    declare user_id: CreationOptional<Number>;

    @Attribute(DataTypes.STRING)
    @NotNull
    @Unique
    declare firebase_uid: string

    @Attribute(DataTypes.STRING)
    @NotNull
    declare email: string;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare username: string

    @Attribute(DataTypes.DATE)
    declare createdAt: CreationOptional<Date>

    @Attribute(DataTypes.STRING)
    declare profilePicture : CreationOptional<String>

}
