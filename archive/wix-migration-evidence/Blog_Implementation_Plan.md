# Blog Implementation Work Plan for AgroVentia

## 1. Executive Summary
This document outlines the strategy and timeline for integrating a fully functional, SEO-optimized blog into the AgroVentia website within a **2-week timeline**. The system will use **Wix Headless CMS** for content management and include a custom **LinkedIn integration** feature, allowing controlled, automatic cross-posting of blog content.

**Primary Goal:** Achieve first-page Google search rankings through high-performance technical SEO and semantic content structure.

---

## 2. Project Timeline (2 Weeks)

### Week 1: Foundation & CMS Integration
**Focus:** Data modeling, Frontend UI, and Core SEO.

*   **Day 1-2: Wix CMS Configuration**
    *   Create `BlogPosts` Collection in Wix.
    *   Define Fields:
        *   `title` (Text)
        *   `slug` (Text, Unique)
        *   `content` (Rich Content / HTML)
        *   `excerpt` (Text)
        *   `coverImage` (Image)
        *   `author` (Reference/Text)
        *   `publishedDate` (Date)
        *   `seoTitle` (Text)
        *   `seoDescription` (Text)
        *   `postToLinkedIn` (Boolean) - *Control Trigger*
        *   `linkedInStatus` (Text) - *Status Feedback (Pending/Posted/Failed)*
    *   Configure Permissions (Public Read, Admin Write).

*   **Day 3-5: Frontend Development (Next.js)**
    *   **Blog Listing Page (`/blog`)**:
        *   Grid layout card design.
        *   Pagination or Infinite Scroll.
        *   Category filtering (if applicable).
    *   **Single Post Page (`/blog/[slug]`)**:
        *   Dynamic routing.
        *   `RichText` renderer for Wix content.
        *   Related posts section.
    *   **SEO Integration**:
        *   Implement `SeoHead` with dynamic metadata.
        *   Add `Article` and `BreadcrumbList` Schema.org markup.
        *   Generate dynamic `sitemap.xml` entries for blog posts.

### Week 2: Advanced Features & LinkedIn Integration
**Focus:** Automation, Polishing, and Launch.

*   **Day 6-8: LinkedIn Integration Support**
    *   **Strategy**: Develop a Next.js API route (`/api/webhooks/linkedin-publish`) integrated with Wix Webhooks or a manual "Publish to LinkedIn" action in a guarded Admin Route.
    *   **Workflow**:
        1.  Client checks `postToLinkedIn` in Wix (or clicks a button in a custom Admin interface).
        2.  System validates content length and generates a LinkedIn-optimized summary.
        3.  System uploads cover image to LinkedIn Assets API.
        4.  System creates a UGC Post (Share) on LinkedIn linking back to the blog post.
        5.  System updates `linkedInStatus` to "Posted".
    *   *Note: Requires AgroVentia LinkedIn Page Access Token setup.*

*   **Day 9: SEO & Performance Tuning**
    *   Verify SSG/ISR (Incremental Static Regeneration) for fast page loads.
    *   Audit Core Web Vitals (LCP, CLS) for blog pages.
    *   Verify Meta Tags and Structured Data using Google Rich Results Test.

*   **Day 10: Final Review & Analytics**
    *   Google Analytics 4 specific event tracking (Scroll depth, Time on page).
    *   User Acceptance Testing (UAT) with Client.
    *   Documentation Release.

---

## 3. SEO Strategy (Goal: First Page Indexing)

To maximize visibility, we will implement acceptable "White Hat" SEO techniques aggressively.

#### 3.1 Technical SEO
*   **Rendering**: Use **Incremenetal Static Regeneration (ISR)** (`revalidate: 60`) to ensure HTML is static and crawlable, yet fresh.
*   **Structured Data**:
    *   `Schema.org/BlogPosting`: Full metadata including headline, image, datePublished, author.
    *   `Schema.org/BreadcrumbList`: For site hierarchy understanding.
*   **URL Structure**: Clean, semantic URLs (e.g., `agroventia.ca/blog/benefits-of-west-african-kolanut`).
*   **Sitemaps**: Automated inclusion of all blog slugs in `sitemap.xml`.

