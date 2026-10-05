import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const DATA_DIR = path.join(process.cwd(), '.data');
const TOKEN_FILE = path.join(DATA_DIR, 'system-settings.json');
const LINKEDIN_KEY = 'linkedin_auth';
const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY =
  process.env.TOKEN_ENCRYPTION_KEY || 'default-dev-key-must-be-32-bytes!!'; // 32 bytes
const IV_LENGTH = 16;

export interface LinkedInTokens {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

// In-memory fallback for read-only filesystem environments (e.g., edge or serverless)
let inMemoryStore: Record<string, string> = {};

function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const key = Buffer.from(ENCRYPTION_KEY, 'utf-8').subarray(0, 32);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

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

function readStore(): Record<string, string> {
  try {
    if (fs.existsSync(TOKEN_FILE)) {
      const data = fs.readFileSync(TOKEN_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch {
    // fallback to memory
  }
  return inMemoryStore;
}

function writeStore(store: Record<string, string>): void {
  inMemoryStore = store;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(TOKEN_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.warn('System settings written to memory only:', err);
  }
}

/**
 * Retrieves and decrypts LinkedIn tokens from system settings
 */
export async function getLinkedInTokens(): Promise<LinkedInTokens | null> {
  try {
    const store = readStore();
    const encryptedValue = store[LINKEDIN_KEY];
    if (!encryptedValue) return null;

    try {
      const decryptedString = decrypt(encryptedValue);
      return JSON.parse(decryptedString) as LinkedInTokens;
    } catch (e) {
      console.error('Failed to decrypt tokens:', e);
      return null;
    }
  } catch (error) {
    console.error('Failed to fetch LinkedIn tokens:', error);
    return null;
  }
}

/**
 * Encrypts and saves LinkedIn tokens to system settings
 */
export async function saveLinkedInTokens(tokens: LinkedInTokens): Promise<void> {
  try {
    const encryptedValue = encrypt(JSON.stringify(tokens));
    const store = readStore();
    store[LINKEDIN_KEY] = encryptedValue;
    writeStore(store);
  } catch (error) {
    console.error('Failed to save LinkedIn tokens:', error);
    throw error;
  }
}

/**
 * Deletes LinkedIn tokens from system settings
 */
export async function deleteLinkedInTokens(): Promise<void> {
  try {
    const store = readStore();
    delete store[LINKEDIN_KEY];
    writeStore(store);
  } catch (error) {
    console.error('Failed to delete LinkedIn tokens:', error);
    throw error;
  }
}
