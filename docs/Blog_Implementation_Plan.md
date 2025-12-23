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

**Option A: Wix Velo Automation (Recommended)**
*   Add a `AfterUpdate` hook in Wix Code.
*   If `postToLinkedIn` is strictly `true` AND `linkedInStatus` is NOT 'Posted':
    *   Call external Next.js endpoint `/api/linkedin/share` with post data.
    *   Update `linkedInStatus` to 'Posted'.

**Option B: Custom Admin Dashboard Button** (If strict separation preferred)
*   Add a "Blog Manager" tab in the existing Admin Dashboard.
*   List posts with a "Post to LinkedIn" button.
*   Button calls Next.js API to execute the share.
*   *Benefit*: Absolute control, immediate feedback if token expires.

*Decision*: We will proceed with **Option B** (integration into existing Admin Dashboard) as it offers better visibility and error handling for the client than a background webhook.

---

## 5. Requirements from Client
To proceed, we need:
1.  **LinkedIn Company Page Access**: Admin access to create a developed App for API keys (Client ID, Client Secret).

