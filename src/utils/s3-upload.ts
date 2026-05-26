export async function uploadToSignedS3Url(uploadUrl: string, file: File) {
  try {
    const response = await fetch(uploadUrl, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
      credentials: "omit",
    });

    if (!response.ok) {
      throw new Error(`S3 respondeu ${response.status} ao enviar o arquivo.`);
    }
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Falha ao enviar arquivo para o S3. Verifique a regra CORS do bucket para permitir PUT a partir de https://www.chavedobem.com."
      );
    }

    throw error;
  }
}
