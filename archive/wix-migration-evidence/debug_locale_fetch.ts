
import dotenv from 'dotenv';
dotenv.config();
dotenv.config({ path: '.env.local' });

const WIX_API_TOKEN = process.env.WIX_API_TOKEN;
const WIX_SITE_ID = process.env.WIX_SITE_ID;
const WIX_API_BASE_URL = process.env.WIX_API_BASE_URL || 'https://www.wixapis.com/wix-data/v2/items';
const COLLECTION = 'ContactContent'; // Using ContactContent as it's used in Footer

console.log('Env Check:', {
    hasToken: !!WIX_API_TOKEN,
    hasSiteId: !!WIX_SITE_ID,
    siteId: WIX_SITE_ID
});

async function fetchWithLocale(locale: string) {
    console.log(`\nTesting locale: ${locale}`);
    const url = `${WIX_API_BASE_URL}/query`;

    // Construct body exactly as we did in wix-api.service.ts
    const body = {
        dataCollectionId: COLLECTION,
        includeReferencedItems: ['*'],
        returnTotalCount: true,
        cursorPaging: {
            limit: 1,
        },
        appOptions: {
            locale
        }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${WIX_API_TOKEN}`,
                'Content-Type': 'application/json',
                'wix-site-id': WIX_SITE_ID || '',
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            console.error(`Error ${response.status}: ${await response.text()}`);
            return;
        }

        const data = await response.json();
        const item = data.dataItems[0]?.data;

        if (item) {
            console.log('Fetched Item Data (Subset):');
            console.log(JSON.stringify({
                businessAddress: item.businessAddress,
                businessHours: item.businessHours
            }, null, 2));
        } else {
            console.log('No items returned');
        }

    } catch (e) {
        console.error('Fetch error:', e);
    }
}

async function run() {
    if (!WIX_API_TOKEN || !WIX_SITE_ID) {
        console.error('Missing WIX_API_TOKEN or WIX_SITE_ID env vars');
        return;
    }

    // Test 1: fr-CA
    await fetchWithLocale('fr-CA');

    // Test 2: fr
    await fetchWithLocale('fr');

    // Test 3: en (Control)
    await fetchWithLocale('en');
}

run();
