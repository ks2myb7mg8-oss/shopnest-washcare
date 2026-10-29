const fs=require('fs'), path=require('path');
const root='/app', src='/build/custom', dbfile=path.join(root,'db.js');
const products=[
['ALTAY SIBERIA 防晒霜 SPF50+','面部与身体防晒霜 SPF50+ PA+++（图片所示批发价格）',2500,'洗护','IMG_3558(1).jpg'],
['YOUMAIDOU 绿色护发素 800ml','两张产品宣传图，同一产品',1600,'洗护','IMG_3560(1).jpg'],
['YOUMAIDOU 蓝色护发素 758ml','护发素 758ml',1600,'洗护','IMG_3562(1).jpg'],
['YOUMAIDOU 粉色洗发水 758ml','洗发水 758ml',1600,'洗护','IMG_3563(1).jpg'],
['HANNIAI 蓝色洗发水 750ml','无硫酸盐洗发水 750ml',1500,'洗护','IMG_3564(1).jpg'],
['WOZHIAN 沐浴露＋磨砂 2合1 400ml','沐浴露及磨砂 2合1',1000,'洗护','IMG_3565(1).jpg'],
['HANNIAI 香氛沐浴露 1L','山茶花、玫瑰、香雪兰香型',1700,'洗护','IMG_3566(1).jpg'],
['MPINBA 珠光香氛洗手液 500ml','珠光香氛洗手液',1200,'洗护','IMG_3567(1).jpg'],
['YOUMAIDOU 珠光香氛洗手液 420ml','三种颜色/香型',950,'洗护','IMG_3568(1).jpg']
].map(([n,d,p,c,img])=>[n,d,p,c,'/images/washcare/'+img,10]);
let db=fs.readFileSync(dbfile,'utf8');
if(!db.includes("path.join(__dirname, 'shopnest.db')"))throw Error('Original DB path changed');
db=db.replace("path.join(__dirname, 'shopnest.db')","process.env.DB_PATH || path.join(__dirname, 'shopnest.db')");
const m=db.match(/const products = \[[\s\S]*?\n\s*\];/);
if(!m)throw Error('Original product seed format changed');
db=db.replace(m[0],'const products = '+JSON.stringify(products,null,2)+';');
if(!db.includes("bcrypt.hashSync('admin123', 10)"))throw Error('Original admin seed format changed');
db=db.replace("bcrypt.hashSync('admin123', 10)","bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10)");
db=db.replace("console.log('Seeded admin user: admin@shopnest.com / admin123');","console.log('Seeded admin user: admin@shopnest.com');");
fs.writeFileSync(dbfile,db);
const pub=path.join(root,'public'), imgs=path.join(pub,'images','washcare');
fs.mkdirSync(imgs,{recursive:true});
for(const f of fs.readdirSync(src).filter(x=>/^IMG_.*\.jpg$/i.test(x))) fs.copyFileSync(path.join(src,f),path.join(imgs,f));
let appfile=path.join(pub,'js','app.js');
let app=fs.readFileSync(appfile,'utf8').replace(/₹/g,'₸');
fs.writeFileSync(appfile,app);
fs.mkdirSync(path.join(pub,'css'),{recursive:true});
fs.writeFileSync(path.join(pub,'css','washcare-mobile.css'),`html{-webkit-text-size-adjust:100%}body{max-width:100%;overflow-x:hidden}img{max-width:100%}input,select,textarea,button{box-sizing:border-box}
@media(max-width:768px){.product-grid,.products-grid,#productGrid,#productsGrid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:12px!important}.product-card{min-width:0}.form-row,.admin-layout{grid-template-columns:1fr!important}table{display:block;max-width:100%;overflow-x:auto}input,select,textarea{font-size:16px}.container,.wrapper,main{max-width:100%;box-sizing:border-box}}
@media(max-width:380px){.product-grid,.products-grid,#productGrid,#productsGrid{gap:8px!important}}`);
for(const f of fs.readdirSync(pub).filter(x=>x.endsWith('.html'))){const file=path.join(pub,f);let html=fs.readFileSync(file,'utf8');if(!/name=["']viewport["']/i.test(html))html=html.replace(/<head([^>]*)>/i,'<head$1>\n<meta name="viewport" content="width=device-width,initial-scale=1">');html=html.replace(/<\/head>/i,'<link rel="stylesheet" href="/css/washcare-mobile.css">\n</head>');fs.writeFileSync(file,html);}
const serverFile=path.join(root,'server.js');
let server=fs.readFileSync(serverFile,'utf8');
server="if(process.env.NODE_ENV==='production' && (!process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD.length<12 || !process.env.JWT_SECRET || process.env.JWT_SECRET.length<32 || !process.env.DB_PATH)){throw Error('Missing ADMIN_PASSWORD (12+), JWT_SECRET (32+) or DB_PATH');}\n"+server;
fs.writeFileSync(serverFile,server);
console.log('Original ShopNest theme retained; washcare seed and mobile CSS installed.');
