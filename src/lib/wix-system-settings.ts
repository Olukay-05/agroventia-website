
import { createClient, OAuthStrategy } from '@wix/sdk';
import { items } from '@wix/data';
import crypto from 'crypto';

// Initialize Wix Client for backend operations
// Ensure 'WIX_API_KEY' or proper OAuth setup is present for server-side access
const wixClient = createClient({
    modules: { items },
    auth: OAuthStrategy({
        clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID || '', // Fallback for types, validation elsewhere
    }),
});

const COLLECTION_ID = 'Import6'; // User's actual collection ID for System Settings
const LINKEDIN_KEY = 'linkedin_auth';
const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = process.env.TOKEN_ENCRYPTION_KEY || 'default-dev-key-must-be-32-bytes!!'; // 32 bytes
const IV_LENGTH = 16;

interface LinkedInTokens {
    access_token: string;
    refresh_token: string;
    expires_at: number;
}

// Encrypt Helper
function encrypt(text: string): string {
    const iv = crypto.randomBytes(IV_LENGTH);
    const key = Buffer.from(ENCRYPTION_KEY, 'utf-8').subarray(0, 32); // Ensure 32 bytes
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

// Decrypt Helper
function decrypt(text: string): string {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift()!, 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const key = Buffer.from(ENCRYPTION_KEY, 'utf-8').subarray(0, 32);
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

/**
 * Retrieves and decrypts LinkedIn tokens from Wix SystemSettings
 */
export async function getLinkedInTokens(): Promise<LinkedInTokens | null> {
    try {
        const result = await wixClient.items.query(COLLECTION_ID)
            .eq('key', LINKEDIN_KEY)
            .find();

        if (result.items.length === 0) return null;

        const encryptedValue = result.items[0].value;
        if (!encryptedValue) return null;

        try {
            const decryptedString = decrypt(encryptedValue);
            return JSON.parse(decryptedString) as LinkedInTokens;
        } catch (e) {
            console.error("Failed to decrypt tokens:", e);
            return null;
        }
    } catch (error) {
        console.error("Failed to fetch LinkedIn tokens from Wix:", error);
        return null;
    }
}

/**
 * Encrypts and saves LinkedIn tokens to Wix SystemSettings
 */
export async function saveLinkedInTokens(tokens: LinkedInTokens): Promise<void> {
    try {
        const encryptedValue = encrypt(JSON.stringify(tokens));

        // Check if item exists to decide between insert or update
        const result = await wixClient.items.query(COLLECTION_ID)
            .eq('key', LINKEDIN_KEY)
            .find();

        if (result.items.length > 0) {
            // Update existing
            const item = result.items[0];
            await wixClient.items.update(COLLECTION_ID, {
                _id: item._id,
                key: LINKEDIN_KEY,
                value: encryptedValue,
            });
        } else {
            // Insert new
            await wixClient.items.insert(COLLECTION_ID, {
                key: LINKEDIN_KEY,
                value: encryptedValue,
            });
        }
    } catch (error) {
        console.error("Failed to save LinkedIn tokens to Wix:", error);
        throw error;
    }
}
