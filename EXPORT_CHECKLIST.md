# 📋 导出和部署检查清单

在导出和部署数据集市应用之前，请按此检查清单逐项确认。

## ✅ 导出前准备

### 1. 代码检查
- [ ] 所有功能已测试并正常工作
- [ ] 删除所有 console.log 调试语句
- [ ] 删除未使用的导入和代码
- [ ] 确保没有硬编码的敏感信息（API密钥、密码等）

### 2. 依赖管理
```bash
# 检查是否有过时的依赖
pnpm outdated

# 检查安全漏洞
pnpm audit

# 清理并重新安装（可选）
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### 3. 环境变量配置
- [ ] 复制 `.env.example` 为 `.env`
- [ ] 填写必要的环境变量（如果使用）
- [ ] 确认 `.env` 已添加到 `.gitignore`

### 4. 构建测试
```bash
# 执行生产构建
pnpm build

# 检查构建产物
ls -lh dist/

# 本地预览生产版本
pnpm preview
```

预期结果：
- ✅ 构建成功无错误
- ✅ dist 文件夹已生成
- ✅ 应用在预览环境中正常运行

---

## 🚀 部署选项

根据你的需求选择合适的部署方案：

### 选项 A: Vercel（最简单，推荐初学者）
**适合**: 快速部署、自动 CI/CD、免费 HTTPS

**步骤**:
1. [ ] 将代码推送到 GitHub/GitLab/Bitbucket
2. [ ] 访问 [vercel.com](https://vercel.com) 并登录
3. [ ] 点击 "Import Project" 导入你的仓库
4. [ ] 配置项目:
   - Framework Preset: Vite
   - Build Command: `pnpm build`
   - Output Directory: `dist`
   - Install Command: `pnpm install`
5. [ ] 添加环境变量（如果需要）
6. [ ] 点击 "Deploy" 部署

**或使用 CLI**:
```bash
npm i -g vercel
vercel login
vercel --prod
```

---

### 选项 B: Netlify（类似 Vercel）
**适合**: 静态站点托管、表单处理、Serverless Functions

**步骤**:
1. [ ] 代码推送到 Git 仓库
2. [ ] 访问 [netlify.com](https://netlify.com) 并登录
3. [ ] 点击 "Add new site" → "Import an existing project"
4. [ ] 选择仓库并配置:
   - Build command: `pnpm build`
   - Publish directory: `dist`
5. [ ] 环境变量设置（如果需要）
6. [ ] 点击 "Deploy site"

**或使用 CLI**:
```bash
npm i -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

---

### 选项 C: GitHub Pages（免费，适合开源项目）
**适合**: 个人项目、文档站点

**步骤**:
1. [ ] 修改 `vite.config.ts`，添加 base 路径:
```typescript
export default defineConfig({
  base: '/your-repo-name/', // 替换为你的仓库名
  // ...其他配置
})
```

2. [ ] 创建 GitHub Actions 工作流:
```bash
mkdir -p .github/workflows
```

3. [ ] 创建 `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
          
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
          
      - name: Install dependencies
        run: pnpm install
        
      - name: Build
        run: pnpm build
        
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```

4. [ ] 推送代码到 GitHub
5. [ ] 在仓库设置中启用 GitHub Pages (Settings → Pages → Source: GitHub Actions)

---

### 选项 D: Docker + 云服务器（完全控制）
**适合**: 需要自定义服务器配置、企业部署

**步骤**:
1. [ ] 确保已安装 Docker
```bash
docker --version
```

2. [ ] 构建 Docker 镜像
```bash
docker build -t data-marketplace:latest .
```

3. [ ] 本地测试
```bash
docker run -d -p 8080:80 --name datamart data-marketplace:latest
# 访问 http://localhost:8080 测试
```

4. [ ] 推送到容器注册表（可选）
```bash
# Docker Hub
docker tag data-marketplace:latest your-username/data-marketplace:latest
docker push your-username/data-marketplace:latest

# 或使用 GitHub Container Registry
docker tag data-marketplace:latest ghcr.io/your-username/data-marketplace:latest
docker push ghcr.io/your-username/data-marketplace:latest
```

5. [ ] 部署到服务器
```bash
# SSH 到服务器
ssh user@your-server.com

# 拉取并运行
docker pull your-username/data-marketplace:latest
docker run -d -p 80:80 --restart unless-stopped data-marketplace:latest
```

**或使用 Docker Compose**:
```bash
# 在服务器上
git clone your-repo
cd data-marketplace
docker-compose up -d
```

---

### 选项 E: 传统 VPS/服务器 + Nginx
**适合**: 已有服务器、需要与其他服务共存

**步骤**:
1. [ ] 本地构建
```bash
pnpm build
```

2. [ ] 上传到服务器
```bash
# 使用 SCP
scp -r dist/ user@your-server:/var/www/data-marketplace

# 或使用 rsync
rsync -avz dist/ user@your-server:/var/www/data-marketplace
```

3. [ ] 配置 Nginx
```bash
# SSH 到服务器
ssh user@your-server

# 创建 Nginx 配置
sudo nano /etc/nginx/sites-available/data-marketplace
```

