// Supabase Storage client
// TODO: Configure Supabase Storage for file uploads

export async function uploadFile(bucket: string, path: string, file: Buffer): Promise<string> {
  // TODO: Upload file to Supabase Storage
  throw new Error("Not implemented");
}

export async function getFileUrl(bucket: string, path: string): Promise<string> {
  // TODO: Get public/signed URL for file
  throw new Error("Not implemented");
}

export async function deleteFile(bucket: string, path: string): Promise<void> {
  // TODO: Delete file from Supabase Storage
  throw new Error("Not implemented");
}
