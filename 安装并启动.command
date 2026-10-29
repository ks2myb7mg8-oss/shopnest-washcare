#!/bin/bash
cd "$(dirname "$0")" || exit 1
printf '\n【ShopNest 原版主题 + 洗护目录安装程序】\n'
if ! command -v node >/dev/null 2>&1; then
  echo '没有检测到 Node.js，请先从 https://nodejs.org/ 安装 LTS 版本。'; read -r -p '按回车结束'; exit 1
fi
if [ ! -f "shopnest-ecommerce-main/db.js" ]; then
 echo '正在从 GitHub 下载真正的 ShopNest 原版源码（需要互联网）...'
 curl -fL --retry 2 --connect-timeout 15 'https://github.com/sti-technical/shopnest-ecommerce/archive/refs/heads/main.zip' -o original-shopnest.zip || { echo '下载失败，请检查网络或用 README 手工下载源码'; read -r -p '按回车结束'; exit 1; }
 unzip -q original-shopnest.zip || exit 1
fi
if [ -f shopnest-ecommerce-main/shopnest.db ]; then echo '检测到已存在的数据库，不会覆盖旧商品。'; else node patch.js || exit 1; fi
cd shopnest-ecommerce-main || exit 1
npm install || { echo '依赖安装失败'; read -r -p '按回车结束'; exit 1; }
echo '原版主题网站地址 http://localhost:3000'
echo '管理员页面 http://localhost:3000/admin.html'
echo '首次登录 admin@shopnest.com / admin123（仅本地测试使用）'
npm start
