import mongoose, { Schema, Document, model, models, Model } from "mongoose";



export interface IGallery {
    _id: string;
    image:string;
    current:boolean;
    screenId: string;
    currentIndex: number;
    createdAt: Date;
    updatedAt: Date;
}

export const GallerySchema = new Schema<IGallery>({
    image: { type: String, required: true },
    current: { type: Boolean, required: true },
    currentIndex: { type: Number},
    screenId: { type: String, default:"1" },
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now },
},{ timestamps: true });



export const GalleryModel: Model<IGallery> = mongoose.models.Gallery1 || mongoose.model<IGallery>("Gallery1", GallerySchema);

