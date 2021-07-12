import type { NextApiRequest, NextApiResponse } from 'next';
import { createError } from '@defines/errors';

const referrerWhitelsit = ['http://localhost:3000', 'https://kakao-vision.kay.kr'];

export function checkReferrer(req: NextApiRequest, res: NextApiResponse) {
  for (const referrer of referrerWhitelsit) {
    if (req.headers.referer?.includes(referrer)) {
      return;
    }
  }

  res.status(403);
  throw createError('NO_PERMISSION');
}