粘贴以下内容:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/data-marketplace;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

4. [ ] 启用站点
```bash
sudo ln -s /etc/nginx/sites-available/data-marketplace /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

5. [ ] 配置 HTTPS（推荐使用 Let's Encrypt）
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## 🔐 安全检查

### 生产环境必做
- [ ] **HTTPS**: 确保使用 SSL/TLS 加密
- [ ] **环境变量**: 敏感信息通过环境变量管理，不要硬编码
- [ ] **CORS**: 如果有后端 API，配置正确的跨域策略
- [ ] **CSP**: 配置内容安全策略头
- [ ] **依赖审计**: 运行 `pnpm audit` 确保无已知漏洞
- [ ] **更新依赖**: 确保使用最新的稳定版本

### 推荐添加（如果未实现）
- [ ] **用户认证**: 使用 Supabase Auth / Firebase Auth
- [ ] **输入验证**: 前端和后端都要验证用户输入
- [ ] **速率限制**: 防止 API 滥用
- [ ] **错误监控**: 集成 Sentry 等错误追踪工具
- [ ] **访问日志**: 记录关键操作

---

## 📊 性能优化

### 构建优化
- [ ] 检查包体积
```bash
pnpm build
npx vite-bundle-visualizer
```

- [ ] 优化大型依赖
  - 按需导入 UI 组件
  - 使用代码分割 (React.lazy)
  - 移除未使用的库

### 运行时优化
- [ ] 启用 CDN（如果使用 Vercel/Netlify 会自动配置）
- [ ] 启用 Gzip/Brotli 压缩
- [ ] 配置缓存策略
- [ ] 使用 Web Vitals 监控性能

---

## 🔄 持续集成/部署 (CI/CD)

### GitHub Actions 示例（适用于任何托管平台）
创建 `.github/workflows/ci.yml`:
```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm build
      # 如果有测试，添加:
      # - run: pnpm test
```

---

## 📈 部署后检查

部署成功后，请验证：

### 功能测试
- [ ] 访问首页正常加载
- [ ] 侧边栏导航工作正常
- [ ] 数据源管理功能正常
- [ ] API 管理功能正常
- [ ] 查询编辑器功能正常
- [ ] 数据持久化（localStorage）正常

### 性能检查
- [ ] 首次加载时间 < 3秒
- [ ] 页面切换流畅
- [ ] 没有控制台错误

### 跨浏览器测试
- [ ] Chrome / Edge
- [ ] Firefox
- [ ] Safari

### 响应式测试
- [ ] 桌面端 (1920x1080)
- [ ] 平板端 (768x1024)
- [ ] 移动端 (375x667)

---

## 🎯 下一步行动

### 短期（部署后立即做）
1. [ ] 配置自定义域名
2. [ ] 设置错误监控（Sentry）
3. [ ] 添加分析工具（Google Analytics / Plausible）
4. [ ] 创建备份策略

### 中期（1-2周内）
1. [ ] 从 localStorage 升级到 Supabase
2. [ ] 实现用户认证系统
3. [ ] 添加单元测试和 E2E 测试
4. [ ] 优化 SEO（如果是公开应用）

### 长期（1个月+）
1. [ ] 实现真实数据库连接功能
2. [ ] 添加团队协作功能
3. [ ] 构建移动应用（React Native）
4. [ ] 企业级功能（权限管理、审计日志等）

---

## 🆘 故障排查

### 问题: 部署后页面刷新 404
**原因**: SPA 路由未正确配置
**解决**: 
- Vercel/Netlify: 已自动处理
- Nginx: 确保配置了 `try_files $uri $uri/ /index.html;`
- Apache: 添加 `.htaccess` 文件

### 问题: 构建失败 - 内存不足
**解决**:
```bash
# 增加 Node.js 内存限制
export NODE_OPTIONS=--max_old_space_size=4096
pnpm build
```

### 问题: 环境变量未生效
**检查**:
- [ ] 变量名必须以 `VITE_` 开头
- [ ] 已在部署平台配置环境变量
- [ ] 构建后重新部署（环境变量在构建时注入）

### 问题: 样式丢失
**检查**:
- [ ] `vite.config.ts` 中的 `base` 路径配置
- [ ] 确保 CSS 文件正确导入
- [ ] 检查 CDN 缓存（可能需要清除）

---

## 📞 获取帮助

如遇到问题:
1. 查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 详细文档
2. 搜索 GitHub Issues
3. 查阅官方文档:
   - [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)
   - [React Router 文档](https://reactrouter.com/)
   - [Vercel 文档](https://vercel.com/docs)
4. 社区支持:
   - Stack Overflow
   - Reddit r/reactjs
   - Discord 社区

---

## ✅ 最终确认

部署前最后确认：
- [ ] ✅ 所有功能已测试
- [ ] ✅ 构建成功无错误
- [ ] ✅ 环境变量已配置
- [ ] ✅ 安全检查已完成
- [ ] ✅ 选择了部署平台
- [ ] ✅ 域名已准备（如需要）
- [ ] ✅ 监控工具已配置

**🎉 准备就绪，开始部署！**

---

*祝你部署顺利！如有问题，欢迎提交 Issue。*
