# Wix CMS Import Instructions

This directory contains CSV files pre-formatted for importing the Blog data into Wix CMS.

## Import Order (Critical)

Because the Blog Posts reference Authors and Categories, **you must import the collections in this specific order:**

1.  **Authors** (`Authors.csv`)
2.  **Categories** (`Categories.csv`)
3.  **Blog Posts** (`BlogPosts.csv`)

## Step-by-Step Guide

### 1. Create Collections

In your Wix Dashboard > CMS > Your Collections:

1.  Create a collection named **Authors**
    - Fields: `Name` (Text), `Bio` (Text), `Profile Image` (Image)
2.  Create a collection named **Categories**
    - Fields: `Title` (Text), `Description` (Text)
3.  Create a collection named **BlogPosts**
    - Fields:
      - `Title` (Text)
      - `Slug` (Text)
      - `Excerpt` (Text)
      - `Content` (Rich Text)
      - `Cover Image` (Image)
      - `Published Date` (Date and Time)
      - `Author` (Reference -> Authors)
      - `Categories` (Multi-Reference -> Categories)

### 2. Import Data

1.  Go to the **Authors** collection.
2.  Click "More Actions" > "Import Items".
3.  Upload `Authors.csv`.
4.  Map the columns to your fields. **Ensure you check "Map 'Handle ID' to 'ID'" field if Wix allows, or let Wix generate IDs but you might need to manually relink references if automatic mapping fails.**
    - _Note: Wix Import often uses the concept of a 'Reference Key' field if you can't force the system ID. For best results, use the 'Name' or 'Title' as the reference key for Authors and Categories._

### 3. Handling References

The `BlogPosts.csv` uses `Handle ID` (e.g., `author-1`) to reference items.

- If Wix allows importing with a custom ID, great.
- If not, after importing Authors and Categories, you may need to export them to get their **Wix System IDs**, replace the values in `BlogPosts.csv` (replace `author-1` with the actual GUID from Wix), and then import the posts.

Alternatively, if you set the **Primary Field** of Authors to "Name", you can use the name (e.g., "Dr. Samuel Okafor") in the BlogPosts CSV Author column instead of the ID.
