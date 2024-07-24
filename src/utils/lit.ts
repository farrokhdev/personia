import { Store } from './store';

export function blobToBase64(blob: any): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () =>
      resolve(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        reader.result?.replace("data:application/octet-stream;base64,", "")
      );
    reader.readAsDataURL(blob);
  });
}

export function buf2hex(buffer: any) { // buffer is an ArrayBuffer
  return [...new Uint8Array(buffer)].map(x => x.toString(16).padStart(2, '0')).join('');
}

export async function getAuthSig(store: Store) {
  const _authSig = await store.getItem("lit-auth-signature")
  const authSig = JSON.parse(_authSig ?? '');

  if(authSig && authSig != "") {
    return authSig;
  } else {
    throw new Error("User not authenticated to Lit Protocol for messages");
  }
}

export function decodeB64(b64String: string) {
  return new Uint8Array(Buffer.from(b64String, "base64"));
}
