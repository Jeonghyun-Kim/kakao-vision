import type { NextApiRequest, NextApiResponse } from 'next';
import { HeadObjectCommand } from '@aws-sdk/client-s3';
import { withErrorHandler } from '@utils/with-error-handler';
import { s3Client } from '@utils/aws/s3';
import { isString } from '@utils/validator/common';
import { createError } from '@defines/errors';

const Bucket = process.env.AWS_BUCKET_NAME;
if (!Bucket) throw new Error('Missing AWS_BUCKET_NAME');

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { key } = req.body;

    if (!isString(key, { minLength: 10 })) {
      return res.status(400).json(createError('VALIDATION_FAILED'));
    }

    // FIXME: HeadObjectCommand Failed
    const command = new HeadObjectCommand({ Bucket, IfMatch: 'true', Key: key });
    const response = await s3Client.send(command);

    console.log(response);

    return res.json({ status: 'ok' });
  }
};

export default withErrorHandler(handler);
