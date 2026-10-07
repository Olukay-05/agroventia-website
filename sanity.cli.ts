import { defineCliConfig } from 'sanity/cli';

import { dataset, projectId } from './src/sanity/env';

export default defineCliConfig({
  studioHost: 'agroventia-content-studio',
  api: {
    projectId,
    dataset,
  },
  autoUpdates: false,
});
