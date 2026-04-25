# 🚀 快速开始指南

## 5分钟快速部署

### 前置要求
- ✅ Node.js 18+ ([下载](https://nodejs.org/))
- ✅ Git ([下载](https://git-scm.com/))

---

## 🏃 方法 1: Vercel 一键部署（最快）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/data-marketplace)

1. 点击上方按钮
2. 登录 Vercel（可用 GitHub 账号）
3. 点击 "Deploy"
4. 等待 2-3 分钟
5. ✅ 完成！获得一个 `https://your-app.vercel.app` 链接

---

## 💻 方法 2: 本地运行（开发环境）

### 第一步：克隆项目
```bash
git clone <your-repo-url>
cd data-marketplace
```

### 第二步：安装依赖
```bash
# 安装 pnpm（如果还没有）
npm install -g pnpm

# 安装项目依赖
pnpm install
```

### 第三步：启动开发服务器
```bash
pnpm dev
```

打开浏览器访问显示的地址（通常是 `http://localhost:5173`）

✅ **完成！** 应用正在运行

---

## 📦 方法 3: 构建生产版本

```bash
# 构建
pnpm build

# 预览（可选）
pnpm preview
```

构建产物在 `dist/` 文件夹，可以部署到任何静态托管服务。

---

## 🐳 方法 4: Docker 运行

```bash
# 构建镜像
docker build -t data-marketplace .

# 运行容器
docker run -d -p 8080:80 data-marketplace

# 或使用 docker-compose
docker-compose up -d
```

访问 `http://localhost:8080`

---

## 🎯 可用命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 构建生产版本 |
| `pnpm preview` | 预览生产构建 |
| `pnpm clean` | 清理构建产物 |

---

## 📚 下一步

### 功能探索
1. **概览** - 查看数据源和API统计
2. **数据源** - 添加 MySQL、PostgreSQL、MongoDB 等数据源
3. **API 管理** - 创建 RESTful API 端点
4. **查询编辑器** - 可视化构建 SQL 查询

### 进阶配置
- 📖 [完整部署指南](./DEPLOYMENT.md) - 各种部署方案详解
- ✅ [部署检查清单](./EXPORT_CHECKLIST.md) - 部署前必读
- 🔧 [环境变量配置](./.env.example) - 配置 Supabase 等服务

### 数据持久化升级
当前使用 localStorage 存储数据（仅限浏览器本地）。要实现跨设备同步，推荐升级到 Supabase：

```bash
# 安装 Supabase 客户端
pnpm add @supabase/supabase-js

# 复制环境变量模板
cp .env.example .env

# 编辑 .env 填入你的 Supabase 凭据
# 获取免费凭据：https://supabase.com
```

---

## ❓ 常见问题

**Q: 端口被占用怎么办？**
```bash
# Vite 会自动尝试下一个可用端口
# 或手动指定端口
pnpm dev --port 3000
```

**Q: 安装依赖失败？**
```bash
# 清理缓存重新安装
pnpm clean
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

**Q: 构建后页面空白？**
- 检查浏览器控制台错误
- 确保 `vite.config.ts` 中的 `base` 路径正确
- 查看 [故障排查](./EXPORT_CHECKLIST.md#故障排查)

---

## 🆘 需要帮助？

- 📖 查看 [README.md](./README.md)
- 📋 查看 [DEPLOYMENT.md](./DEPLOYMENT.md)
- 🐛 提交 [GitHub Issue](./issues)
- 💬 加入社区讨论

---

**🎉 开始使用数据集市，连接你的数据源！**
