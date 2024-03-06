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

import { sunmao } from './index';
import global from './models/global';

interface ExtDvaContainerProps {
  children: any;
  client: any;
  libraries: { [key: string]: ILibraryDefinition };
}

const renderAppWithOptionalProviders = (children: any) => {
  let WrappedChildren = children;
  {{#sunmao}}
  WrappedChildren = <SunmaoProvider sunmao={sunmao}>{WrappedChildren}</SunmaoProvider>;
  {{/sunmao}}
  {{#shortcuts}}
  const keymap = require('../../keymap').default
  WrappedChildren = <ShortcutProvider keymap={keymap}>{WrappedChildren}</ShortcutProvider>;
  {{/shortcuts}}
  {{#icons}}
  WrappedChildren = <IconProvider>{WrappedChildren}</IconProvider>;
  {{/icons}}
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
  
  {{#sunmao}}
  useEffect(() => {
    sunmao.addLibrary(...Object.keys(props.libraries).map((key) => props.libraries[key]));
  }, [])
  {{/sunmao}}

  return (
    <PersistGate persistor={store.current.persistor} loading={<div>加载组件</div>}>
      {renderAppWithOptionalProviders(props.children)}
    </PersistGate>
  );
}

export default ExtDvaContainer;
