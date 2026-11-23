import sharp from 'sharp';
import {createHash} from 'node:crypto';
const targets=[['michael-and-spiritual-conflict',386222],['beast-from-the-sea',397141],['serpent-in-genesis',387388],['final-judgement-of-evil',382414],['victory-over-evil',670697]];
for(const [slug,id] of targets){
 try{
  const record=await fetch('https://collectionapi.metmuseum.org/public/collection/v1/objects/'+id,{signal:AbortSignal.timeout(20000)});
  if(!record.ok)throw new Error('Catalogue '+record.status);
  const obj=await record.json();
  if(!obj.isPublicDomain||!obj.primaryImageSmall)throw new Error('Not cleared or unavailable');
  const url=new URL(obj.primaryImageSmall);
  if(url.protocol!=='https:'||!['images.metmuseum.org','collectionapi.metmuseum.org'].includes(url.hostname))throw new Error('Unexpected image host');
  const response=await fetch(url,{signal:AbortSignal.timeout(25000)});
  if(!response.ok)throw new Error('Image '+response.status);
  const buf=Buffer.from(await response.arrayBuffer());
  const {data,info}=await sharp(buf,{limitInputPixels:25000000}).rotate().resize({width:1100,height:1100,fit:'inside',withoutEnlargement:true}).webp({quality:74}).toBuffer({resolveWithObject:true});
  if(data.length>245000)throw new Error('Image exceeds budget');
  console.log('ARTMETA '+JSON.stringify({slug,id,title:obj.title,artist:obj.artistDisplayName,date:obj.objectDate,medium:obj.medium,credit:obj.creditLine,accession:obj.objectNumber,source:obj.objectURL,width:info.width,height:info.height,bytes:data.length,sha256:createHash('sha256').update(data).digest('hex'),git:createHash('sha1').update('blob '+data.length+'\0').update(data).digest('hex')}));
  const b64=data.toString('base64');for(let i=0;i<b64.length;i+=768)console.log('ARTDATA '+slug+' '+b64.slice(i,i+768));
 }catch(e){console.log('ARTFAIL '+slug+' '+e.message);}
}
