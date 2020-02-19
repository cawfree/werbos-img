import { typeCheck } from "type-check";
import { existsSync } from "fs";

const isFile = e => typeCheck('String', e) && existsSync(e);

const isFiles = e => Array.isArray(e) && e.length > 0 && e.reduce((r, f) => (r && isFile(f)), true);

export const img = () => handle => [
  handle(isFile, () => 'file!'),
  handle(isFiles, () => 'files!'),
] && undefined;
