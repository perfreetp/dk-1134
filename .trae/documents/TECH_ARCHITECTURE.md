# 通勤拼车移动应用技术架构文档

## 1. 技术选型

### 1.1 前端框架
- **核心框架**: React 18.2+
- **构建工具**: Vite 4.5+
- **UI组件库**: TailwindCSS 3.4+
- **路由管理**: React Router 6
- **状态管理**: Zustand
- **动画库**: Framer Motion
- **图标库**: Lucide React
- **地图服务**: 高德地图 Web API（模拟数据展示）

### 1.2 后端技术（模拟）
- **数据存储**: localStorage（浏览器本地存储）
- **模拟API**: 自定义Hooks模拟异步数据
- **数据格式**: JSON

### 1.3 开发规范
- **代码规范**: ESLint + Prettier
- **命名规范**: 
  - 组件: PascalCase (如 `TripCard.tsx`)
  - Hooks: camelCase (如 `useTrips.ts`)
  - 样式类: TailwindCSS原子化类名
  - 文件夹: kebab-case (如 `components/home`)
- **注释规范**: 中文注释，简洁明了

---

## 2. 项目结构

```
src/
├── components/          # 公共组件
│   ├── common/          # 通用组件（Button, Input, Modal等）
│   ├── layout/          # 布局组件（Header, TabBar等）
│   └── icons/           # 图标组件
├── pages/               # 页面组件
│   ├── Home/           # 首页
│   ├── Publish/        # 发布行程
│   ├── Order/          # 订单确认
│   ├── Message/        # 消息
│   └── Profile/        # 我的
├── hooks/               # 自定义Hooks
│   ├── useAuth.ts
│   ├── useTrips.ts
│   ├── useOrders.ts
│   └── useMessages.ts
├── store/               # 状态管理
│   ├── userStore.ts
│   ├── tripStore.ts
│   └── messageStore.ts
├── data/                # 模拟数据
│   ├── mockUsers.ts
│   ├── mockTrips.ts
│   ├── mockOrders.ts
│   └── mockMessages.ts
├── utils/               # 工具函数
│   ├── format.ts
│   └── calculate.ts
├── types/               # TypeScript类型定义
│   └── index.ts
├── App.tsx
├── main.tsx
└── index.css
```

---

## 3. 数据流设计

### 3.1 状态管理架构
采用Zustand进行轻量级状态管理，分为三个主要Store：

#### UserStore（用户状态）
```typescript
interface UserState {
  currentUser: User | null;
  locations: Location[];
  isLoggedIn: boolean;
  // Actions
  login: (user: User) => void;
  logout: () => void;
  addLocation: (location: Location) => void;
  removeLocation: (id: string) => void;
}
```

#### TripStore（行程状态）
```typescript
interface TripState {
  trips: Trip[];
  publishedTrips: Trip[];
  appliedTrips: Trip[];
  // Actions
  fetchTrips: () => Promise<void>;
  publishTrip: (trip: Trip) => Promise<void>;
  applyForTrip: (tripId: string) => Promise<void>;
}
```

#### MessageStore（消息状态）
```typescript
interface MessageState {
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  // Actions
  sendMessage: (conversationId: string, content: string) => void;
  markAsRead: (conversationId: string) => void;
}
```

### 3.2 数据获取策略
- 页面加载时从localStorage读取初始数据
- 使用React Query风格的自定义Hook进行数据获取
- 乐观更新提供即时反馈
- 失败时回滚状态

---

## 4. 核心功能实现

### 4.1 路线匹配算法
```typescript
// 计算两点间的直线距离（简化版 Haversine 公式）
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number

// 计算绕路距离
function calculateDetour(
  tripRoute: Coordinate[],
  userOrigin: Coordinate,
  userDestination: Coordinate
): number

// 匹配算法
function matchTrips(userCriteria: MatchCriteria, allTrips: Trip[]): MatchResult[]
```

### 4.2 费用计算
```typescript
// 基础费用 = 起步价 + 里程费
// 里程费 = 超出起步里程的公里数 × 单价
function calculatePrice(distance: number, basePrice: number = 5): number
```

