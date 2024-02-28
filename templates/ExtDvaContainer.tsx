// import { EnvironmentManager } from '@asany/components';
import React, { useRef, useEffect } from 'react';

import { ConfigProvider } from 'antd';
import { ILibraryDefinition, Sunmao, SunmaoProvider } from '@asany/sunmao';
import zhCN from 'antd/es/locale/zh_CN';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { PersistGate } from 'redux-persist/integration/react';
import { getDvaApp } from 'umi';
import { IconProvider } from '@asany/icons';
import { ShortcutProvider } from '@asany/shortcuts';

import keymap from '../../keymap';

import { sunmao } from './index';
import global from './models/global';

interface ExtDvaContainerProps {
  children: any;
  client: any;
  libraries: { [key: string]: ILibraryDefinition };
}

function ExtDvaContainer(props: ExtDvaContainerProps) {
  const store = useRef<any>();

  if (!store.current) {
    const dvaApp = getDvaApp();
    // 添加插件默认支持的 Model
    dvaApp.model(global);
    store.current = dvaApp._store;
  }

  useEffect(() => {
    sunmao.addLibrary(...Object.keys(props.libraries).map((key) => props.libraries[key]));
  }, []);

  // 转移系统环境变量到 EnvironmentManager 中
  // const environment = EnvironmentManager.currentEnvironment();
  // environment.set("paths.upload.url", process.env.STORAGE_URL + '/files');
  // environment.set("paths.upload.space", process.env.STORAGE_DEFAULT_SPACE);
  // environment.set("paths.upload.viewUrl", process.env.STORAGE_URL);

  const { children } = props;
  return (
    <PersistGate persistor={store.current.persistor} loading={<div>加载组件</div>}>
      <IconProvider>
        <ShortcutProvider keymap={keymap}>
          <SunmaoProvider sunmao={sunmao}>
            <ConfigProvider locale={zhCN}>
              <DndProvider backend={HTML5Backend}>{children}</DndProvider>
            </ConfigProvider>
          </SunmaoProvider>
        </ShortcutProvider>
      </IconProvider>
    </PersistGate>
  );
}

export default ExtDvaContainer;
