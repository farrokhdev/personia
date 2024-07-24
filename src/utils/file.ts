import blobToBuffer from "blob-to-buffer";

export function MyBlobToBuffer(blob: Blob | undefined, callback: (error: any, buffer: Buffer | undefined) => void): void {
    if (blob == null) {
        callback(null, undefined)
    } else {
        blobToBuffer(blob, callback)
    }
}
