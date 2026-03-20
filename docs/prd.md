# 视频素材管理平台 - 前端系统设计与需求文档 (PRD & Tech Spec)

## 一、 项目概述 (Project Overview)

本项目旨在为内容运营团队打造一个高效的**视频素材管理与数据洞察平台**。通过提供高度可定制的检索方案、流畅的浏览体验以及直观的数据统计视图，帮助业务人员快速定位目标素材，并从宏观角度掌握素材大盘的运作健康度。

项目核心分为两大模块：
1. **Part A - 素材管理核心链路**：支持数据驱动的高级检索、灵活的排序机制、定制化的详情预览（含本地持久化）。
2. **Part B - 数据可视化看板**：基于素材元数据，提供多维度的业务统计图表。

---

## 二、 需求详细描述 (Detailed Requirements)

### 2.1 Part A: 素材列表与检索
*   **视图展现**：列表需支持“卡片 (Card)”与“表格 (Table)”两种模式展现，默认展示封面缩略图、标题、上传人、审核状态、文件大小。支持标准分页功能。
*   **动态过滤 (FilterBar)**：
    *   支持按审核状态、标签、上传人、城市进行多条件组合过滤。
    *   **硬性约束**：必须采用配置（Schema）数据驱动，严禁将具体的过滤表单项硬编码在视图组件中。
*   **排序控制 (SortControl)**：支持按“上传时间”与“文件大小”两个维度进行升序/降序排列。

### 2.2 Part A: 素材详情与配置保存
*   **详情交互**：点击列表项，以“侧边抽屉 (Drawer)”形式平滑滑出详情页，避免页面频繁跳转打断用户心流。
*   **多媒体展示**：详情页需内嵌完整的视频播放器能力，并展示该素材的所有元信息。
*   **字段裁剪 (Field Selector)**：
    *   用户可在详情页勾选/取消勾选需要查看的字段信息（如：隐藏文件大小，只看标签）。
    *   **持久化要求**：用户的勾选偏好需实时保存至 `localStorage`，确保页面刷新或下次进入时偏好不丢失。

### 2.3 Part B: 数据可视化 (基于 >= 20 条 Mock 数据)
*   **图表一 (状态分布)**：展示各审核状态（待审核、已通过、已驳回）的素材数量占比分布（推荐：饼图/环形图）。
*   **图表二 (城市统计)**：展示各城市的素材数量与平均文件大小的对比关系（推荐：双Y轴 柱状+折线混合图）。
*   **图表三 (自选业务价值图表)**：**近7天素材上传趋势图（按天统计的折线图）**。
    *   *选题原因说明*：内容平台的生命力在于持续的创作者活跃度。上传趋势图能直观反映创作者的活跃周期，帮助运营团队发现低谷期并及时介入（如策划激励活动），或在高峰期提前进行服务器扩容预警，具备极高的实际业务导向价值。

---

## 三、 技术选型与依据 (Technology Stack & Rationale)

本项目选用 **React 生态** 作为核心技术栈。

| 技术分类 | 选型 | 选择依据说明 |
| :--- | :--- | :--- |
| **核心框架** | **React 18** | React 的单向数据流和 Hooks 范式非常适合构建复杂的受控表单组件（如 `FilterBar`）。采用函数式编程能让“数据驱动视图”的架构心智模型更清晰。 |
| **开发语言** | **TypeScript** | **核心必选项**。数据驱动强依赖于严谨的 Schema 契约（Interface）。TS 提供的静态类型检查能避免配置项拼写错误，极大提升代码自文档化能力和工程质量。 |
| **UI 组件库** | **Ant Design (v5)** | 业界公认的标准中后台组件库。其 `Table`、`Drawer` 等组件高度成熟，能极大缩短基础页面的搭建时间，将研发精力聚焦在核心业务组件的封装上。 |
| **数据可视化** | **ECharts (echarts-for-react)** | 百度开源的工业级图表库。对于 Part B 中要求的“双Y轴混合图”，ECharts 的配置项极为丰富，能轻松实现精准的定制化渲染。 |
| **网络与 Mock**| **MSW (Mock Service Worker)**| 相比传统 `mock.js` 重写 XHR 对象，MSW 在 Service Worker 层拦截请求，可以在浏览器 Network 面板看到真实的请求记录，是目前最优雅、最贴近真实业务的本地联调方案。 |
| **状态持久化** | **Zustand** | 极其轻量的状态管理库，官方自带 `persist` 中间件，一行代码即可实现题目要求的“字段裁剪偏好持久化至 localStorage”的功能，无需手动编写 `setItem/getItem` 逻辑。 |

