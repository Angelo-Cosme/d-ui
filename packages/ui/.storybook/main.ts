import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const storybookDir = dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig & { title: string } = {
  title: 'Dudalo Design System',
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(ts|tsx)',
    '../../education/src/**/*.mdx',
    '../../education/src/**/*.stories.@(ts|tsx)',
  ],
  staticDirs: ['./public'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  core: {
    disableTelemetry: true,
    disableWhatsNewNotifications: true,
  },
  features: {
    backgrounds: false,
    sidebarOnboardingChecklist: false,
  },
  async viteFinal(config) {
    config.plugins = [...(config.plugins ?? []), tailwindcss()];
    /*
     * Les stories Education importent `d-ui` comme une app : on pointe sur la
     * source pour ne pas charger `dist` (CSS et contextes en double).
     */
    config.resolve = {
      ...config.resolve,
      alias: {
        ...(config.resolve?.alias as Record<string, string> | undefined),
        'd-ui': resolve(storybookDir, '../src/index.ts'),
      },
    };
    return config;
  },
};

export default config;
