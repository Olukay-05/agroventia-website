# LinkedIn Integration Troubleshooting Guide

## Current Error: `invalid_scope_error`

This error means LinkedIn is rejecting the scopes (permissions) your app is requesting. This typically happens when:

1. The required LinkedIn Products are not added/approved
2. The scopes don't match what's available for your app
3. The app configuration is incomplete

---

## Step-by-Step Verification Checklist

### 1. Verify LinkedIn Developer Portal Setup

Go to: [LinkedIn Developer Portal](https://www.linkedin.com/developers/apps)

#### A. Check Products Tab
1. Click on your app "AgroVentia Website Connect"
2. Go to the **Products** tab
3. **VERIFY** you see these products with "Added" status:
   - ✅ **Share on LinkedIn** - Status should be "Added" or "Approved"
   - ✅ **Sign In with LinkedIn using OpenID Connect** - Status should be "Added" or "Approved"

**If either shows "Request access" or "Pending":**
- Click "Request access" and wait for approval (usually instant)
- Some products require manual review by LinkedIn (can take 1-2 days)

#### B. Check Auth Tab - Available Scopes
1. Go to the **Auth** tab
2. Scroll down to **"OAuth 2.0 scopes"** section
3. **VERIFY** you see these scopes listed:
   - `r_liteprofile` - Read basic profile info
   - `w_member_social` - Post on behalf of member
   
**If `w_member_social` is NOT listed:**
- This means "Share on LinkedIn" product is not fully approved
- You may need to wait for approval or contact LinkedIn support

#### C. Check Redirect URLs
1. Still in the **Auth** tab
2. Under **"OAuth 2.0 settings"** → **"Authorized redirect URLs for your app"**
3. **VERIFY** you have:
   ```
   http://localhost:3000/api/auth/linkedin/callback
   https://www.agroventia.ca/api/auth/linkedin/callback
   ```

#### D. Verify Company Page Association
1. Go to **Settings** tab
2. Under **"Company"** section
3. **VERIFY** the AgroVentia company page is listed and **verified** (green checkmark)

**If not verified:**
- Click "Verify" and follow the process
- You need admin access to the company page

---

### 2. Check Environment Variables

Open your `.env.local` file and verify:

```env
LINKEDIN_CLIENT_ID=865kv7amrkvjwn
LINKEDIN_CLIENT_SECRET=<LINKEDIN_CLIENT_SECRET>
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Important:**
- Client ID should match what's in LinkedIn Developer Portal → Auth tab
- Client Secret should match (click the eye icon to reveal it)
- No extra spaces or quotes

---

### 3. Test with Updated Code

The code has been updated to use traditional OAuth 2.0 scopes:
- Changed from: `openid profile email w_member_social`
- Changed to: `r_liteprofile w_member_social`

**To test:**
1. Restart your dev server (Ctrl+C, then `npm run dev`)
2. Navigate to `http://localhost:3000/admin/blog`
3. Click "Connect LinkedIn"
4. Check the server console logs for:
   ```
   LinkedIn Client ID: Set
   Redirect URI: http://localhost:3000/api/auth/linkedin/callback
   Redirecting to: https://www.linkedin.com/oauth/v2/authorization?...
   ```

---

### 4. Alternative Approach: OpenID Connect Only (Temporary)

If `w_member_social` is still not available, we can temporarily test with just OpenID scopes to verify the basic connection works:

**Temporarily change** `src/app/api/auth/linkedin/login/route.ts` line 15 to:
```typescript
scope: 'openid profile email',
```

This will allow you to test the OAuth flow without posting permissions. If this works, it confirms the issue is specifically with the `w_member_social` scope approval.

---

## Common Solutions

### Solution 1: Wait for Product Approval
- Some LinkedIn products require manual approval
- Check your email for approval notifications from LinkedIn
- Can take 1-2 business days

### Solution 2: Re-request Products
1. Go to Products tab
2. If you see "Share on LinkedIn" with a remove option, remove it
3. Re-add it by clicking "Select" or "Request access"
4. Wait for instant approval

### Solution 3: Create a New App
If the app is stuck in a bad state:
1. Create a new LinkedIn app following the setup guide
2. Update your `.env.local` with the new credentials
3. Test again

### Solution 4: Use Marketing Developer Platform (Advanced)
For more advanced features, you may need to apply for the **Marketing Developer Platform** product, which includes:
- `w_member_social` scope
- `r_organization_social` scope (for company pages)
- Refresh tokens

---

## Debugging Output

When you click "Connect LinkedIn", check your terminal for these logs:

```
LinkedIn Client ID: Set
Redirect URI: http://localhost:3000/api/auth/linkedin/callback
Redirecting to: https://www.linkedin.com/oauth/v2/authorization?...
```

**Copy the full redirect URL** and paste it here for analysis. It should look like:
```
https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=865kv7amrkvjwn&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Flinkedin%2Fcallback&state=random_state_string_for_security&scope=r_liteprofile+w_member_social
```

---

## Next Steps

1. **First**: Verify all items in Section 1 (LinkedIn Developer Portal)
2. **Then**: Restart dev server and test
3. **If still failing**: Try the OpenID-only test (Section 4)
4. **Report back**: Share the console logs and which products show as "Added" in your LinkedIn app

---

## Contact LinkedIn Support

If none of the above works, you may need to contact LinkedIn Developer Support:
- Go to: https://www.linkedin.com/help/linkedin/ask/api
- Explain that you're getting `invalid_scope_error` for `w_member_social` scope
- Mention you've added the "Share on LinkedIn" product
- Provide your App ID: (found in Settings tab)
