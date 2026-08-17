import { put, list, del } from "@vercel/blob"

export async function uploadImage(file: File) {
  const blob = await put(file.name, file, {
    access: "public",
    addRandomSuffix: true,
  })

  return blob.url
}

export async function uploadAudio(file: File) {
  const blob = await put(file.name, file, {
    access: "public",
    addRandomSuffix: true,
  })

  return blob.url
}

export async function deleteFile(url: string) {
  await del(url)
}

export async function listFiles(prefix?: string) {
  const { blobs } = await list({ prefix })
  return blobs
}
