
import { NextResponse } from 'next/server';
import { saveLinkedInTokens } from '@/lib/wix-system-settings';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
        return NextResponse.json({ error: `LinkedIn Auth Error: ${error}` }, { status: 400 });
    }

    if (!code) {
        return NextResponse.json({ error: 'Missing authorization code' }, { status: 400 });
    }

    try {
        // Exchange Code for Token
        const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.agroventia.ca'}/api/auth/linkedin/callback`;
        const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: redirectUri,
                client_id: process.env.LINKEDIN_CLIENT_ID || '',
                client_secret: process.env.LINKEDIN_CLIENT_SECRET || '',
            }),
        });

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok) {
            throw new Error(tokenData.error_description || 'Failed to exchange token');
        }

        // Save tokens securely to Wix
        await saveLinkedInTokens({
            access_token: tokenData.access_token,
            refresh_token: tokenData.refresh_token, // LinkedIn v2 returns this for w_member_social
            expires_at: Date.now() + (tokenData.expires_in * 1000),
        });

        // Redirect back to Admin Dashboard
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.agroventia.ca'}/admin/blog?success=true`);

    } catch (err: any) {
        console.error('LinkedIn Callback Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
