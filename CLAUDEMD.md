# Monsties Home — 开发约定

## 1. 组件命名

| 类型 | 规则 | 示例 |
|------|------|------|
| 页面组件 | 放 `app/xxx/page.tsx`，默认导出，函数名 = 页面名 + Page | `GalleryPage` |
| 布局组件 | `components/layout/`，PascalCase | `Navbar`, `Footer` |
| 通用组件（可复用） | `components/shared/`，PascalCase | `PolaroidCard`, `AnnouncementCard` |
| UI 原子组件 | `components/ui/`，PascalCase | `Button`, `Card` |
| 组件文件名 = 组件名，kebab-case | `polaroid-card.tsx` |  |

## 2. 数据结构

- 所有实体类型定义在 `src/data/` 下，一个文件一个模型
- 类型名使用 PascalCase，字段使用 camelCase
- tags 字段统一用 `string`（JSON 字符串），入库前 `JSON.stringify`，展示时 `JSON.parse`
- 日期统一用 ISO 字符串（`string` 类型），数据库用 `DateTime` 自动处理
- id 统一用 `string`（CUID）

```typescript
// ✅ 正确
export interface Announcement {
  id: string
  title: string
  date: string        // "2025-06-14"
  summary: string
  tags: string         // JSON.stringify([...])
  pinned: boolean
  visible: boolean
  createdAt: string
}
```

## 3. 样式约定

- 不要写死颜色值，使用 Tailwind 颜色类
- 主色调：purple / pink / blue 系
- 卡片统一用 `rounded-2xl border border-purple-100/60 bg-white/80 backdrop-blur-sm`
- 渐变按钮用 `bg-gradient-to-r from-purple-500 to-pink-500`
- 加载态图标用 `animate-bounce` + 对应模块的 lucide icon
- 空态也用对应模块的 lucide icon + 灰色文字
- 标题用 `bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent`
- 所有页面 max-w 统一 `max-w-5xl`（前后台一致），后台内容区加 `max-w-3xl`

## 4. 图标和按钮

- 图标库只用 `lucide-react`，一个组件一个 icon
- 按钮优先用渐变风格 `from-purple-500 to-pink-500`、白色圆角 `rounded-full`
- 操作按钮（新增/保存）用渐变按钮
- 取消/次要操作用 `border border-purple-200 bg-white text-gray-600`
- 删除操作用 `text-gray-400 hover:bg-red-50 hover:text-red-500`
- 过渡动画统一 `transition-all duration-300`
- hover 抬起效果统一 `hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-200/40`

## 5. Mock 数据

- 每个模块的 mock 数据放在 `src/data/xxx.ts` 中
- 文件内同时包含类型定义（interface）
- 函数名使用 `getXxx()` / `getAllXxx()` 格式
- 函数返回 Promise，预留未来替换为 Prisma 查询
- 函数内部 TODO 注释标记替换位置

```typescript
export async function getAnnouncements(): Promise<Announcement[]> {
  // TODO: 替换为 prisma.announcement.findMany(...)
  return mockData.filter(...)
}
```

- 前台页面从 API 读取数据（`fetch("/api/xxx")`），不走 mock 函数
- mock 函数的 main 用途是类型参考和测试

## 6. Prisma 模型命名

| DB 模型 | 文件名 | 字段规则 |
|---------|--------|----------|
| Image | `prisma/schema.prisma` 内 model | 单数 PascalCase |
| Announcement | 同上 | 同上 |
| ExternalLink | 同上 | 同上 |

- model 名 = 单数 PascalCase
- 字段 camelCase
- id 统一 `@id @default(cuid())`
- 所有模型有 `createdAt` / `updatedAt`
- 数组字段（tags）存 JSON string，不要用关联表

## 7. 页面布局规则

- 每个页面统一用 `mx-auto max-w-5xl px-4 py-8 sm:py-12`
- 后台页面用 `mx-auto max-w-5xl px-4 py-6 sm:py-8`
- 每个页面必须有页头（标题+icon+描述）
- 所有加载用 `loading && (...)` 模式
- 所有空态用 `items.length === 0 && (...)` 模式
- 后台页面统一用 `useCrud` hook（`src/lib/use-admin.ts`）

## 8. 状态展示

### 加载态
```tsx
<div className="flex items-center justify-center py-20">
  <div className="flex flex-col items-center gap-3 text-gray-400">
    <SomeIcon size={32} className="animate-bounce text-purple-300" />
    <p className="text-sm">加载中...</p>
  </div>
</div>
```

### 空状态
```tsx
<div className="flex flex-col items-center justify-center py-20 text-center">
  <SomeIcon size={48} className="text-purple-300 mb-4" />
  <p className="text-gray-400 text-sm">友好提示文字</p>
</div>
```

### 错误状态（暂统一用 toast 或 alert，后续可替换）
- API 调用失败先用 `.catch(console.error)` 兜底
- 后续统一接入 toast 组件

## 9. 后台管理约定

- 每个模块一个页面文件 `app/admin/xxx/page.tsx`
- 统一使用 `useCrud<T>(apiPath)` hook
- 表单弹出用 `AdminFormModal` 组件
- 列表展示用 `AdminTable` 组件
- 后台 API 路由统一：
  - `GET /api/xxx` — 获取列表
  - `POST /api/xxx` — 新增
  - `GET /api/xxx/[id]` — 获取单条
  - `PUT /api/xxx/[id]` — 编辑
  - `DELETE /api/xxx/[id]` — 删除

## 10. 文案约定

- 所有站点文案（站点名、导航、标语、描述）写在 `src/data/site.ts`
- 前台展示的所有文本内容可配置，不写死与具体偶像团体绑定的文案
- 用户可见文案使用中文
- 代码注释和变量名使用英文
