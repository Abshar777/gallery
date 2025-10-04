import { IGallery } from "@/types";
import mongoose, { Schema, Document, model, models, Model } from "mongoose";



export const GallerySchema = new Schema<IGallery>({
    image: { type: String, required: true },
    current: { type: Boolean, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now },
});

export const GalleryModel: Model<IGallery> = mongoose.models.Gallery || mongoose.model<IGallery>("Gallery", GallerySchema);

