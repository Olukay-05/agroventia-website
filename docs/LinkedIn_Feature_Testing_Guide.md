# LinkedIn Integration Testing Guide

This guide outlines the steps to test the newly implemented LinkedIn "One-Click Publish" feature.

## 1. Prerequisites

Before testing, ensure your local environment is configured with the credentials you generated using the [AgroVentia LinkedIn Guide](./AgroVentia_LinkedIn_Guide.md).

### Update `.env.local`
Add the following keys to your `.env.local` file:

```env
LINKEDIN_CLIENT_ID=your_client_id_from_guide
LINKEDIN_CLIENT_SECRET=your_client_secret_from_guide
NEXT_PUBLIC_BASE_URL=http://localhost:3000
TOKEN_ENCRYPTION_KEY=your_32_byte_encryption_key # Optional: If you changed the default in wix-system-settings.ts
```

> **Note:** Ensure `NEXT_PUBLIC_BASE_URL` matches your current testing environment (e.g., `http://localhost:3000`).

## 2. Testing Authentication (Connect Feature)

1.  **Navigate to the Admin Blog Dashboard**:
    *   Open your browser and reload `http://localhost:3000/admin/blog`.
    *   Log in if prompted (MVP Password: `admin123`).

2.  **Initiate Connection**:
    *   Click the **"Connect LinkedIn"** button in the top right corner.
    *   You should be redirected to LinkedIn's authorization page.

3.  **Authorize App**:
    *   Sign in to LinkedIn (if not already logged in).
    *   Click **"Allow"** to grant permissions (AgroVentia Website Connect needs access to your profile/page).

4.  **Verify Success**:
    *   After allowing, you should be redirected back to the Admin Dashboard.
    *   The URL should look like: `http://localhost:3000/admin/blog?success=true`.
    *   The button in the top right should now say **"Refresh Connection"** (though strictly in the MVP it might just redirect back; visual confirmation of "Connected" state relies on logic in `AdminBlogPage` which we can verify).

## 3. Testing "Share to LinkedIn"

1.  **Select a Post**:
    *   Find a blog post in the list that has a status of "Pending" or "Not Shared".

2.  **Click Share**:
    *   Click the **"Share to LinkedIn"** button next to the post.
    *   Confirm the browser popup dialog (`Share "Post Title" to LinkedIn?`).

3.  **Verify Success**:
    *   **UI**: You should see an alert: `Shared successfully!`.
    *   **Status Update**: The post's status badge should change to **"Posted"** (Green).

4.  **Verify on LinkedIn**:
    *   Go to your LinkedIn Profile (or the Company Page if you configured the app for the company).
    *   Check "Posts" or "Activity" to see if the new post appears with the correct Title and Link.

## 4. Troubleshooting

*   **Error: "LinkedIn not connected"**:
    *   This means the tokens were not saved or decryped correctly. Try clicking "Connect LinkedIn" again.
*   **Error: "Failed to post to LinkedIn"**:
    *   Check your server console logs for `LinkedIn Share API Error`.
    *   Common causes: Expired token, permissions revoked, or invalid URN.
*   **Redirect Loop / 400 Error**:
    *   Ensure your `redirect_uri` in the LinkedIn Developer Portal exactly matches what is in your `.env` (usually `http://localhost:3000/api/auth/linkedin/callback`).

## 5. Next Steps

Once verified locally:
1.  Deploy the changes to Vercel/Production.
2.  **Important**: Update the LinkedIn Developer App "Redirect URLs" to include your production domain (e.g., `https://www.agroventia.ca/api/auth/linkedin/callback`).
3.  Add the production `LINKEDIN_CLIENT_ID` and `LINKEDIN_CLIENT_SECRET` to your Vercel Environment Variables.