#### 3.2 Content Optimization
*   **Headings**: Enforce H1 for Title, H2/H3 for subsections.
*   **Internal Linking**: "Related Products" section in blog posts to link back to Product pages (Link Juice flow).
*   **Images**: `next/image` with automatic WebP conversion and forced `alt` tags derived from CMS.

---

## 4. LinkedIn Integration Mechanism

**Constraint**: *Client Control ("The client should be able to control whether or not a blog content can also be posted")*.

**Proposed Solution: "Publish on Demand"**

Since Wix Headless CMS might not easily trigger complex custom external API flows without Wix Velo (coding in Wix), we will implement the control on the **Next.js side** or via a **Wix Webhook**.

**Recommended Solution: Next.js Admin Dashboard (Client-Side Trigger)**

Since the Wix Free Plan does not support custom backend Velo code (hooks), we will move the automation logic entirely to the Next.js application. We will build a secured "Admin Dashboard" page where the client can manually trigger the LinkedIn share.

**Step 1: The Secured Admin Page (`/admin/blog`)**
*Detailed implementation of the Auth flow and components is available in `LinkedIn_Integration_Plan.md`.*

Create a new page in Next.js protected by Basic Auth or a simple hardcoded login (since this is an MVP/internal tool). This page will fetch blog posts from Wix and provide the control interface.

```tsx
// path: src/app/admin/blog/page.tsx (simplified)
"use client";
import { useState, useEffect } from 'react';
import { createClient, OAuthStrategy } from '@wix/sdk';
import { items } from '@wix/data';

// initialize wix client (ensure this uses an API Key or OAuth with "Write" permissions if possible)
const wixClient = createClient({
  modules: { items },
  auth: OAuthStrategy({ clientId: 'YOUR_CLIENT_ID' })
});

export default function AdminBlogPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch posts that haven't been shared yet (or all posts)
    wixClient.items.query('BlogPosts')
      .descending('publishedDate')
      .find()
      .then(res => setPosts(res.items));
  }, []);

  const handleShare = async (post) => {
    // Call our own Next.js API route
    const res = await fetch('/api/linkedin/share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        coverImage: post.coverImage
      })
    });

    if (res.ok) {
        alert('Shared successfully!');
        // Optimistically update UI or re-fetch
        // Note: Updating 'linkedInStatus' back to Wix might require specific API permissions
    }
  };

  return (
    <div className="p-8">
      <h1>Blog Automation Dashboard</h1>
      <div className="grid gap-4">
        {posts.map(post => (
          <div key={post._id} className="border p-4 flex justify-between items-center">
            <div>
              <h3 className="font-bold">{post.title}</h3>
              <p className="text-sm text-gray-500">{post.linkedInStatus || 'Not Shared'}</p>
            </div>
            <button
              onClick={() => handleShare(post)}
              disabled={post.linkedInStatus === 'Posted'}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Share to LinkedIn
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

**Step 2: The Next.js API Route (`/api/linkedin/share`)**
This remains similar to the previous plan but is now triggered by the Admin Page instead of a Wix Webhook.

```typescript
// path: src/app/api/linkedin/share/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // 1. Session/Auth Check (ensure only Admin can call this)
  // e.g., check for a specific cookie or secret header passed from the client
  
  try {
    const { slug, title, excerpt, coverImage } = await request.json();

    // 2. Execute LinkedIn Logic
    // Full OAuth 2.0 token management and publishing logic is detailed in `LinkedIn_Integration_Plan.md`
    // The system will automatically refresh tokens if expired before posting.

    return NextResponse.json({ success: true, message: 'Posted to LinkedIn' });
  } catch (error) {
    console.error('LinkedIn Implementation Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
```

**Step 3: Status Tracking Workaround**
Since we cannot use backend hooks to automatically update the `linkedInStatus` field reliably on the free plan (without exposed API keys with write access), we have two sub-options:
1.  **Optimistic UI Only**: The Admin Dashboard shows "Posted" for the current session, but doesn't persist it to Wix.
2.  **API Write**: If the Wix Headless API Key created in the Wix Dashboard allows "Write" access to the collection, we can send an update request from the Next.js API route back to Wix to update the `linkedInStatus`. **We will attempt this method first.**

---

## 5. Requirements from Client
To proceed, we need:
1.  **LinkedIn Company Page Access**: Admin access to create a developed App for API keys (Client ID, Client Secret).

