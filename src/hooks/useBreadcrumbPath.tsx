import { toPascalCase } from "@/functions/pascalCase";
import { useRouterPath } from "./useRouterPath"

export const useBreadcrumbPath = () => {
  const route = useRouterPath();
  const removeQuestionMark = route.replace(/\?/g, '/');
  const removeEquals = removeQuestionMark.replace(/=/g,'/');
  const pathToPascalCase = toPascalCase(removeEquals);
  return pathToPascalCase.split('/').map((item) => { return {title: item} });
}