### 4.3 信用评分系统
```typescript
// 初始信用分: 600
// 每次好评 +5分
// 每次差评 -10分
// 完成行程 +2分
// 取消订单 -5分
function updateCreditScore(currentScore: number, action: CreditAction): number
```

---

## 5. 页面路由设计

### 5.1 路由配置
```
/                   → 首页（路线匹配）
/publish            → 发布行程
/order              → 订单列表
/order/:id          → 订单详情
/message            → 消息列表
/message/:id        → 聊天详情
/profile            → 我的
/profile/routes     → 常用路线管理
/profile/invoice    → 发票备注管理
/profile/blacklist  → 黑名单管理
```

### 5.2 导航结构
- 底部TabBar固定展示（5个主要页面）
- Header区域显示当前页面标题和操作按钮
- Modal弹窗用于地点选择、时间设置等

---

## 6. 组件设计规范

### 6.1 组件分类
| 组件类型 | 命名规范 | 示例 |
|---------|---------|------|
| 页面组件 | PascalCase | `HomePage.tsx` |
| 功能组件 | PascalCase | `TripCard.tsx` |
| 布局组件 | PascalCase | `TabBar.tsx` |
| UI组件 | PascalCase | `Button.tsx` |

### 6.2 组件接口规范
```typescript
interface ComponentProps {
  // 必要属性
  className?: string;
  children?: React.ReactNode;
  // 业务属性
  [key: string]: any;
}
```

### 6.3 组件拆分原则
- 单一职责：每个组件只负责一个功能
- 可复用性：通用组件放入components/common
- 可测试性：业务逻辑与UI分离

---

## 7. 样式设计规范

### 7.1 设计系统
- **主题色**: `#4F46E5` (靛蓝色 - 主色调)
- **辅助色**: `#10B981` (绿色 - 成功/确认)
- **警示色**: `#F59E0B` (橙色 - 警告)
- **危险色**: `#EF4444` (红色 - 错误/取消)
- **背景色**: `#F9FAFB` (浅灰白)
- **文字色**: `#111827` (深灰黑)

### 7.2 间距系统
```
spacing: {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px'
}
```

### 7.3 圆角系统
```
borderRadius: {
  sm: '6px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  full: '9999px'
}
```

### 7.4 阴影系统
```
boxShadow: {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.15)'
}
```

---

## 8. 移动端适配

### 8.1 视口设置
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

### 8.2 安全区域
```css
padding-bottom: env(safe-area-inset-bottom);
```

### 8.3 触摸优化
- 最小点击区域: 44px × 44px
- 按钮间距: 至少8px
- 输入框高度: 至少44px

---

## 9. 性能优化

### 9.1 代码分割
- 使用React.lazy进行路由级代码分割
- 动态导入大型组件

### 9.2 图片优化
- 使用WebP格式（支持情况下）
- 图片懒加载

### 9.3 缓存策略
- localStorage缓存用户数据
- 会话级缓存减少重复请求

---

## 10. 数据持久化

### 10.1 localStorage结构
```typescript
{
  "shunlu_user": User,
  "shunlu_locations": Location[],
  "shunlu_trips": Trip[],
  "shunlu_orders": Order[],
  "shunlu_messages": Message[],
  "shunlu_blacklist": string[]
}
```

### 10.2 数据初始化
- 首次访问时加载默认模拟数据
- 每次操作后自动保存到localStorage

---

## 11. 安全性考虑

### 11.1 前端安全
- XSS防护：React自动转义
- 输入验证：表单数据校验
- 敏感信息不存储在localStorage

### 11.2 模拟认证
- 简化版登录流程
- Session模拟
- 权限控制（示例）

---

## 12. 测试策略

### 12.1 功能测试
- 页面渲染测试
- 用户交互测试
- 数据状态测试

### 12.2 适配测试
- 移动端视口测试
- 触摸交互测试
- 横屏适配测试

---

*文档版本: v1.0*
*最后更新: 2026-06-12*
