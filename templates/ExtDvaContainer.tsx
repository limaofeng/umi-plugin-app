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
{{loading}}
import { LoadingProvider } from './contexts/LoadingContext';
{{/loading}}

import { sunmao } from './index';
import global from './models/global';

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
  <DndProvider backend={HTML5Backend}>{WrappedChildren}</DndProvider>
  {{/dnd}}
  {{loading}}
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

  return (
    <PersistGate persistor={store.current.persistor} loading={<div>加载组件</div>}>
      {renderAppWithOptionalProviders(props.children)}
    </PersistGate>
  );
}

export default ExtDvaContainer;
