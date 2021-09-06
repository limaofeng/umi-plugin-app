import { defineConfig } from 'umi';

export default defineConfig({
  plugins: [require.resolve('../dist')],
  apollo: {
    uri: 'https://api.asany.cn/graphql',
  },
  app: {
    id: '5cc2a9d305297b47dc26c5da',
  },
});
