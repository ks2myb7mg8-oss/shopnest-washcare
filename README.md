# ShopNest 洗护商品目录

保留 [ShopNest 原版主题](https://github.com/sti-technical/shopnest-ecommerce)。Docker 构建时下载原版并加入本仓库的商品照片和洗护分类。

## Railway 部署
1. Railway → New Project → Deploy from GitHub Repo → 选择本仓库。
2. 服务 Variables 配置：
   - ADMIN_PASSWORD：自行生成至少 12 位强密码
   - JWT_SECRET：至少 32 字符的随机安全密钥
   - DB_PATH：/data/shopnest.db
3. 绑定 Volume，挂载路径设为 /data，确认配置后重新部署。
4. Networking → Generate Domain 获取公网 HTTPS 地址。
5. /admin.html 为管理员页面，管理员账号 admin@shopnest.com，密码为 ADMIN_PASSWORD 首次创建数据库时的设置。

**重要**：别把密码上传 GitHub，也不要直接公开默认演示密码。项目来自教学示例，正式接单或收款前需要审查登录安全、订单隐私、数据库备份和图片管理；照片目前随代码发布，不保证后台直接上传本地图片。更改 ADMIN_PASSWORD 变量不会自动修改已有数据库的用户密码。

注意：当前自动构建尚未在 Railway 测试成功；如遇构建错误，查看 Railway Deploy Logs 并提供错误截图。
