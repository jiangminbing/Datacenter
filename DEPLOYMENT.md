# 数据集市应用 - 部署指南

## 📦 项目概述

这是一个基于 React + Vite + TypeScript 开发的数据集市管理平台，支持多种数据源连接和 API 管理功能。

### 核心功能
- 📊 **概览仪表板**: 实时统计数据源、API 和查询数量
- 🔌 **数据源管理**: 支持 MySQL、PostgreSQL、MongoDB、REST API 等多种数据源
- 🚀 **API 管理**: 创建和管理 RESTful API 端点
- 📝 **查询编辑器**: 可视化 SQL 查询构建器
- 💾 **数据持久化**: 当前使用 localStorage（可扩展至 Supabase 等后端服务）

### 技术栈
- ⚡️ Vite 6.x
- ⚛️ React 18.3
- 🎨 Tailwind CSS 4.x
- 🧩 Material-UI (MUI)
- 🎯 Radix UI 组件库
- 🛣️ React Router 7.x
- 📦 pnpm 包管理器

---

## 🚀 快速开始

### 前置要求
- Node.js >= 18.0.0
- pnpm >= 8.0.0 (推荐) 或 npm/yarn

### 安装 pnpm (如未安装)
```bash
npm install -g pnpm
```

### 本地开发

1. **安装依赖**
```bash
pnpm install
```

2. **启动开发服务器**
```bash
pnpm dev
```

应用将在 `http://localhost:5173` 启动（端口可能不同）

3. **构建生产版本**
```bash
pnpm build
```

构建产物将生成在 `dist/` 目录

4. **预览生产构建**
```bash
pnpm preview
```

---

## 📁 项目结构

```
数据集市/
├── src/
│   ├── app/
│   │   ├── App.tsx              # 应用主入口
│   │   ├── routes.tsx           # 路由配置
│   │   ├── components/          # 业务组件
│   │   │   ├── layout.tsx       # 主布局（含侧边栏导航）
│   │   │   ├── dashboard.tsx    # 概览仪表板
│   │   │   ├── data-sources.tsx # 数据源管理页面
│   │   │   ├── api-management.tsx # API 管理页面
│   │   │   ├── query-editor.tsx # 查询编辑器
│   │   │   └── ui/              # UI 组件库
│   │   └── lib/
│   │       └── storage.ts       # localStorage 数据管理
│   ├── styles/                  # 全局样式
│   └── main.tsx                 # React 应用入口
├── index.html                   # HTML 入口
├── vite.config.ts              # Vite 配置
├── package.json                # 依赖配置
└── postcss.config.mjs          # PostCSS 配置

```

---

## 🌐 部署方案

### 1. 静态网站托管（推荐）

适用于 **Vercel、Netlify、GitHub Pages、Cloudflare Pages** 等平台

#### Vercel 部署
```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录并部署
vercel

# 生产环境部署
vercel --prod
```

**配置要点**:
- Build Command: `pnpm build`
- Output Directory: `dist`
- Install Command: `pnpm install`

#### Netlify 部署
在项目根目录创建 `netlify.toml`:
```toml
[build]
  command = "pnpm build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

然后通过 Netlify Dashboard 导入 Git 仓库或使用 CLI:
```bash
npm install -g netlify-cli
netlify deploy --prod
```

#### GitHub Pages 部署
在 `vite.config.ts` 中添加 base 路径:
```typescript
export default defineConfig({
  base: '/your-repo-name/',
  // ... 其他配置
})
```

添加 `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
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
        
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### 2. Docker 容器化部署

创建 `Dockerfile`:
```dockerfile
# 构建阶段
FROM node:18-alpine AS builder

# 安装 pnpm
RUN npm install -g pnpm

WORKDIR /app

# 复制依赖文件
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建应用
RUN pnpm build

# 生产阶段
FROM nginx:alpine

# 复制构建产物到 nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 nginx 配置（支持 SPA 路由）
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

创建 `nginx.conf`:
```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # 支持 React Router 的 SPA 路由
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 启用 gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

构建和运行:
```bash
# 构建镜像
docker build -t data-marketplace .

# 运行容器
docker run -d -p 8080:80 data-marketplace
```

使用 Docker Compose (`docker-compose.yml`):
```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "8080:80"
    restart: unless-stopped
```

运行:
```bash
docker-compose up -d
```

### 3. 传统服务器部署（Nginx）

1. **构建应用**
```bash
pnpm build
```

2. **上传 dist 文件夹到服务器**
```bash
scp -r dist/ user@your-server:/var/www/data-marketplace
```

