import { component, library } from '@asany/sunmao';
import { lazy, Suspense } from 'react'


function dynamic(config: any) {
  const Component = lazy(config.loader);
  return (props: any) => (
    <Suspense fallback={config.loading}>
      <Component {...props} />
    </Suspense>
  );
}

@library({
  name: 'layout',
  description: '',
  namespace: 'cn.asany.ui.admin.layout',
})
class Layout {
  @component({
    title: '布局 7',
    tags: ['布局'],
  })
  Demo7 = dynamic({
    loader: () => import('./Default/index'),
    loading: () => <p>loading...</p>,
  });
}

export default new Layout();
