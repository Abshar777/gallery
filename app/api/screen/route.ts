import dbConnect from "@/lib/db.config";
import { ScreenModel } from "@/models/screen.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: Request) {
    try{
        await dbConnect();
        const screens = await ScreenModel.find();
        return NextResponse.json(screens);
    }catch(error){
        return NextResponse.json({success: false, error: error}, {status: 500});
    }
}

export async function POST(request: NextRequest) {
    try{
        await dbConnect();
        const screens = await ScreenModel.find();
        const screen = await ScreenModel.create({
            name: `${screens.length + 1}`,
        });
        return NextResponse.json({success: true, message: "Screen created successfully", screen: screen});
    }catch(error){
        console.log(error);
        return NextResponse.json({success: false, error: error}, {status: 500});
    }
}   


