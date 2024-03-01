import { defineConfig } from '@umijs/max';

export default defineConfig({
  plugins: ["@asany/umi-plugin-apollo", require.resolve('../dist/cjs')],
  apollo: {
    url: 'https://api.asany.cn/graphql',
  },
  app: {
    id: '6068485332c5fc853a65',
  },
  dva: {},
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: false,
  routes: [
  ],
  npmClient: 'npm',
});

