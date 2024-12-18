import { useMemo } from 'react';
import { Navigate, useParams } from 'react-router-dom';

// 创建一个函数来替换占位符
const replacePlaceholders = (path: string, params: any) => {
  return path.replace(/:([a-zA-Z_]+)/g, (match, key) => {
    return params[key] || match; // 如果没有找到参数，保留原占位符
  });
};

const Redirect = ({ to, replace }: { to: string; replace: boolean }) => {
  const params = useParams(); // 获取所有路径参数

  const redirectPath = useMemo(() => replacePlaceholders(to, params), [to, params]); // 依赖于路径和参数

  return <Navigate to={redirectPath} replace={replace} />;
};

export default Redirect;
