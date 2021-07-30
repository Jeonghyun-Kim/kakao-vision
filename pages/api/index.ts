import type { NextApiRequest, NextApiResponse } from 'next';
import { withErrorHandler } from '@utils/with-error-handler';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    res.setHeader('Set-Cookie', 'kay.test=hello-world; path=/; httpOnly; secure;');
    return res.json({ status: 'ok' });
  }
};

export default withErrorHandler(handler);
