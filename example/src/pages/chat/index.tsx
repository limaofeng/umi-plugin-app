import dynamic from '@/utils/dynamic';
import { component, library } from '@asany/sunmao';

@library({
  name: 'chat',
  description: '',
  namespace: 'cn.asany.ui.admin.chat',
})
class Chat {
  @component({
    title: '聊天应用',
    tags: ['消息'],
  })
  ChatApp = dynamic({
    loader: () => import('./ChatApp'),
    loading: () => <div>loading...</div>,
  });
}

export default new Chat();
