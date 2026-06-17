import type { SignedCloudinaryUpload } from "@/src/lib/cloudinary";

type CloudinaryUploadResponse = {
  secure_url?: string;
  error?: {
    message?: string;
  };
};

export async function uploadToSignedCloudinary(upload: SignedCloudinaryUpload, file: File) {
  const formData = new FormData();

  for (const [key, value] of Object.entries(upload.fields)) {
    formData.append(key, value);
  }

  formData.append("file", file);

  const response = await fetch(upload.uploadUrl, {
    method: "POST",
    body: formData,
  });

  const data = (await response.json()) as CloudinaryUploadResponse;

  if (!response.ok || !data.secure_url) {
    throw new Error(data.error?.message || `Cloudinary respondeu ${response.status} ao enviar o arquivo.`);
  }

  return data.secure_url;
}
