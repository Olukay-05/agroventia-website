
import { NextResponse } from 'next/server';
import { getLinkedInTokens, saveLinkedInTokens } from '@/lib/wix-system-settings';

export async function POST(request: Request) {
    try {
        // 1. Get Stored Tokens
        const tokens = await getLinkedInTokens();
        if (!tokens) {
            return NextResponse.json({ error: 'LinkedIn not connected. Please connect in Admin Dashboard.' }, { status: 401 });
        }

        let { access_token, refresh_token, expires_at } = tokens;

        // 2. Check Expiry & Refresh if Needed
        // Refresh if within 5 minutes of expiry or already expired
        if (Date.now() > expires_at - (5 * 60 * 1000)) {
            console.log('LinkedIn Token expired or attempting refresh...');
            const refreshResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    grant_type: 'refresh_token',
                    refresh_token: refresh_token,
                    client_id: process.env.LINKEDIN_CLIENT_ID || '',
                    client_secret: process.env.LINKEDIN_CLIENT_SECRET || '',
                }),
            });

            const refreshData = await refreshResponse.json();

            if (!refreshResponse.ok) {
                console.error('Failed to refresh LinkedIn Token', refreshData);
                return NextResponse.json({ error: 'Failed to refresh LinkedIn session. Please reconnect.' }, { status: 401 });
            }

            // Update local variables and store new tokens
            access_token = refreshData.access_token;
            refresh_token = refreshData.refresh_token || refresh_token; // Sometimes refresh token is not rotated
            expires_at = Date.now() + (refreshData.expires_in * 1000);

            await saveLinkedInTokens({ access_token, refresh_token, expires_at });
            console.log('LinkedIn Token refreshed and saved.');
        }

        // 3. Prepare LinkedIn Post Payload
        const body = await request.json();
        const { title, excerpt, slug } = body; // Simplified payload for now

        // Retrieve LinkedIn Person URN (needed for author)
        // Retrieve LinkedIn Person URN (needed for author)
        // With OIDC scopes (openid profile), we use the /v2/userinfo endpoint
        const profileResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
            headers: { 'Authorization': `Bearer ${access_token}` }
        });

        if (!profileResponse.ok) {
            console.error('Failed to fetch LinkedIn Profile:', await profileResponse.text());
            return NextResponse.json({ error: 'Failed to fetch LinkedIn Profile' }, { status: 500 });
        }

        const profileData = await profileResponse.json();
        const authorUrn = `urn:li:person:${profileData.sub}`; // 'sub' is the member ID in OIDC
        // For Organization/Company Pages, author should be `urn:li:organization:${id}`  

        const postPayload = {
            author: authorUrn,
            lifecycleState: 'PUBLISHED',
            specificContent: {
                'com.linkedin.ugc.ShareContent': {
                    shareCommentary: {
                        text: `${excerpt}\n\nRead more: ${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.agroventia.ca'}/blog/${slug}`
                    },
                    shareMediaCategory: 'NONE', // Or 'ARTICLE' if we want rich link preview
                }
            },
            visibility: {
                'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
            }
        };

        // 4. Post to LinkedIn
        const shareResponse = await fetch('https://api.linkedin.com/v2/ugcPosts', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postPayload)
        });

        const shareData = await shareResponse.json();

        if (!shareResponse.ok) {
            console.error('LinkedIn Share API Error:', shareData);

            // Handle Duplicate Content Error specifically
            if (shareData.message && shareData.message.includes('Content is a duplicate')) {
                return NextResponse.json({
                    error: 'This post is a duplicate. LinkedIn prevents sharing the exact same content twice within a short period. Please try changing the title or excerpt slightly.'
                }, { status: 409 });
            }

            return NextResponse.json({ error: shareData.message || 'Failed to post to LinkedIn' }, { status: shareResponse.status });
        }

        const postId = shareData.id; // e.g., urn:li:share:123...
        const postUrl = `https://www.linkedin.com/feed/update/${postId}`;

        console.log('LinkedIn Post Created:', postUrl);

        return NextResponse.json({ success: true, id: postId, url: postUrl });

    } catch (error: any) {
        console.error('LinkedIn API Handler Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