---

## 四、 核心组件设计与拆分 (Component Architecture)

系统遵循 **Container（容器组件/智能组件）** 与 **Presentational（展示组件/木偶组件）** 分离原则。

### 4.1 动态过滤引擎：`FilterBar` 组件设计
`FilterBar` 设计为纯粹的展示组件，采用 **Schema-Driven (配置驱动)** 模式。它不知道什么是具体业务字段，只负责将传入的 JSON Schema 渲染成对应的 Antd 控件，并将用户的操作组装成 Value 对象抛出。

**核心接口契约 (TypeScript):**
```typescript
// 1. 定义支持的控件类型和单项配置
export interface FilterSchemaItem {
  key: string;            // 如 'city', 'status'
  label: string;          // 如 '所属城市'
  type: 'select' | 'input' | 'radio' | 'tags'; 
  options?: Array<{ label: string; value: string | number }>;
  placeholder?: string;
}

// 2. FilterBar 组件 Props
export interface FilterBarProps {
  schema: FilterSchemaItem[];     // 渲染规则（外部传入）
  value: Record<string, any>;     // 当前检索值（受控）
  onChange: (val: Record<string, any>) => void; // 值变更回调
  onReset: () => void;            // 重置操作
}
```
- **设计优点**：完全符合开闭原则（OCP）。未来如需新增过滤项，只需在父组件的 schema 数组中增加一个对象即可，无需修改 FilterBar 内部的代码，具有极强的可复用性。

### 4.2 排序组件：SortControl

独立的纯 UI 组件，接收 currentField 和 order ('asc' | 'desc')，通过点击触发 onSortChange 回调，由外层页面级组件统筹发起状态更新和 API 请求。

### 4.3 详情抽屉与字段裁剪器：AssetDrawer & FieldSelector

- **AssetDrawer**: 接收 visible, assetId, onClose。内部维护视频播放器和详情描述列表（基于 Descriptions 组件）。
- **FieldSelector**:
  - 读取由 Zustand 管理的全局状态 useFieldPreferencesStore
  - 提供 Checkbox Group，展示所有可用的字段键值对
  - 勾选变化时，调用 Store 的更新方法，Zustand 底层的 persist 会自动将其同步覆写到浏览器的 localStorage 中

## 五、 Mock 数据结构契约 (Data Model)

```typescript
export interface VideoAsset {
  id: string;               // 唯一标识
  title: string;            // 视频标题
  thumbnailUrl: string;    // 封面图链接
  videoUrl: string;         // 视频播放源链接
  uploader: string;         // 上传人姓名
  status: 'pending' | 'approved' | 'rejected'; // 审核状态
  fileSize: number;         // 文件大小 (单位: bytes)
  uploadTime: string;       // 上传时间 (ISO 8601 格式)
  city: string;             // 上传城市
  tags: string[];           // 标签集合
  duration: number;        // 视频时长 (秒)
}
<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false} -->

```

## 六、 方案局限性与进一步优化建议 (Limitations & Future Optimizations)
受限于目前的单机 Mock 环境与快速迭代要求，本方案在面对未来复杂企业级演进时存在以下局限性。针对这些局限性，提供相应的演进思路以供评审参考：
### 6.1 FilterBar 组件的进阶演进
 - **局限性**：静态选项无法应对海量数据与动态联动
 - **现状**：目前 Schema 中的 options 往往是硬编码的静态数组。无法处理“上传人多达数千个（需远程模糊搜索）”或“省市区级联（需联动请求）”的复杂需求。
 - **演进方案**：在 Schema 定义中引入异步机制 `request: (currentValues) => Promise<Options[]>；`支持将 `type: 'select'` 扩展为 `type: 'remote-select'；`并引入 ``dependencies: string`