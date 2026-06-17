import crypto from "crypto";

export type CloudinaryResourceType = "image" | "raw";

export type SignedCloudinaryUpload = {
  uploadUrl: string;
  fields: Record<string, string>;
  resourceType: CloudinaryResourceType;
};

function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary nao configurado.");
  }

  return { cloudName, apiKey, apiSecret };
}

function signParams(params: Record<string, string>, apiSecret: string) {
  const payload = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return crypto.createHash("sha1").update(`${payload}${apiSecret}`).digest("hex");
}

export function getCloudinaryResourceType(fileType: string): CloudinaryResourceType {
  return fileType === "application/pdf" ? "raw" : "image";
}

export function createSignedCloudinaryUpload(params: {
  folder: string;
  publicId: string;
  fileType: string;
}): SignedCloudinaryUpload {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  const resourceType = getCloudinaryResourceType(params.fileType);
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signedParams = {
    folder: params.folder,
    public_id: params.publicId,
    timestamp,
  };

  return {
    uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
    resourceType,
    fields: {
      ...signedParams,
      api_key: apiKey,
      signature: signParams(signedParams, apiSecret),
    },
  };
}
