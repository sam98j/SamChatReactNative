import * as FileSystem from 'expo-file-system';

export async function chunkFile(msgContent: string) {
  // file as daat url
  const convertedMsgContent = msgContent.startsWith('file') ? await readFileAsDataURL(msgContent) : msgContent;
  // file chunks
  const chunks = [];
  // chunk size
  const chunkSize = 972800;
  // start
  let start = 0;

  // loop throw the file
  while (start < convertedMsgContent!.length) {
    const end = Math.min(start + chunkSize, convertedMsgContent!.length);
    // chunk the file
    const chunk = convertedMsgContent!.slice(start, end);
    chunks.push(chunk);
    start += chunkSize;
  }
  return chunks;
}
// get file size
export function getFileSize(dataUrl: string) {
  // Remove the data URI prefix
  const base64String = dataUrl.split(',')[1];
  // Use TextDecoder instead of atob
  const decoder = new TextDecoder();
  const decodedString = decoder.decode(Uint8Array.from(atob(base64String), (c) => c.charCodeAt(0)));

  return String(Math.round(decodedString.length / 1024));
}

export async function readFileAsDataURL(uri: string, mimeType = 'audio/m4a') {
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const dataUrl = `data:${mimeType};base64,${base64}`;
    return dataUrl;
  } catch (error) {
    console.error('Failed to read file as Data URL:', error);
    return null;
  }
}
