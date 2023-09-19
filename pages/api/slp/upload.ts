import S3 from 'aws-sdk/clients/s3';
import { NextApiRequest, NextApiResponse } from 'next';

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_S3_BUCKET } =
  process.env;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const s3 = new S3({
      signatureVersion: 'v4',
      region: AWS_REGION,
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    });

    const { fileName, fileType, groupName } = req.query;

    const preSignedUrl = await s3.getSignedUrl('putObject', {
      Bucket: AWS_S3_BUCKET,
      Key: `${groupName}/${fileName}`,
      ContentType: fileType,
      Expires: 5 * 60,
    });

    res.status(200).json({ preSignedUrl });
  }
}
