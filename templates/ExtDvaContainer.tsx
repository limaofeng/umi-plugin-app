// import { EnvironmentManager } from '@asany/components';
import React, { useRef, useEffect } from 'react';

import { ILibraryDefinition, SunmaoProvider } from '@asany/sunmao';
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

const enableShortcuts = {{shortcuts}};
const enableSunmao = {{sunmao}};
const enableIcons = {{icons}};

function ExtDvaContainer(props: ExtDvaContainerProps) {
  const store = useRef<any>();

  if (!store.current) {
    const dvaApp = getDvaApp();
    // 添加插件默认支持的 Model
    dvaApp.model(global);
    store.current = dvaApp._store;
  }

  useEffect(() => {
    enableSunmao && sunmao.addLibrary(...Object.keys(props.libraries).map((key) => props.libraries[key]));
  }, []);

  // 转移系统环境变量到 EnvironmentManager 中
  // const environment = EnvironmentManager.currentEnvironment();
  // environment.set("paths.upload.url", process.env.STORAGE_URL + '/files');
  // environment.set("paths.upload.space", process.env.STORAGE_DEFAULT_SPACE);
  // environment.set("paths.upload.viewUrl", process.env.STORAGE_URL);

  const { children } = props;

  const renderAppWithOptionalProviders = (children: any) => {
    let WrappedChildren = children;
    if (enableSunmao) {
      WrappedChildren = <SunmaoProvider sunmao={sunmao}>{children}</SunmaoProvider>;
    }
    if (enableShortcuts) {
      WrappedChildren = <ShortcutProvider keymap={keymap}>{WrappedChildren}</ShortcutProvider>;
    }
    if (enableIcons) {
      WrappedChildren = <IconProvider>{WrappedChildren}</IconProvider>;
    }
    return WrappedChildren;
  };

  return (
    <PersistGate persistor={store.current.persistor} loading={<div>加载组件</div>}>
      {renderAppWithOptionalProviders(children)}
    </PersistGate>
  );
}

export default ExtDvaContainer;
