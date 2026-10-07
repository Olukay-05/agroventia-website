
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const redirectUri = `${new URL(request.url).origin}/api/auth/linkedin/callback`;

    // Log for debugging
    console.log('LinkedIn Client ID:', process.env.LINKEDIN_CLIENT_ID ? 'Set' : 'Missing');
    console.log('Redirect URI:', redirectUri);

    // Try with just r_liteprofile and w_member_social first
    // These are the traditional scopes for "Share on LinkedIn" product
    const params = new URLSearchParams({
        response_type: 'code',
        client_id: process.env.LINKEDIN_CLIENT_ID || '',
        redirect_uri: redirectUri,
        state: 'random_state_string_for_security',
        // Using OpenID Connect scopes for modern LinkedIn apps
        scope: 'openid profile email w_member_social',
    });

    const url = `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
    console.log('Redirecting to:', url);
    return NextResponse.redirect(url);
}
