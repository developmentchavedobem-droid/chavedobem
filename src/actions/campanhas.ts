"use server"

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "@/src/lib/s3";
import { v4 as uuidv4 } from "uuid";

export async function getUploadUrl(fileName: string, fileType: string) {
  try {
    const fileExtension = fileName.split(".").pop();
    const uniqueFileName = `${uuidv4()}.${fileExtension}`;
    const key = `campanhas/${uniqueFileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
    });

    // Gerar a URL assinando apenas o host para simplificar o preflight
    const uploadUrl = await getSignedUrl(s3Client, command, { 
      expiresIn: 60,
      signableHeaders: new Set(["host"]), 
    });

    // HACK DEFINITIVO: Remove qualquer rastro de checksum da URL String
    // O navegador não consegue processar esses campos no preflight do CORS.
    const cleanUrl = uploadUrl
      .split('&')
      .filter(param => !param.includes('x-amz-checksum') && !param.includes('x-amz-sdk-checksum'))
      .join('&');

    return { 
      success: true, 
      uploadUrl: cleanUrl, 
      key, 
      publicUrl: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}` 
    };

  } catch (error) {
    return { success: false, error: "Falha ao preparar upload" };
  }
}