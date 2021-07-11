import { fetcher } from '@lib/fetcher';
import { uploadImage } from '@lib/upload-image';

export async function requestFaceDetection(file: File) {
  const key = await uploadImage(file);

  // TODO: specify result type
  return await fetcher('/api/face/detect', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key }),
  });
}
