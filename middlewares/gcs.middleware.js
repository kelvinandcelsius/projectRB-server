import { Storage } from '@google-cloud/storage'
import { DocumentProcessorServiceClient, v1beta2 as DocumentUnderstandingServiceClient } from '@google-cloud/documentai'

const storage = new Storage()
const client = new DocumentProcessorServiceClient()

const generateUploadUrl = async (bucketName, fileName) => {
    const bucket = storage.bucket(bucketName)
    const file = bucket.file(fileName)

    const options = {
        version: 'v4',
        action: 'write',
        expires: Date.now() + 15 * 60 * 1000,
    }

    const [url] = await file.getSignedUrl(options)
    return url
}

const analyzeText = async (bucketName, key) => {

    const formattedName = client.processorPath(process.env.PROJECT_ID, process.env.LOCATION, process.env.DOCAI_PROCESSOR_ID)

    const request = {
        name: formattedName,
        gcsDocument: {
            gcsUri: `gs://${bucketName}/${key}`,
            mimeType: 'application/pdf',

        },
    }

    const [result] = await client.processDocument(request)
    return result.document
}



// const client2 = new DocumentUnderstandingServiceClient();

// async function analyzeDocument(projectId, location, inputUri) {
//     const parent = `projects/${projectId}/locations/${location}`;

//     const request = {
//         parent,
//         inputConfig: {
//             gcsSource: {
//                 uri: inputUri,
//             },
//             mimeType: 'application/pdf',
//         },
//         entityExtractionParams: {
//             enabled: true,
//             model: 'builtin/entity_extraction',
//         },
//     };

//     const [operation] = await client2.processDocument(request);

//     const [response] = await operation.promise();

//     const entities = response.entities.filter(entity => entity.type === 'DATE');

//     const expiryDate = entities.find(entity => entity.mentionText.includes('expiry date'));

//     console.log(`Expiry date: ${expiryDate.normalizedValue.text}`);
// }

// analyzeDocument('your-project-id', 'your-location', 'gs://your-bucket/your-document.pdf');

export { generateUploadUrl, analyzeText }