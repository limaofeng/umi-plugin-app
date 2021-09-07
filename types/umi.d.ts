// types/umi
import React from 'react';

type Access = React.ComponentType<{
  accessible: boolean;
  fallback: React.ReactNode;
}>;

type isAccessed = (...args: any) => boolean;

type AccessChecker = {
  [key: string]: boolean | isAccessed;
};

declare module 'umi' {
  export * from 'umi';
  export const Access;
  export function useAccess(): AccessChecker;
}
