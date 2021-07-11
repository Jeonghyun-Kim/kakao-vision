import { ChangeEvent, useCallback, useRef, useState } from 'react';
import NextImage from 'next/image';

import { useUI } from '@components/context';
import { Button } from '@components/ui';
import { loadImage } from '@lib/load-image';
import { requestFaceDetection } from '@lib/client/request-face-detection';

// types
import { LocalImage } from 'types/image';

export default function FaceDetectPage() {
  const [image, setImage] = useState<LocalImage | null>(null);
  const [loading, setLoading] = useState(false);
  // TODO: Kakao face detection result type
  const [result, setResult] = useState<any>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const { showNoti } = useUI();

  const handleImageChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;
      setLoading(true);
      const file = e.target.files[0];

      try {
        setImage(await loadImage(file, { maxSizeInBytes: 19 }));
      } catch (err) {
        showNoti({ variant: 'alert', title: err.message });
      } finally {
        setLoading(false);
        if (inputRef.current) inputRef.current.value = '';
      }
    },
    [showNoti],
  );

  const handleClearInput = useCallback(() => {
    setImage(null);
  }, []);

  const handleUpload = useCallback(
    async (imageFile: File) => {
      try {
        const resultData = await requestFaceDetection(imageFile);

        setResult(resultData);
        showNoti({ title: 'Success!' });
      } catch (err) {
        showNoti({ variant: 'alert', title: err.message });
      }
    },
    [showNoti],
  );

  if (loading) return <div>loading...</div>;

  return (
    <div>
      <h1>Face Detection</h1>
      <input
        ref={inputRef}
        className="hidden"
        type="file"
        accept="image/png, image/jpeg"
        onChange={handleImageChange}
      />
      <div className="space-x-4">
        <Button onClick={() => inputRef.current?.click()}>choose file</Button>
        <Button onClick={handleClearInput}>clear</Button>
        <Button
          onClick={() => {
            if (!image) return;
            handleUpload(image.file);
          }}
          disabled={!image || loading}
        >
          upload
        </Button>
      </div>
      <div className="whitespace-pre-line">
        {JSON.stringify(
          {
            ...image,
            file: { size: image?.file.size, name: image?.file.name },
            previewSrc: 'hidden',
          },
          undefined,
          2,
        )}
      </div>
      <div className="max-w-5xl">
        {image === null ? (
          '< select image file >'
        ) : (
          <NextImage
            src={image.previewSrc}
            layout="responsive"
            objectFit="contain"
            {...image.size}
          />
        )}
      </div>
      <div className="mt-12">{JSON.stringify(result)}</div>
    </div>
  );
}
