import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3001',

  },
  retries: 3,
  video: false,
  videoCompression: 32,
  videosFolder: 'cypress/videos',
});
