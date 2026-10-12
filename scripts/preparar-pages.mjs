import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

// Build in a separate directory, never copying .env files or private keys.
const root = process.cwd();
const destination = process.argv[2];
if (!destination) throw new Error('Informe uma pasta de trabalho para a exportação.');
const base = '';
await fs.mkdir(destination,{recursive:true});
for (const name of ['app','lib','public','package.json','package-lock.json','tsconfig.json','next-env.d.ts']) {
  const source = path.join(root,name);
  if (!(await fs.stat(source).catch(()=>null))) continue;
  await fs.cp(source,path.join(destination,name),{recursive:true});
}
const cssFile=path.join(destination,'app','globals.css');
const css=await fs.readFile(cssFile,'utf8');
await fs.writeFile(cssFile,css.replaceAll("url('/",`url('${base}/`));
await fs.writeFile(path.join(destination,'next.config.mjs'),`export default {output:'export',basePath:'${base}',trailingSlash:true};\n`);
await fs.symlink(path.join(root,'node_modules'),path.join(destination,'node_modules'),'junction').catch(error=>{if(error.code!=='EEXIST')throw error;});
const build=spawnSync(process.execPath,[path.join(root,'node_modules','next','dist','bin','next'),'build','--webpack'],{
  cwd:destination,stdio:'inherit',env:{...process.env,NEXT_PUBLIC_SITE_BASE_PATH:base,APECANN_PUBLIC_URL:'https://apecann.com.br/'}
});
if(build.status!==0)process.exit(build.status||1);
await fs.writeFile(path.join(destination,'out','.nojekyll'),'');
await fs.writeFile(path.join(destination,'out','CNAME'),'apecann.com.br\n');
console.log('Exportação estática:',path.join(destination,'out'));
