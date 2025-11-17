import dbConnect from "@/lib/db.config";
import { GalleryModel } from "@/models/gallery.model";
import { ScreenModel } from "@/models/screen.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const screenId = searchParams.get('screenId');
    if (!screenId) {
      return NextResponse.json({ error: "Screen ID is required" }, { status: 400 });
    }
    const screen = await ScreenModel.findOne({ name: screenId });
    if (!screen) {
      return NextResponse.json({ error: "Screen not found" }, { status: 404 });
    }
    const gallery = await GalleryModel.find({ screenId: screen.name });
    return NextResponse.json(gallery);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const body = await request.json();
    const screenId = searchParams.get('screenId');
    const multiple = searchParams.get('multiple');

    if (!screenId) {
      console.error("Screen ID is required");
      return NextResponse.json({ error: "Screen ID is required" }, { status: 400 });
    }
    const screen = await ScreenModel.findOne({ name: screenId });
    if (!screen) {

      return NextResponse.json({ error: "Screen not found" }, { status: 404 });
    }

    const gallery = await GalleryModel.create({
      image: body.image,
      current: false,
      screenId: screen.name as string,

    });
    return NextResponse.json(gallery);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}


export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const screenId = searchParams.get('screenId');
    if (!screenId) {
      return NextResponse.json({ error: "Screen ID is required" }, { status: 400 });
    }
    const screen = await ScreenModel.findOne({ name: screenId });
    if (!screen) {
      return NextResponse.json({ error: "Screen not found" }, { status: 404 });
    }
    const body = await request.json();
    const multiple = searchParams.get('multiple');
    let mutlipleQuery = {};
    if (multiple !== 'true' || !multiple) {

      await GalleryModel.updateMany({}, { current: false, currentIndex: null });


    } else {
      const lastIndex = await GalleryModel.findOne({ screenId: screen.name as string }, { currentIndex: -1 });

      mutlipleQuery = {
        currntIndex: lastIndex?.currentIndex ? lastIndex.currentIndex + 1 : 0,
      }
    }
    const alredyCurrent = await GalleryModel.findOne({ _id: body._id, current: true });
    if (alredyCurrent) {
      await GalleryModel.findOneAndUpdate({ _id: body._id }, { current: false });
    } else {
      await GalleryModel.findOneAndUpdate(
        { _id: body._id },
        { current: true, screenId: screen.name as string, ...mutlipleQuery },
        { new: true }
      );
    }
    console.log(alredyCurrent, alredyCurrent ? "true" : "false");



    const gallery = await GalleryModel.find({ screenId: screen.name as string, current: true });

    // ✅ Trigger socket event here
    const io = (global as any).io;
    if (io) {
      io.emit(`galleryUpdated-${screen.name}`, gallery.map((item) => item.image));
      console.log(`📡 Emitted galleryUpdated-${screen.name} event`);
    } else {
      console.log(`⚠️ Socket.IO not initialized for screen ${screen.name}`);
    }

    return NextResponse.json(gallery);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}


export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    await GalleryModel.findOneAndDelete({ _id: body.id });
    return NextResponse.json({ message: "Gallery deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
