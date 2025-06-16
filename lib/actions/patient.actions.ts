'use server'
import { BUCKET_ID, DATABASE_ID, databases, ENDPOINT, PATIENT_COLLECTION_ID, PROJECT_ID, storage, users } from "../appwrite.config"
import { ID,Query } from "node-appwrite"
import { parseStringify } from "../utils";
import { Client, Storage, InputFile } from "node-appwrite";


export const createUser = async (user: CreateUserParams) => {
  try {
    const newUser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name
    );

    // 👇 Register patient after successful user creation
    await databases.createDocument(
  DATABASE_ID!,
  PATIENT_COLLECTION_ID!,
  ID.unique(),
  {
    userId: newUser.$id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    privacyConsent: true,
  }
);

    return newUser;
  } catch (error: any) {
    if (error && error?.code === 409) {
      const documents = await users.list([
        Query.equal('email', [user.email])
      ]);

      return documents?.users[0];
    }
    throw error;
  }
};

export const getUser=async(userId:string) =>{
    try {
        const user= await users.get(userId)
        return parseStringify(user)
    } catch (error) {
        console.log(error)
    }
}


export const getPatient=async(userId:string) =>{
    try {
        const patients= await databases.listDocuments(
            DATABASE_ID!,
            PATIENT_COLLECTION_ID!,
            [
                Query.equal('userId',userId)
            ]

        )
        return parseStringify(patients.documents[0])
    } catch (error) {
        console.log(error)
    }
}


export const registerPatient = async ({ identificationDocument, ...patient }: RegisterUserParams) => {
  try {
    let file;

    if (identificationDocument) {
      // identificationDocument.get('blobFile') is a Blob (browser)
      const blobFile = identificationDocument.get('blobFile') as Blob;
      const fileName = identificationDocument.get('fileName') as string;

      // Convert Blob to Buffer
      const arrayBuffer = await blobFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const inputFile = InputFile.fromBuffer(buffer, fileName);
      file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
    }

    const newPatient = await databases.createDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      ID.unique(),
      {
        identificationDocumentId: file?.$id || null,
        identificationDocumentUrl: file
          ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view?project=${PROJECT_ID}`
          : 'no-document-uploaded',
        ...patient,
      }
    );

    return parseStringify(newPatient);
  } catch (error) {
    console.log(error);
  }
};

