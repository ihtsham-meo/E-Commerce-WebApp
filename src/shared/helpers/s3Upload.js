import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectsCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

class AwsService {
    constructor() {
        const region = process.env.AWS_REGION;
        const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
        const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

        if (!region || !accessKeyId || !secretAccessKey) {
            throw new Error(
                'AWS configuration is missing. Please check your environment variables.'
            );
        }

        this.s3Client = new S3Client({
            region,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
        });

        this.bucket = process.env.AWS_S3_BUCKET;
        if (!this.bucket) {
            throw new Error('AWS_S3_BUCKET is not defined in .env');
        }
    }

    async uploadFile(file, userId, folder) {
        const key = `${folder}/${userId}/${Date.now()}-${file.originalname}`;
        const params = {
            Bucket: this.bucket,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        };

        try {
            await this.s3Client.send(new PutObjectCommand(params));
            const signedUrl = await this.getSignedUrl(key);
            return { key, url: signedUrl };
        } catch (error) {
            throw new Error(`Failed to upload file to S3: ${error.message}`);
        }
    }

    async updateFile(file, key) {
        const params = {
            Bucket: this.bucket,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        };

        try {
            await this.s3Client.send(new PutObjectCommand(params));
            const signedUrl = await this.getSignedUrl(key);
            return { key, url: signedUrl };
        } catch (error) {
            throw new Error(`Failed to update file in S3: ${error.message}`);
        }
    }

    async deleteFiles(keys) {
        const deleteParams = {
            Bucket: this.bucket,
            Delete: {
                Objects: keys.map((key) => ({ Key: key })),
                Quiet: false,
            },
        };

        try {
            await this.s3Client.send(new DeleteObjectsCommand(deleteParams));
        } catch (error) {
            throw new Error(`Failed to delete files from S3: ${error.message}`);
        }
    }

    async deleteFile(key) {
        return this.deleteFiles([key]);
    }

    async getSignedUrl(key, expiresIn = 604800) {
        const command = new GetObjectCommand({
            Bucket: this.bucket,
            Key: key,
        });

        try {
            const signedUrl = await getSignedUrl(this.s3Client, command, {
                expiresIn,
            });
            return signedUrl;
        } catch (error) {
            throw new Error(`Failed to generate signed URL: ${error.message}`);
        }
    }

    async getMultipleSignedUrls(keys, expiresIn = 604800) {
        try {
            const urlPromises = keys.map(async (key) => {
                const url = await this.getSignedUrl(key, expiresIn);
                return { key, url };
            });
            return await Promise.all(urlPromises);
        } catch (error) {
            throw new Error(`Failed to generate multiple signed URLs: ${error.message}`);
        }
    }

    async fileExists(key) {
        try {
            await this.s3Client.send(
                new GetObjectCommand({
                    Bucket: this.bucket,
                    Key: key,
                })
            );
            return true;
        } catch (error) {
            if (error.name === 'NoSuchKey' || error.$metadata?.httpStatusCode === 404) {
                return false;
            }
            throw error;
        }
    }
}

export default new AwsService();
