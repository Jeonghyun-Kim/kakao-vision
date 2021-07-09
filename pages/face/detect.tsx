import { ChangeEvent, useCallback, useRef, useState } from 'react';
import NextImage from 'next/image';

import { useUI } from '@components/context';
import { Button } from '@components/ui';
import { uploadImage } from '@lib/upload-image';
import { loadImage } from '@lib/load-image';
import { fetcher } from '@lib/fetcher';

// types
import { LocalImage } from 'types/image';

export default function FaceDetectPage() {
  const [image, setImage] = useState<LocalImage | null>(null);
  // const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  // const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { showNoti } = useUI();

  const handleImageChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;
      setLoading(true);
      const file = e.target.files[0];

      try {
        const src = await new Promise<string>((resolve, reject) => {
          if (file.size > 19 * 1024 * 1024) {
            reject(
              `Exceeded maximum file isze (19MB). current file size: ${file.size / 1024 / 1024}`,
            );
          }
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(String(reader.result));
          };
          reader.readAsDataURL(file);
        });

        setImage(await loadImage(file));
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
        const key = await uploadImage(imageFile);

        await fetcher('/api/face/detect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key }),
        });

        showNoti({ title: `Successfully uploaded to s3 - ${key}` });
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
      <div>
        {image === null ? (
          '< select image file >'
        ) : (
          <NextImage src={image.previewSrc} layout="fixed" objectFit="contain" {...image.size} />
        )}
      </div>
    </div>
  );
}
