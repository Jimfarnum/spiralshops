import { CloudantV1 } from "@ibm-cloud/cloudant";
import dotenv from "dotenv";
dotenv.config();

const client = CloudantV1.newInstance({
  serviceUrl: process.env.CLOUDANT_URL,
  authenticator: { apikey: process.env.CLOUDANT_APIKEY }
} as any);

export const cloudant = client;

async function ensureDb(name: string) {
  try {
    await client.getDatabaseInformation({ db: name });
  } catch {
    await client.putDatabase({ db: name });
  }
}

export async function initCloudant() {
  await ensureDb(process.env.CLOUDANT_DB!);
  await ensureDb(process.env.CLOUDANT_DB_INSIGHTS!);
}