import AWS from "aws-sdk";
import { NextResponse } from "next/server";

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_KEY,
  region: process.env.S3_REGION,
});

function uploadToS3(file: File): Promise<AWS.S3.ManagedUpload.SendData> {
  return new Promise(async (resolve, reject) => {
    const params = {
      Bucket: process.env.S3_BUCKET as string,
      Key: `uploads/${file.name}`,
      Body: Buffer.from(await file.arrayBuffer()),
      ContentType: file.type,
    };

    s3.upload(params, (err: Error, data: AWS.S3.ManagedUpload.SendData) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const name = formData.get("name") as string;
    const symbol = formData.get("symbol") as string;
    const description = formData.get("description") as string;

    let imageUrl =
      "https://www.quicknode.com/guides/assets/images/BTE-634682de7f75c12eaa660f9288642fde.png";

    if (file && file.size > 0) {
      if (file.size > 2097152) {
        return NextResponse.json(
          { success: false, message: "Image to large" },
          { status: 422 }
        );
      }

      imageUrl = (await uploadToS3(file)).Location;
    }

    // validate name , symbol and description with regex text numbers and length
    const nameRegex = /^[a-zA-Z0-9\s]{1,10}$/;
    const symbolRegex = /^[a-zA-Z0-9]{1,8}$/;
    const descriptionRegex = /^[a-zA-Z0-9\s]{0,100}$/;

    if (!nameRegex.test(name)) {
      return NextResponse.json(
        { success: false, message: "Invalid name" },
        { status: 422 }
      );
    }

    if (!symbolRegex.test(symbol)) {
      return NextResponse.json(
        { success: false, message: "Invalid symbol" },
        { status: 422 }
      );
    }

    if (!descriptionRegex.test(description)) {
      return NextResponse.json(
        { success: false, message: "Invalid description" },
        { status: 422 }
      );
    }

    const tokenMeta = {
      name,
      symbol,
      description,
      image: imageUrl,
    };

    // Create file from tokenMeta object
    const metaFile = new File(
      [JSON.stringify(tokenMeta)],
      `${symbol}-metadata.json`,
      {
        type: "application/json",
        lastModified: Date.now(),
      }
    );

    // Upload token meta to S3
    const metaUrl = (await uploadToS3(metaFile)).Location;

    return NextResponse.json({ success: true, metaUrl });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { success: false, message: "Failed to upload image" },
      { status: 500 }
    );
  }
}
