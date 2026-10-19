import fs from 'node:fs/promises';

const account=process.env.CLOUDFLARE_ACCOUNT_ID;
const token=process.env.CLOUDFLARE_API_TOKEN;
if(!account||!token)throw Error('Cloudflare Pagesの接続情報がありません');
const projectName='belisarius-git';
const base=`https://api.cloudflare.com/client/v4/accounts/${account}/pages/projects`;
async function request(suffix,options={}){
 const response=await fetch(base+suffix,{...options,headers:{Authorization:`Bearer ${token}`,...options.headers}});
 const data=await response.json();
 if(!data.success){const e=Error(JSON.stringify({status:response.status,errors:data.errors}));e.status=response.status;throw e;}
 return data.result;
}
const mode=process.argv[2]??'ensure';
if(!['ensure','inspect'].includes(mode))throw Error('Unknown mode');
let project;
try{project=await request('/'+projectName);}catch(e){
 if(mode!=='ensure'||e.status!==404)throw e;
 const body={name:projectName,production_branch:'main',build_config:{build_command:'npm run check',destination_dir:'dist',root_dir:''},
  source:{type:'github',config:{owner:'daraskme',owner_id:'102633287',repo_name:'belisarius',repo_id:'1425866995',production_branch:'main',production_deployments_enabled:true,deployments_enabled:true,pr_comments_enabled:true,path_includes:['*'],path_excludes:[],preview_deployment_setting:'all',preview_branch_includes:['*'],preview_branch_excludes:[]}},
  deployment_configs:{
   production:{env_vars:{NODE_VERSION:{type:'plain_text',value:'24'}}},
   preview:{env_vars:{NODE_VERSION:{type:'plain_text',value:'24'}}}
  }
 };
 project=await request('',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
 console.log('GitHub連携付きPagesプロジェクトを作成しました: '+project.name);
}
if(project.source?.type!=='github'||project.source.config.owner!=='daraskme'||project.source.config.repo_name!=='belisarius')throw Error('Git連携先が想定と一致しません');
let deployments=await request('/'+projectName+'/deployments?per_page=5');
if(mode==='ensure'&&!deployments.length){const form=new FormData();form.set('branch','main');await request('/'+projectName+'/deployments',{method:'POST',body:form});deployments=await request('/'+projectName+'/deployments?per_page=5');}
const result={name:project.name,subdomain:project.subdomain,source:project.source,build_config:{build_command:project.build_config?.build_command,destination_dir:project.build_config?.destination_dir},deployments:deployments.map(d=>({id:d.id,url:d.url,environment:d.environment,status:d.latest_stage?.status,stage:d.latest_stage?.name,commit:d.deployment_trigger?.metadata?.commit_hash}))};
console.log('NATIVE_PAGES_STATE '+JSON.stringify(result));
await fs.writeFile('native-pages-state.json',JSON.stringify(result,null,2));
