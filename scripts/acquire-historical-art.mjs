import sharp from 'sharp';
import {createHash} from 'node:crypto';
const targets=[['beatus-manuscript',466204,2024323],['michael-choir-book',32839,61351],['last-judgement-book-of-hours',469963,951512]];
for(const [slug,id,image] of targets){try{
const res=await fetch('https://collectionapi.metmuseum.org/api/collection/v1/iiif/'+id+'/'+image+'/main-image',{headers:{Accept:'image/jpeg,image/png,image/*;q=0.9'},signal:AbortSignal.timeout(25000)});if(!res.ok)throw Error('HTTP '+res.status);
const bytes=Buffer.from(await res.arrayBuffer());
let converted;for(const size of [1000,820,680]){converted=await sharp(bytes,{limitInputPixels:50000000}).rotate().resize({width:size,height:size,fit:'inside',withoutEnlargement:true}).webp({quality:62}).toBuffer({resolveWithObject:true});if(converted.data.length<245000)break;}
const {data,info}=converted;if(data.length>245000)throw Error('Image exceeds budget');
console.log('ARTMETA '+JSON.stringify({slug,width:info.width,height:info.height,bytes:data.length,sha256:createHash('sha256').update(data).digest('hex'),git:createHash('sha1').update('blob '+data.length+'\0').update(data).digest('hex')}));
const b64=data.toString('base64');for(let i=0;i<b64.length;i+=768)console.log('ARTDATA '+slug+' '+b64.slice(i,i+768));
}catch(e){console.log('ARTFAIL '+slug+' '+e.message);}}
