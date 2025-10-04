import dbConnect from "@/lib/db.config";
import { GalleryModel } from "@/models/gallery.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: Request) {
    try{
        await dbConnect();
        const gallery = await GalleryModel.find();
        return NextResponse.json(gallery);
    }catch(error){
        return NextResponse.json({error: error}, {status: 500});
    }
}

export async function POST(request: NextRequest) {
    try{
        await dbConnect();
        const body = await request.json();
        const gallery = await GalleryModel.create({
            image: body.image,
            current:false,
        });
        return NextResponse.json(gallery);
    }catch(error){
        return NextResponse.json({error: error}, {status: 500});
    }
}


export async function PUT(request: NextRequest) {
    try{
        await dbConnect();
        const body = await request.json();
        await GalleryModel.updateMany({}, {current: false});
        const gallery = await GalleryModel.findByIdAndUpdate(body._id, {current: true});
        return NextResponse.json(gallery);
    }catch(error){
        return NextResponse.json({error: error}, {status: 500});
    }
}