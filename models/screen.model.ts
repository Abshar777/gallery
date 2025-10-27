import mongoose, { Model, Schema } from "mongoose";

export interface IScreen {
    _id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

export const ScreenSchema = new Schema<IScreen>({
    name: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now },
});

export const ScreenModel: Model<IScreen> = mongoose.models.Screen || mongoose.model<IScreen>("Screen", ScreenSchema);
