
export async function POST(request) {
  try {
    const apiKey = process.env.IMGBB_API_KEY;

    if (!apiKey) {
      return Response.json(
        { message: "ImgBB API key is not configured." },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const image = formData.get("image");

    if (!image || typeof image === "string") {
      return Response.json(
        { message: "Please select an image." },
        { status: 400 }
      );
    }

    if (!image.type.startsWith("image/")) {
      return Response.json(
        { message: "Please select a valid image file." },
        { status: 400 }
      );
    }

    // Limit: 5 MB
    if (image.size > 5 * 1024 * 1024) {
      return Response.json(
        { message: "Image must be smaller than 5 MB." },
        { status: 400 }
      );
    }

    const uploadForm = new FormData();
    uploadForm.append("image", image);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        body: uploadForm,
        cache: "no-store",
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success || !result.data?.url) {
      return Response.json(
        { message: "ImgBB could not upload the image." },
        { status: 502 }
      );
    }

    return Response.json({
      success: true,
      url: result.data.url,
    });
  } catch (error) {
    console.error("Image upload error:", error);

    return Response.json(
      { message: "Something went wrong during upload." },
      { status: 500 }
    );
  }
}
