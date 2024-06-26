// import { Queue, Worker } from "bullmq";
import * as fs from 'fs/promises';
import * as path from 'path';
import * as process from 'process';
import { authenticate } from '@google-cloud/local-auth';
import { google } from 'googleapis';

// const que = new Queue("email-queue")
interface OAuth2Client {
    credentials: {
        refresh_token: string;
    }
}
interface messageData {
    messages: {
        id: string,
        threadId: string
    }[]
}
interface responseJson {
    data: {
        payload: {
            body:{
                data:string;
            }
            parts: {
                body: {
                    data: string;
                }
            }[]
        }
    }
}

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly', "https://www.googleapis.com/auth/gmail.send"];

const TOKEN_PATH = path.join(process.cwd(), './credentials/token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), './credentials/credentials.json');

async function loadSavedCredentialsIfExist() {
    try {
        const content = await fs.readFile(TOKEN_PATH);
        const credentials = JSON.parse(content.toString());
        return google.auth.fromJSON(credentials) as OAuth2Client;
    } catch (err) {
        return null;
    }
}


async function saveCredentials(client: OAuth2Client) {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content.toString());
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
        type: 'authorized_user',
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
}

export async function authorize() {
    let client: any = await loadSavedCredentialsIfExist();
    if (client) {
        return client;
    }
    client = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
        await saveCredentials(client);
    }
    return client;
}

export async function getMessages(auth: any):Promise<string | undefined> {
    const gmail = google.gmail({ version: 'v1', auth: auth });
    const res = await gmail.users.messages.list({
        userId: 'me',
        maxResults: 1
    });
    const data = res.data as messageData;
    if (!data.messages) {
        console.log('No messages found.');
        return;
    }
    data.messages.forEach(async (val) => {
        const res = await gmail.users.messages.get({
            userId: "me",
            id: val.id
        }) as responseJson
        const body = JSON.stringify(res.data.payload.parts[0]?.body?.data)     
        const messageBody  = Buffer.from(body,"base64").toString()
        return messageBody;
    })
}

// export const addItem = async (title: string, data: object | string) => {
//     try {
//         await que.add(title, data)
//         return true
//     } catch (err) {
//         return false
//     }
// }

// export const processItem = () => {
//     const worker = new Worker("email-queue", async (job) => {
//         //write process logic here
//         console.log(job.data)
//     })
// }

