import type { IApi } from 'umi';

import { Mustache, winPath } from '@umijs/utils';

import { existsSync, readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const joinTemplatePath = (path: string) => join(__dirname, '../../templates', path);

const cenerateFile = (api: IApi, fileName: string) =>
  api.onGenerateFiles(() => {
    const indexPath = `${fileName}`;

    const templatePath = joinTemplatePath(fileName);
    const indexTemplate = readFileSync(templatePath, 'utf-8');
    api.writeTmpFile({
      path: indexPath,
      content: Mustache.render(indexTemplate, api.config.app),
    });
  });

export default function (api: IApi) {
  api.logger.info('use @asany/umi-plugin-app');

  api.describe({
    key: 'app',
    config: {
      default: {
        id: process.env.APPID,
        shortcuts: true,
        icons: true,
        dnd: true,
      },
      schema(joi) {
        return joi.object({
          id: joi.string(),
          shortcuts: joi.boolean(),
          icons: joi.boolean(),
          dnd: joi.boolean(),
        });
      },
    },
  });

  const files = [
    'models/global.ts',
    'runtime.tsx',
    'ExtDvaContainer.tsx',
    'gql/application.gql',
    'gql/component.gql',
    'components/index.ts',
    'components/RouteComponent.tsx',
    'utils/index.ts',
    'AppManager.tsx',
    'index.ts',
    'typings.ts',
  ];

  files.map((fileName) => cenerateFile(api, fileName));

  api.onGenerateFiles(() => {
    const indexPath = 'autoImportLibrary.ts';

    const templatePath = joinTemplatePath('autoImportLibrary.hbs');
    const indexTemplate = readFileSync(templatePath, 'utf-8');

    const dirs = readdirSync(api.paths.absPagesPath!, { withFileTypes: true });
    const librarys = dirs
      .filter((dir) => dir.isDirectory())
      .map((dir) => ({ path: api.paths.absPagesPath! + '/' + dir.name, name: dir.name }));

    const layoutDir = api.paths.absSrcPath! + '/layouts';
    if (existsSync(layoutDir)) {
      librarys.push({ path: layoutDir, name: 'layout' });
    }

    api.writeTmpFile({
      path: indexPath,
      content: Mustache.render(indexTemplate, {
        librarys,
      }),
    });
  });

  api.addRuntimePlugin({
    before: ['dva', 'apollo'],
    fn: () => join(api.paths.absTmpPath!, 'plugin-app/runtime'),
  });
}
