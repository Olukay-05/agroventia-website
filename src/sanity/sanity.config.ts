import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { apiVersion, dataset, projectId } from './env';
import { schemaTypes, singletonTypes } from './schemas';
import { structure } from './structure';
import {
  AutoTranslateAction,
  LOCALIZED_SCHEMA_TYPES,
} from './actions/autoTranslateAction';

export default defineConfig({
  name: 'agroventia-studio',
  title: 'AgroVentia Content Studio',
  projectId,
  dataset,
  basePath: '/studio',
  plugins: [
    structureTool({
      structure,
    }),
    visionTool({
      defaultApiVersion: apiVersion,
    }),
  ],
  schema: {
    types: schemaTypes,
    // Filter out singleton types from the global "New document" menu
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  document: {
    // For singleton types, filter out actions that shouldn't be available (e.g. duplicate, delete)
    actions: (input, context) => {
      const filtered = singletonTypes.has(context.schemaType)
        ? input.filter(
            ({ action }) =>
              action && ['publish', 'discardChanges', 'restore'].includes(action)
          )
        : input;

      if (LOCALIZED_SCHEMA_TYPES.has(context.schemaType)) {
        return [...filtered, AutoTranslateAction];
      }

      return filtered;
    },
  },
});
