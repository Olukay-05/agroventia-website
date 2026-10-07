// Type declarations for Sanity modules in Next.js environment

declare module 'sanity' {
  export interface Rule {
    required(): Rule;
    min(min: number): Rule;
    max(max: number): Rule;
    email(): Rule;
    regex(regex: RegExp, options?: { name?: string; invert?: boolean }): Rule;
    warning(message: string): Rule;
    error(message: string): Rule;
    [key: string]: any;
  }

  export function defineType<T = any>(schema: T): T;
  export function defineField<T = any>(field: T): T;
  export function defineArrayMember<T = any>(member: T): T;

  export interface SchemaPluginOptions {
    name?: string;
    types?: any[];
    templates?: (prev: any[]) => any[];
  }

  export interface WorkspaceOptions {
    name?: string;
    title?: string;
    projectId: string;
    dataset: string;
    basePath?: string;
    plugins?: any[];
    schema?: SchemaPluginOptions;
    document?: {
      actions?: (prev: any[], context: { schemaType: string }) => any[];
      [key: string]: any;
    };
    [key: string]: any;
  }

  export function defineConfig(config: WorkspaceOptions | WorkspaceOptions[]): any;

  export interface SanityClient {
    fetch<R = any>(query: string, params?: Record<string, any>): Promise<R>;
    [key: string]: any;
  }

  export function createClient(config: any): SanityClient;
}

declare module 'sanity/structure' {
  export interface StructureBuilder {
    list(): any;
    listItem(): any;
    document(): any;
    documentTypeList(typeName: string): any;
    divider(): any;
    [key: string]: any;
  }

  export type StructureResolver = (S: StructureBuilder, context?: any) => any;

  export function structureTool(options?: {
    structure?: StructureResolver;
    defaultDocumentNode?: any;
    [key: string]: any;
  }): any;
}

declare module '@sanity/vision' {
  export function visionTool(options?: {
    defaultApiVersion?: string;
    defaultDataset?: string;
    [key: string]: any;
  }): any;
}

declare module 'next-sanity/studio' {
  import type { ComponentType, ReactNode } from 'react';

  export interface NextStudioProps {
    config: any;
    children?: ReactNode;
    [key: string]: any;
  }

  export const NextStudio: ComponentType<NextStudioProps>;
  export const NextStudioLayout: ComponentType<{ children?: ReactNode }>;
  export const NextStudioNoScript: ComponentType<any>;
  export const metadata: any;
  export const viewport: any;
}
