
import { NextResponse } from 'next/server';

export async function GET() {
    const params = new URLSearchParams({
        response_type: 'code',
        client_id: process.env.LINKEDIN_CLIENT_ID || '',
        redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.agroventia.ca'}/api/auth/linkedin/callback`,
        state: 'random_state_string_for_security', // Ideally generate random string
        // Note: w_member_social scope requires LinkedIn Partner Program approval
        // Using basic scopes that work without special approval
        scope: 'openid profile email',
    });

    const url = `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
    return NextResponse.redirect(url);
}
