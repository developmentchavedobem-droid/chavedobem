"use server";

import { createSignedCloudinaryUpload } from "@/src/lib/cloudinary";
import { v4 as uuidv4 } from "uuid";

export async function getUploadUrl(fileName: string, fileType: string) {
  try {
    const fileExtension = fileName.split(".").pop()?.toLowerCase();
    const uniqueFileName = fileExtension ? `${uuidv4()}.${fileExtension}` : uuidv4();
    const upload = createSignedCloudinaryUpload({
      folder: "campanhas",
      publicId: uniqueFileName,
      fileType,
    });

    return {
      success: true as const,
      ...upload,
    };
  } catch {
    return { success: false as const, error: "Falha ao preparar upload" };
  }
}
