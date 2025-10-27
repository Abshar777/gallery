import dbConnect from "@/lib/db.config";
import { GalleryModel } from "@/models/gallery.model";
import { ScreenModel } from "@/models/screen.model";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const screen = searchParams.get('screen');
        if (!screen) {
            return NextResponse.json({ error: "Screen is required" }, { status: 400 });
        }
        const screenData = await ScreenModel.findOne({ name: screen });

        if (!screenData) {
            return NextResponse.json({ error: "Screen is required" }, { status: 400 });
        }
        const gallery = await GalleryModel.find({ current: true, screenId: screen }).sort({ currentIndex: 1 });
        return NextResponse.json(gallery.map((item) => item.image));
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}