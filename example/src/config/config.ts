import { defineConfig } from 'umi';
import routes from './routes';

export default defineConfig({
    plugins: [
        "@umijs/plugins/dist/dva",
        "@asany/umi-plugin-apollo",
        require.resolve('../../dist/cjs')
    ],
    apollo: {
        url: 'https://api.asany.cn/graphql',
    },
    app: {
        id: '6068485332c5fc853a65',
    },
    dva: {},
    layout: false,
    routes,
    npmClient: 'npm',
});