3. **配置 Nginx** (`/etc/nginx/sites-available/data-marketplace`)
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/data-marketplace;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

4. **启用站点并重启 Nginx**
```bash
sudo ln -s /etc/nginx/sites-available/data-marketplace /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🔧 环境变量配置

虽然当前应用使用 localStorage，但为了未来扩展，可以配置环境变量：

创建 `.env` 文件（不要提交到 Git）:
```env
# Supabase 配置（可选）
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# API 基础路径（可选）
VITE_API_BASE_URL=https://api.your-domain.com
```

在代码中使用:
```typescript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
```

---

## 📊 数据持久化升级建议

### 当前方案: localStorage
- ✅ 优点: 简单、无需后端、立即可用
- ⚠️ 限制: 数据仅存储在浏览器本地、无法跨设备同步、容量限制（~5-10MB）

### 推荐升级方案

#### 方案 A: Supabase（最推荐）
```bash
pnpm add @supabase/supabase-js
```

优点:
- 完整的 PostgreSQL 数据库
- 实时订阅功能
- 内置认证和授权
- 免费套餐慷慨
- RESTful API 和 SDK

#### 方案 B: Firebase
```bash
pnpm add firebase
```

优点:
- Google 生态系统
- 实时数据库
- 离线支持
- 文件存储

#### 方案 C: 自建后端 (Node.js + PostgreSQL)
技术栈:
- Express.js / Fastify
- Prisma ORM
- PostgreSQL / MySQL

---

## 🔐 安全建议

### 生产环境检查清单

- [ ] **环境变量**: 确保敏感信息（API密钥）通过环境变量管理
- [ ] **HTTPS**: 启用 SSL 证书（Let's Encrypt 免费）
- [ ] **CORS**: 配置正确的跨域策略
- [ ] **输入验证**: 验证所有用户输入
- [ ] **SQL注入防护**: 使用参数化查询（如果连接真实数据库）
- [ ] **认证授权**: 添加用户登录和权限管理（推荐使用 Supabase Auth）
- [ ] **数据加密**: 敏感数据（如数据库密码）加密存储
- [ ] **CSP 头**: 配置内容安全策略

### 示例: Nginx 安全头
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
```

---

## 🎯 性能优化建议

### 构建优化
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router'],
          'ui-vendor': ['@mui/material', '@radix-ui/react-dialog'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})
```

### 代码分割
使用 React.lazy() 进行路由懒加载:
```typescript
const Dashboard = lazy(() => import('./components/dashboard'));
```

### 资源优化
- 压缩图片（使用 WebP 格式）
- 启用 Gzip/Brotli 压缩
- 使用 CDN 加速静态资源

---

## 📞 常见问题

### Q: 部署后页面刷新 404？
**A**: 需要配置服务器将所有路由指向 `index.html`（见上方 Nginx 配置）

### Q: 构建后体积过大？
**A**: 
1. 使用 `pnpm build` 后运行 `npx vite-bundle-visualizer` 分析包体积
2. 考虑按需导入 UI 组件库
3. 移除未使用的依赖

### Q: 如何连接真实数据库？
**A**: 
1. **前端直连（不推荐）**: 暴露数据库凭据有安全风险
2. **通过后端API（推荐）**: 创建 Node.js 中间层或使用 Supabase
3. **Serverless 函数**: 使用 Vercel/Netlify Functions

### Q: 如何实现用户登录？
**A**: 推荐方案:
- Supabase Auth（最简单）
- Firebase Authentication
- Auth0 / Clerk（第三方服务）
- 自建 JWT 认证

---

## 📝 维护建议

### 依赖更新
```bash
# 检查过时依赖
pnpm outdated

# 安全更新
pnpm audit

# 更新依赖
pnpm update
```

### 监控和日志
建议集成:
- **错误追踪**: Sentry
- **分析**: Google Analytics / Plausible
- **性能监控**: Vercel Analytics / Cloudflare Web Analytics

---

## 🎉 下一步

1. **本地测试**: 运行 `pnpm build && pnpm preview` 确保构建正常
2. **选择托管**: 根据需求选择部署平台（推荐 Vercel）
3. **配置域名**: 绑定自定义域名
4. **数据升级**: 考虑从 localStorage 迁移到 Supabase
5. **添加认证**: 实现用户登录系统
6. **监控上线**: 配置错误追踪和分析

---

## 📄 许可证

MIT License

---

**需要帮助?** 
- 查看 [Vite 文档](https://vitejs.dev/)
- 查看 [React Router 文档](https://reactrouter.com/)
- 查看 [Supabase 文档](https://supabase.com/docs)
