import dbConnect from "@/lib/db.config";
import { GalleryModel } from "@/models/gallery.model";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: Request) {
    try{
        await dbConnect();
        const gallery = await GalleryModel.findOne({current: true});
        return NextResponse.json(gallery);
    }catch(error){
        return NextResponse.json({error: error}, {status: 500});
    }
}