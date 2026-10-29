const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'shopnest-ecommerce-main');
const dbfile=path.join(root,'db.js');
if(!fs.existsSync(dbfile)){console.error('找不到原版 ShopNest 的 db.js，停止修改。');process.exit(1)}
const rows=[
 ['ALTAY SIBERIA 防晒霜 SPF50+','面部及身体防晒霜 SPF50+ PA+++；图片标注批发价',2500,'洗护','IMG_3558(1).jpg'],
 ['YOUMAIDOU 绿色丝滑护发素 800ml','绿色瓶装无硫酸盐护发素；图片2和3为同款展示',1600,'洗护','IMG_3560(1).jpg'],
 ['YOUMAIDOU 蓝色护发素 758ml','蓝瓶装护发素',1600,'洗护','IMG_3562(1).jpg'],
 ['YOUMAIDOU 粉色洗发水 758ml','粉瓶装洗发水',1600,'洗护','IMG_3563(1).jpg'],
 ['HANNIAI 蓝色洗发水 750ml','蓝瓶装无硫酸盐洗发水',1500,'洗护','IMG_3564(1).jpg'],
 ['WOZHIAN 沐浴露＋磨砂 2合1 400ml','沐浴露与磨砂结合',1000,'洗护','IMG_3565(1).jpg'],
 ['HANNIAI 香氛沐浴露 1L','图示三种香型：山茶花、玫瑰、香雪兰',1700,'洗护','IMG_3566(1).jpg'],
 ['MPINBA 珠光香氛洗手液 500ml','珠光香氛洗手液',1200,'洗护','IMG_3567(1).jpg'],
 ['YOUMAIDOU 珠光香氛洗手液 420ml','图示三种颜色香型',950,'洗护','IMG_3568(1).jpg']
].map(([n,d,p,c,img])=>[n,d,p,c,'/images/washcare/'+img,10]);
let s=fs.readFileSync(dbfile,'utf8');
const marker='const products = [';
const start=s.indexOf(marker);
const end=s.indexOf('\n  ];',start)>=0?s.indexOf('\n  ];',start):s.indexOf('];',start);
if(start<0||end<0||end-start>12000){console.error('ShopNest 数据格式不同于已核对版本，停止以防破坏。');process.exit(1)}
const ending=s.indexOf('];',end)+2;
s=s.slice(0,start)+'const products = '+JSON.stringify(rows,null,2)+';'+s.slice(ending);
fs.writeFileSync(dbfile,s);
const imgdir=path.join(root,'public','images','washcare');fs.mkdirSync(imgdir,{recursive:true});
for(const f of fs.readdirSync(path.join(__dirname,'photos'))){fs.copyFileSync(path.join(__dirname,'photos',f),path.join(imgdir,f))}
const appfile=path.join(root,'public','js','app.js');
let app=fs.readFileSync(appfile,'utf8');
app=app.replace('return `₹${Number(n).toFixed(2)}`;', 'return `${Number(n).toLocaleString(\'en-US\')} ₸`;');
app=app.replace('Shop<span>Nest</span>','Shop<span>Nest</span>');
fs.writeFileSync(appfile,app);
console.log('完成：原版 ShopNest 主题保留；9 件商品、10 张照片已导入「洗护」。');
