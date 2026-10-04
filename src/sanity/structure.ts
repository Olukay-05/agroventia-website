import type { StructureResolver } from 'sanity/structure';
import {
  DesktopIcon,
  InfoOutlineIcon,
  CogIcon,
  PackageIcon,
  StarIcon,
  ImagesIcon,
  EditIcon,
  TagIcon,
  UserIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  FolderIcon,
} from '@sanity/icons';

export const structure: StructureResolver = (S: any) =>
  S.list()
    .title('AgroVentia Studio')
    .items([
      // Page Sections Group
      S.listItem()
        .title('Page Sections')
        .icon(DesktopIcon)
        .child(
          S.list()
            .title('Page Sections')
            .items([
              S.listItem()
                .title('Hero Banner')
                .id('heroSection')
                .icon(DesktopIcon)
                .child(
                  S.document()
                    .schemaType('heroSection')
                    .documentId('heroSection')
                    .title('Hero Banner')
                ),
              S.listItem()
                .title('About AgroVentia')
                .id('aboutSection')
                .icon(InfoOutlineIcon)
                .child(
                  S.document()
                    .schemaType('aboutSection')
                    .documentId('aboutSection')
                    .title('About AgroVentia')
                ),
              S.listItem()
                .title('Services Intro')
                .id('servicesSection')
                .icon(CogIcon)
                .child(
                  S.document()
                    .schemaType('servicesSection')
                    .documentId('servicesSection')
                    .title('Services Intro')
                ),
              S.listItem()
                .title('Service Items')
                .icon(FolderIcon)
                .child(
                  S.documentTypeList('serviceItem').title('Service Items')
                ),
              S.listItem()
                .title('Products Intro')
                .id('productsSection')
                .icon(PackageIcon)
                .child(
                  S.document()
                    .schemaType('productsSection')
                    .documentId('productsSection')
                    .title('Products Intro')
                ),
              S.listItem()
                .title('Contact & Footer')
                .id('contactInfo')
                .icon(EnvelopeIcon)
                .child(
                  S.document()
                    .schemaType('contactInfo')
                    .documentId('contactInfo')
                    .title('Contact & Footer')
                ),
            ])
        ),

      S.divider(),

      // Product Catalog
      S.listItem()
        .title('Product Catalog')
        .icon(PackageIcon)
        .child(
          S.documentTypeList('product').title('Product Catalog')
        ),

      // Core Values
      S.listItem()
        .title('Core Values')
        .icon(StarIcon)
        .child(
          S.documentTypeList('coreValue').title('Core Values')
        ),

      // Carousel Slides
      S.listItem()
        .title('Carousel Slides')
        .icon(ImagesIcon)
        .child(
          S.documentTypeList('carouselSlide').title('Carousel Slides')
        ),

      S.divider(),

      // Blog & Articles
      S.listItem()
        .title('Blog & Articles')
        .icon(EditIcon)
        .child(
          S.list()
            .title('Blog & Articles')
            .items([
              S.listItem()
                .title('Posts')
                .icon(DocumentTextIcon)
                .child(
                  S.documentTypeList('blogPost').title('Blog Posts')
                ),
              S.listItem()
                .title('Categories')
                .icon(TagIcon)
                .child(
                  S.documentTypeList('category').title('Categories')
                ),
              S.listItem()
                .title('Authors')
                .icon(UserIcon)
                .child(
                  S.documentTypeList('author').title('Authors')
                ),
            ])
        ),
    ]);
