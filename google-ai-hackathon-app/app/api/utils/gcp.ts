import { Storage } from "@google-cloud/storage";
import { base64ToJSON } from "@/app/utils/DataParsing";

// Creates GCP storage client
const getGCPStorageClient = () => {
    const gcpCredentialsJSON: any = base64ToJSON(process.env.GCP_SA_KEY_STRING!)
    const GcpStorageClient = new Storage({
        projectId: process.env.GCP_PROJECT_ID!,
        credentials: gcpCredentialsJSON
    });
    return GcpStorageClient;
}


// Function to upload file from specified path to destination path in GCP Cloud Storage Bucket
export const uploadFile = async (bucketName: string, currentFilePath: string, destinationFilePath: string) => {
    try {
        const GcpStorageClient = getGCPStorageClient();
        const options = {
            destination: destinationFilePath,
            preconditionOpts: { ifGenerationMatch: 0 },
        };
        await GcpStorageClient.bucket(bucketName).upload(currentFilePath, options);
        console.log(`Success uploading generated image to bucket.`);
        return { "sucess": true }
    } catch (error: any) {
        console.log(`Error uploading geenrated image to bucket ${error.message}.`);
        return { "error": error.message }
    }
}

// Function to generate signed url file for an object at a given path in GCP Cloud Storage Bucket
export const generateSignedUrlFile = async (bucketName: string, filePath: string) => {
    try {
        const GcpStorageClient = getGCPStorageClient();

        // Set file signing options
        const options: any = {
            version: 'v4',
            action: 'read',
            expires: Date.now() + 60 * 60 * 1000 * 30,
        };

        // Get a v4 signed URL for file at specified pathle
        const  url  = await GcpStorageClient
            .bucket(bucketName)
            .file(filePath)
            .getSignedUrl(options);

        return { "url": url[0] }

    } catch (error: any) {
        console.log(`Error generating signed url file: ${error.message}.`)
        return { "error": error.message }
    }
}