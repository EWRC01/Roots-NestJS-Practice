import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UsersDocument = Users & Document;

@Schema()
export class Users {
    @Prop({required: true})
    firstname: string;

    @Prop()
    lastname: string;

    @Prop({unique: true, required: true})
    username: string;

    @Prop({required: true})
    password: string;

    @Prop({unique:true, required:true})
    id: number;

}
export const UsersSchema = SchemaFactory.createForClass(Users);
