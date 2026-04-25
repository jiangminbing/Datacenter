# 数据集市 (Data Marketplace)

<div align="center">

**统一的数据源管理和 API 配置平台**

[![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646cff?logo=vite)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

</div>

---

## ✨ 功能特性

### 🎯 核心功能

- **📊 概览仪表板**
  - 实时统计数据源、API 和查询数量
  - 可视化数据展示
  - 快速访问常用功能

- **🔌 数据源管理**
  - 支持多种数据源类型:
    - 关系型数据库 (MySQL, PostgreSQL, SQL Server)
    - NoSQL 数据库 (MongoDB, Redis)
    - REST API
    - 云存储 (AWS S3, Google Cloud Storage)
  - 连接测试和验证
  - 数据库驱动上传支持

- **🚀 API 管理**
  - RESTful API 端点配置
  - 支持 GET、POST、PUT、DELETE 方法
  - 请求/响应数据格式配置
  - API 测试工具

- **📝 SQL 查询编辑器**
  - 可视化查询构建器
  - SQL 语法高亮
  - 查询结果预览
  - 查询历史记录

### 🎨 用户体验

- 🎯 直观的侧边栏导航
- 🌓 响应式设计，支持多种屏幕尺寸
- ⚡️ 快速加载和流畅交互
- 🎨 现代化 UI 设计（基于 Material-UI 和 Radix UI）

---

## 🚀 快速开始

### 前置要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0 (推荐)

### 安装

```bash
# 克隆项目
git clone <your-repo-url>
cd data-marketplace

# 安装依赖
pnpm install
```

### 开发

```bash
# 启动开发服务器
pnpm dev

# 应用将在 http://localhost:5173 运行
```

### 构建

```bash
# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview
```

---

## 📁 项目结构

```
data-marketplace/
├── src/
│   ├── app/
│   │   ├── App.tsx                 # 应用根组件
│   │   ├── routes.tsx              # 路由配置
│   │   ├── components/
│   │   │   ├── layout.tsx          # 主布局（侧边栏+内容区）
│   │   │   ├── dashboard.tsx       # 概览仪表板
│   │   │   ├── data-sources.tsx    # 数据源管理
│   │   │   ├── api-management.tsx  # API 管理
│   │   │   ├── query-editor.tsx    # 查询编辑器
│   │   │   └── ui/                 # UI 组件库
│   │   └── lib/
│   │       └── storage.ts          # 数据存储管理
│   ├── styles/                     # 全局样式
│   └── main.tsx                    # React 入口
├── index.html                      # HTML 入口
├── vite.config.ts                  # Vite 配置
└── package.json                    # 项目配置
```

---

## 🛠️ 技术栈

### 核心框架
- **React 18.3** - UI 框架
- **TypeScript** - 类型安全
- **Vite 6.x** - 构建工具
- **React Router 7.x** - 路由管理

### UI 组件库
- **Tailwind CSS 4.x** - 样式框架
- **Material-UI (MUI)** - 组件库
- **Radix UI** - 无障碍组件
- **Lucide React** - 图标库

### 其他工具
- **React Hook Form** - 表单管理
- **Recharts** - 数据可视化
- **Sonner** - 通知提示
- **date-fns** - 日期处理

---

## 🎯 使用指南

### 1️⃣ 添加数据源

1. 导航到「数据源」页面
2. 点击「新建数据源」按钮
3. 填写数据源信息:
   - 名称和描述
   - 选择数据源类型
   - 填写连接配置（主机、端口、用户名、密码等）
   - （可选）上传数据库驱动文件
4. 点击「测试连接」验证配置
5. 保存数据源

### 2️⃣ 创建 API

1. 导航到「API 管理」页面
2. 点击「新建 API」
3. 配置 API 参数:
   - API 名称和端点路径
   - 选择关联的数据源
   - 设置 HTTP 方法（GET/POST/PUT/DELETE）
   - 配置请求参数和响应格式
4. 保存 API 配置

### 3️⃣ 执行查询

1. 导航到「查询编辑器」
2. 选择数据源
3. 编写 SQL 查询或使用可视化构建器
4. 点击「执行查询」查看结果
5. （可选）保存查询供后续使用

---

## 🚢 部署

### 静态托管（推荐）

#### Vercel
```bash
npm i -g vercel
vercel --prod
```

#### Netlify
```bash
npm i -g netlify-cli
netlify deploy --prod
```

#### GitHub Pages
参见 [DEPLOYMENT.md](./DEPLOYMENT.md) 中的 GitHub Actions 配置

### Docker
```bash
docker build -t data-marketplace .
docker run -d -p 8080:80 data-marketplace
```

### 传统服务器
参见 [DEPLOYMENT.md](./DEPLOYMENT.md) 中的 Nginx 配置

📖 **详细部署指南请查看 [DEPLOYMENT.md](./DEPLOYMENT.md)**

---

## 🔄 数据持久化

### 当前方案
应用目前使用 **localStorage** 存储数据，适合快速测试和原型开发。

### 升级到云数据库

推荐使用 **Supabase**（PostgreSQL 后端服务）:

```bash
# 安装 Supabase 客户端
pnpm add @supabase/supabase-js

# 配置环境变量
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

**优势:**
- ✅ 真实的 PostgreSQL 数据库
- ✅ 实时数据同步
- ✅ 内置用户认证
- ✅ RESTful API 和 GraphQL
- ✅ 免费套餐慷慨

其他选项: Firebase, AWS Amplify, 自建后端（Node.js + Express）

---

## 🔐 安全建议

对于生产环境部署:

- [ ] 启用 HTTPS（使用 Let's Encrypt 免费证书）
- [ ] 添加用户认证和授权（推荐 Supabase Auth）
- [ ] 加密敏感数据（数据库密码等）
- [ ] 配置 CORS 策略
- [ ] 实施输入验证和 SQL 注入防护
- [ ] 使用环境变量管理 API 密钥
- [ ] 配置内容安全策略（CSP）

---

## 🤝 贡献

欢迎贡献！请遵循以下步骤:

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 📝 更新日志

### v0.0.1 (当前版本)
- ✅ 初始版本发布
- ✅ 数据源管理功能
- ✅ API 配置功能
- ✅ SQL 查询编辑器
- ✅ 概览仪表板

---

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](./LICENSE) 文件

---

## 🙏 致谢

本项目使用了以下优秀的开源项目:

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Material-UI](https://mui.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Lucide Icons](https://lucide.dev/)

---

## 📞 联系方式

如有问题或建议，欢迎:
- 提交 Issue
- 发起 Discussion
- 发送邮件至 [your-email@example.com]

---

<div align="center">

**⭐️ 如果这个项目对你有帮助，请给个 Star!**

Made with ❤️ using React + Vite

</div>
