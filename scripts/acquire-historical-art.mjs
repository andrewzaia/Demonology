import sharp from 'sharp';
import {createHash} from 'node:crypto';
const targets=[
['michael-and-spiritual-conflict','https://collectionapi.metmuseum.org/api/collection/v1/iiif/386222/765784/main-image'],
['beast-from-the-sea','https://collectionapi.metmuseum.org/api/collection/v1/iiif/397141/767073/main-image'],
['serpent-in-genesis','https://collectionapi.metmuseum.org/api/collection/v1/iiif/387388/749233/main-image'],


['augustine-city-of-god','https://iiif.wellcomecollection.org/image/V0031638/full/760%2C/0/default.jpg']
];
for(const [slug,url] of targets){try{
const res=await fetch(url,{headers:{Accept:'image/jpeg,image/png,image/*;q=0.9'},signal:AbortSignal.timeout(25000)});if(!res.ok)throw Error('HTTP '+res.status);
const bytes=Buffer.from(await res.arrayBuffer());
const {data,info}=await sharp(bytes,{limitInputPixels:25000000}).rotate().resize({width:820,height:820,fit:'inside',withoutEnlargement:true}).webp({quality:53}).toBuffer({resolveWithObject:true});
if(data.length>245000)throw Error('Image exceeds budget');
console.log('ARTMETA '+JSON.stringify({slug,width:info.width,height:info.height,bytes:data.length,sha256:createHash('sha256').update(data).digest('hex'),git:createHash('sha1').update('blob '+data.length+'\0').update(data).digest('hex')}));
const b64=data.toString('base64');for(let i=0;i<b64.length;i+=768)console.log('ARTDATA '+slug+' '+b64.slice(i,i+768));
}catch(e){console.log('ARTFAIL '+slug+' '+e.message);}}
