# 更新日志

所有重要的项目变更都将记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

---

## [未发布]

### 计划功能
- 用户认证和授权系统
- Supabase 数据持久化集成
- 真实数据库连接功能
- API 测试和调试工具
- 数据可视化图表
- 导入/导出配置功能
- 团队协作功能
- 审计日志

---

## [0.0.1] - 2026-04-14

### 新增
- ✨ 初始版本发布
- 📊 概览仪表板
  - 数据源统计卡片
  - API 数量统计
  - 查询历史统计
  - 可视化数据展示
- 🔌 数据源管理
  - 支持 MySQL、PostgreSQL、MongoDB、REST API 等
  - 数据源连接配置
  - 连接测试功能
  - 数据库驱动上传
  - 数据源列表和搜索
- 🚀 API 管理
  - RESTful API 端点创建
  - 支持 GET、POST、PUT、DELETE 方法
  - 请求/响应配置
  - API 列表和过滤
- 📝 SQL 查询编辑器
  - 可视化查询构建器
  - 数据源选择
  - 查询执行和结果预览
  - 查询历史记录
- 🎨 用户界面
  - 响应式侧边栏导航
  - Material-UI 组件
  - Tailwind CSS 样式
  - 深色/浅色主题支持
- 💾 数据持久化
  - localStorage 本地存储
  - 数据自动保存

### 技术实现
- ⚡️ Vite 6.x 构建系统
- ⚛️ React 18.3 + TypeScript
- 🛣️ React Router 7.x 路由管理
- 🎨 Tailwind CSS 4.x + MUI 组件库
- 📦 pnpm 包管理

### 部署支持
- 📝 完整的部署文档
- 🐳 Docker 支持
- ☁️ Vercel/Netlify 配置文件
- 🔄 GitHub Actions CI/CD 工作流
- 📋 部署检查清单

---

## 版本说明

### 版本号格式
遵循语义化版本 `主版本.次版本.修订版本`:
- **主版本**: 不兼容的 API 变更
- **次版本**: 向下兼容的功能新增
- **修订版本**: 向下兼容的问题修正

### 变更类型
- `新增` - 新功能
- `变更` - 现有功能的变更
- `废弃` - 即将移除的功能
- `移除` - 已移除的功能
- `修复` - 错误修复
- `安全` - 安全漏洞修复

---

[未发布]: https://github.com/your-username/data-marketplace/compare/v0.0.1...HEAD
[0.0.1]: https://github.com/your-username/data-marketplace/releases/tag/v0.0.1
