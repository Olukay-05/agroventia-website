# Carousel Image Display Setup Guide

## Overview

This guide explains how to set up and test the CarouselImageDisplay feature in the AgroVentia homepage.

## Prerequisites

1. Wix CMS account with access to the site
2. Wix API token and site ID
3. CarouselImageDisplay collection created in Wix CMS

## Setup Instructions

### 1. Create the CarouselImageDisplay Collection in Wix CMS

1. Log in to your Wix CMS
2. Navigate to the Collections section
3. Create a new collection named `CarouselImageDisplay`
4. Add the following fields to the collection:
   - `imageUrl` (URL) - The background image URL
   - `title` (Text) - Used as the hero headline text
   - `description` (Text) - Used as the hero subtitle text
   - `tagline` (Text) - Alternative subtitle text (optional)
   - `displayOrder` (Number) - Order in which items should be displayed (optional)

### 2. Configure Environment Variables

1. Copy the `.env.example` file to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Update the `.env.local` file with your Wix credentials:
   ```env
   WIX_API_TOKEN=your_actual_wix_api_token
   WIX_SITE_ID=your_actual_wix_site_id
   NEXT_PUBLIC_WIX_SITE_ID=your_actual_wix_site_id
   ```

### 3. Add Sample Data to CarouselImageDisplay Collection

Add at least one item to the collection with the following fields:

- `imageUrl`: URL to a background image
- `title`: Headline text for the hero section
- `description`: Subtitle text for the hero section
- `tagline`: Alternative subtitle text (optional)
- `displayOrder`: Number to control display order (optional)

## Testing the Carousel

### 1. Test the API Endpoint

You can test the carousel data fetching by visiting:

```
http://localhost:3000/api/test-carousel
```

This should return the carousel data if everything is set up correctly.

### 2. Test the Collection Endpoint

You can also test the direct collection endpoint:

```
http://localhost:3000/api/collections/CarouselImageDisplay
```

### 3. View the Carousel in the Hero Section

Once you've added data to the CarouselImageDisplay collection and configured your environment variables:

1. Start the development server: `npm run dev`
2. Visit `http://localhost:3000`
3. The hero section should now display images from the CarouselImageDisplay collection
4. The headline text will use the `title` field
5. The subtitle text will use the `tagline` field (if available) or fall back to the `description` field

## Fallback Behavior

If any of the following conditions are met, the hero section will fall back to the original implementation:

- Wix configuration is missing or invalid
- No data is found in the CarouselImageDisplay collection
- API calls fail

In fallback mode, the hero section will use:

- The backgroundImage from the HeroContent collection (if available)
- Default title and subtitle text

## Troubleshooting

### Common Issues

1. **"Missing required Wix configuration" error**
   - Ensure WIX_API_TOKEN and WIX_SITE_ID are set in `.env.local`
   - Make sure NEXT_PUBLIC_WIX_SITE_ID is also set for client-side access

2. **Empty carousel data**
   - Verify the CarouselImageDisplay collection exists in Wix CMS
   - Check that the collection has items with the correct field names
   - Ensure the collection name exactly matches "CarouselImageDisplay"

3. **API call failures**
   - Verify your Wix API token has the correct permissions
   - Check that your site ID is correct
   - Make sure your Wix API token hasn't expired

4. **Client-side environment variables not accessible**
   - Private environment variables (without NEXT*PUBLIC* prefix) are only available server-side
   - Public environment variables (with NEXT*PUBLIC* prefix) are available client-side

### Debugging Steps

1. **Check the browser console for any error messages**
   - Look for the debug logs that start with emojis (🔍, 🚀, 📊, etc.)

2. **Check the terminal where the development server is running for server-side logs**
   - Look for detailed API request/response information

3. **Use the test endpoints to verify data fetching**
   - Visit `http://localhost:3000/api/collections/CarouselImageDisplay` to see the raw data
   - Check browser console logs for client-side debugging information

4. **Verify your CarouselImageDisplay collection in Wix CMS**
   - Make sure the collection name is exactly "CarouselImageDisplay"
   - Check that field names match exactly:
     - `imageUrl` (not "image" or "backgroundImage")
     - `title` (not "imageDescription" or "headline")
     - `description` (not "subtitle")
     - `tagline` (optional)
     - `displayOrder` (optional)

5. **Check your environment variables**
   - Verify that your `.env.local` file contains all required variables:
     - `WIX_API_TOKEN`
     - `WIX_SITE_ID`
     - `NEXT_PUBLIC_WIX_SITE_ID`

### Current Issue Resolution

Based on your debug output, there were two issues:

1. **Field Name Mismatch**: Your Wix collection uses different field names than what the carousel component expected:
   - Your collection has: `imageUrl`, `title`, `description`, `tagline`
   - The carousel originally expected: `image`, `imageDescription`, `tagline`
   - **Fix**: We created a new carousel service that properly maps the field names

2. **Configuration Access**: Client-side components can only access environment variables with the `NEXT_PUBLIC_` prefix
   - Private environment variables (without NEXT*PUBLIC* prefix) are only available server-side
   - **Fix**: We updated the wix-api.service.ts to route client-side requests through our own API endpoints

To resolve these issues:

1. Ensure your `.env.local` file contains:

   ```
   WIX_API_TOKEN=your_actual_wix_api_token
   WIX_SITE_ID=your_actual_wix_site_id
   NEXT_PUBLIC_WIX_SITE_ID=your_actual_wix_site_id
   ```

2. Restart your development server after making any changes to environment variables

## Implementation Details

### File Structure

The carousel implementation spans several files:

- `src/components/sections/HeroSection.tsx` - Main component that displays carousel data
- `src/services/carousel.service.ts` - Service that fetches and transforms carousel data
- `src/services/wix-data.service.ts` - Service layer for fetching Wix collection data
- `src/services/wix-api.service.ts` - Low-level Wix API communication
- `src/lib/wix-config.ts` - Configuration handling for client-side vs server-side
- `src/app/api/collections/[collection]/route.ts` - API route for fetching individual collections
- `src/app/api/test-carousel/route.ts` - Test endpoint for carousel data

### Data Flow

1. HeroSection component mounts and calls carouselService.fetchCarouselItems()
2. carouselService fetches data through `/api/collections/CarouselImageDisplay`
3. The API route accesses Wix APIs using server-side credentials
4. carouselService transforms the data to match the expected structure
5. Carousel items are displayed with 5-second intervals and smooth fading transitions
6. Each carousel item provides:
   - Background image (from `imageUrl` field)
   - Headline text (from `title` field)
   - Subtitle text (from `tagline` field if available, otherwise from `description` field)
