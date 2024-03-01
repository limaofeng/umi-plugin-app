import dynamic from '../utils/dynamic';
import { component, library } from '@asany/sunmao';

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
    loading: () => <div>loading...</div>,
  });
}

export default new Layout();
