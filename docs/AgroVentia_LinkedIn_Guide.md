# LinkedIn Integration Setup Guide for AgroVentia Inc.

**Date:** January 05, 2026
**To:** AgroVentia Inc. Management
**Subject:** Steps to Generate LinkedIn API Credentials

---

## 1. Overview
To enable the "One-Click Publish" feature on the AgroVentia website, we need to connect the website to your official LinkedIn Company Page. This requires creating a "LinkedIn App" within your account to generate secure keys.

This process involves **3 main steps**:
1.  Creating the App.
2.  Verifying the Company Page.
3.  Sharing the Credentials with the Development Team.

**Prerequisite:** Ensure you are logged into the LinkedIn account that is an **Admin** of the AgroVentia Company Page.

---

## 2. Step-by-Step Instructions

### Step A: Create the App
1.  Go to the **LinkedIn Developer Portal**: [https://www.linkedin.com/developers/apps/new](https://www.linkedin.com/developers/apps/new)
2.  Fill in the form:
    *   **App Name**: `AgroVentia Website Connect` (or similar).
    *   **LinkedIn Page**: Paste the URL of your company page (e.g., `https://www.linkedin.com/company/agroventia-inc`).
    *   **Privacy Policy URL**: `https://www.linkedin.com/company/agroventia-inc` (or your website's policy).
    *   **App Logo**: Upload the AgroVentia logo (Square, 100x100px).
3.  Check the **"Legal Agreement"** box and click **Create App**.

### Step B: Request Verification
1.  Once the app is created, go to the **Settings** tab.
2.  Under **"Company Page"**, click **Verify**.
3.  Click **Generate URL**.
4.  **Copy the URL** provided and open it in a new browser tab.
5.  Click **"Verify"** on that page to confirm you own the AgroVentia page.

### Step C: Add Products (Critical)
1.  Go to the **Products** tab in your new App.
2.  Request access for the following two products:
    *   **Share on LinkedIn** (Required for posting).
    *   **Sign In with LinkedIn using OpenID Connect** (Required for logging in).
3.  These usually approve instantly.

### Step D: Configure Redirect URL
1.  Go to the **Auth** tab.
2.  Scroll down to **"OAuth 2.0 settings"**.
3.  Click the pencil icon/edit next to **"Authorized redirect URLs for your app"**.
4.  Click **+ Add redirect URL**.
5.  Add the following URLs (add both):
    *   `https://www.agroventia.ca/api/auth/linkedin/callback` (Primary / Production)
    *   `http://localhost:3000/api/auth/linkedin/callback` (Dev / Testing)

### Step E: Extract Credentials
1.  Still in the **Auth** tab, look at the top section named **"Application credentials"**.
2.  Find the **Client ID** (a long string of letters and numbers).
3.  Find the **Client Secret** (Click the "eye" icon to reveal it).

---

## 3. Information Required by Developer

Please securely copy the two values found in **Step E** and send them to your development team.

| Field | Value |
| :--- | :--- |
| **LINKEDIN_CLIENT_ID** | `[Paste Client ID Here]` |
| **LINKEDIN_CLIENT_SECRET** | `[Paste Client Secret Here]` |

> **Security Warning:** Do not share the "Client Secret" in public chats or unencrypted emails if possible. It allows access to post on your company's behalf.

---
*End of Guide*
