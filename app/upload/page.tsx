import Gallery from "@/components/gallery"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Uploader } from "@/components/upload/uploader"

export default function UploadPage() {
  return (
    <main className="mx-auto max-w-4xl p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold text-pretty">Image Upload</h1>
        <p className="text-muted-foreground mt-2">
          Drag and drop images, preview them client-side, select one as current, and upload to Cloudinary.
        </p>
      </header>

      <Card className="bg-card text-card-foreground">
        <CardHeader>
          <CardTitle className="text-balance">Upload images</CardTitle>
        </CardHeader>
        <CardContent>
          <Uploader />
        </CardContent>
      </Card>
      <div className="mt-6">
        <Gallery />
      </div>
    </main>
  )
}
