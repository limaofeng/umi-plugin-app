import { useRef, useEffect } from 'react';

import { ILibraryDefinition, SunmaoProvider } from '@asany/sunmao';
import { PersistGate } from 'redux-persist/integration/react';
import { getDvaApp } from 'umi';
{{#icons}}
import { IconProvider } from '@asany/icons';
{{/icons}}
{{#shortcuts}}
import { ShortcutProvider } from '@asany/shortcuts';
{{/shortcuts}}
{{#dnd}}
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
{{/dnd}}
{{#loading}}
import { LoadingProvider } from './contexts/LoadingContext';
{{/loading}}

import { sunmao } from './index';
import global from './models/global';

const isDev = process.env.NODE_ENV === 'development';

interface ExtDvaContainerProps {
  children: any;
  client: any;
  libraries: { [key: string]: ILibraryDefinition };
}

const renderAppWithOptionalProviders = (children: any) => {
  let WrappedChildren = children;
  WrappedChildren = <SunmaoProvider sunmao={sunmao}>{WrappedChildren}</SunmaoProvider>;
  {{#shortcuts}}
  const keymap = require('../../keymap').default
  WrappedChildren = <ShortcutProvider keymap={keymap}>{WrappedChildren}</ShortcutProvider>;
  {{/shortcuts}}
  {{#icons}}
  WrappedChildren = <IconProvider>{WrappedChildren}</IconProvider>;
  {{/icons}}
  {{#dnd}}
  WrappedChildren = <DndProvider backend={HTML5Backend}>{WrappedChildren}</DndProvider>
  {{/dnd}}
  {{#loading}}
  WrappedChildren = <LoadingProvider>{WrappedChildren}</LoadingProvider>;
  {{/loading}}
  return WrappedChildren;
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
  }, [])

  useEffect(() => {
    if(!store.current) {
      return;
    }
    // 从 window.APP_CONFIG 中查找需要替换的
    if (window.APP_CONFIG) {
      for (const key in window.APP_CONFIG) {
        if (window.APP_CONFIG.hasOwnProperty(key)) {
          const value = (window.APP_CONFIG as any)[key];
          if (typeof value === 'string' && value.startsWith('REPLACE_')) {
             // 从 process.env 中查找对应的环境变量
            const envValue = process.env[key];
            if (envValue) {
              // 如果环境变量存在，则替换
              (window.APP_CONFIG as any)[key] = envValue;
              isDev && console.log(`Replaced ${key} with process.env.${key}: ${envValue}`);
            } else {
              (window.APP_CONFIG as any)[key] = '';
              isDev && console.log(`No corresponding environment variable for ${key}`);
            }
          }
        }
      }
      // 通过 dispatch 触发 'global/updateData' reducer，更新 global 内的数据
      store.current.dispatch({
        type: 'global/setAppConfig',
        payload: {...window.APP_CONFIG},
      });
      for (const key in window.APP_CONFIG) {
        if(!["APPID"].includes(key)) {
          delete (window.APP_CONFIG as any)[key];
          isDev && console.log(`Removed ${key} from window.APP_CONFIG`);
        }
      }
    }
  }, [store.current])

  return (
    <PersistGate persistor={store.current.persistor} loading={<div>加载组件</div>}>
      {renderAppWithOptionalProviders(props.children)}
    </PersistGate>
  );
}

export default ExtDvaContainer;
