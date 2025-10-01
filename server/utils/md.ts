import { marked } from "marked";

export function mdToHtml(md: string): string {
  return marked.parse(md, { async: false }) as string;
}