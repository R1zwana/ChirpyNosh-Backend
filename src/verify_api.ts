
// import { fetch } from 'undici';

const BASE_URL = 'http://localhost:3000/api';
let AUTH_TOKEN = '';
let PARTNER_TOKEN = '';
let RECIPIENT_TOKEN = '';
let CREATED_LISTING_ID = '';

async function runStep(name: string, fn: () => Promise<void>) {
    process.stdout.write(`Testing: ${name}... `);
    try {
        await fn();
        console.log('✅ PASS');
    } catch (error) {
        console.error('❌ FAIL');
        console.error('  Error:', error instanceof Error ? error.message : error);
        if (error instanceof Error && (error as any).data) {
            console.error('  Response Data:', JSON.stringify((error as any).data, null, 2));
        } else if (error instanceof Error && (error as any).response) {
            // console.error('  Response:', await (error as any).response.text());
        }
        process.exit(1);
    }
}

async function request(method: string, endpoint: string, body?: any, token?: string) {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        const error = new Error(`Request failed: ${response.status} ${response.statusText}`);
        (error as any).response = response;
        (error as any).data = data;
        throw error;
    }

    return data;
}

async function main() {
    console.log('🚀 Starting System Verification...\n');

    // 1. Health Check
    await runStep('Health Check', async () => {
        const data: any = await request('GET', '/health');
        if (!data.success) throw new Error('Health check failed');
    });

    // 2. Auth - Register Partner User
    await runStep('Register Partner User', async () => {
        const email = `partner_${Date.now()}@test.com`;
        const data: any = await request('POST', '/auth/register', {
            email,
            password: 'password123',
            name: 'Test Partner',
            role: 'PARTNER'
        });
        if (!data.data.token) throw new Error('No token returned');
        PARTNER_TOKEN = data.data.token;
    });

    // 3. Partner - Create Profile
    await runStep('Create Partner Profile', async () => {
        const data: any = await request('POST', '/partners', {
            name: 'Tasty Bakery',
            type: 'Bakery',
            address: '123 Baker St'
        }, PARTNER_TOKEN);
        if (data.data.name !== 'Tasty Bakery') throw new Error('Partner name mismatch');
    });

    // 4. Partner - Create Listing
    await runStep('Create Listing', async () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const data: any = await request('POST', '/listings', {
            title: 'Fresh Bread',
            description: 'Day old bread',
            category: 'Bakery',
            listingType: 'free',
            quantity: 5,
            pickupWindows: [tomorrow.toISOString()],
        }, PARTNER_TOKEN);

        CREATED_LISTING_ID = data.data.id;
        if (!CREATED_LISTING_ID) throw new Error('No listing ID returned');
    });

    // 5. Auth - Register Recipient User
    await runStep('Register Recipient User', async () => {
        const email = `recipient_${Date.now()}@test.com`;
        const data: any = await request('POST', '/auth/register', {
            email,
            password: 'password123',
            name: 'Test Recipient',
            role: 'RECIPIENT'
        });
        RECIPIENT_TOKEN = data.data.token;
    });

    // 6. Recipient - Create Profile
    await runStep('Create Recipient Profile', async () => {
        await request('POST', '/recipients', {
            orgName: 'Community Shelter',
            address: '456 Shelter Ave',
            capacity: 50
        }, RECIPIENT_TOKEN);
    });

    // 7. Listings - Get All (Public)
    await runStep('Get Listings', async () => {
        const data: any = await request('GET', '/listings');
        const found = data.data.find((l: any) => l.id === CREATED_LISTING_ID);
        if (!found) throw new Error('Created listing not found in feed');
    });

    // 8. Claims - Create Claim
    await runStep('Claim Listing', async () => {
        const data: any = await request('POST', '/claims', {
            listingId: CREATED_LISTING_ID,
            pickupWindow: 'Morning' // This might need adjustment based on how backend handles it
        }, RECIPIENT_TOKEN);
        if (data.data.status !== 'claimed') throw new Error('Claim status not claimed');
    });

    console.log('\n✨ All verification steps passed successfully!');
}

main().catch(console.error);
