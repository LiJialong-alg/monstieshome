/** 外链数据类型 - 预留后续对接数据库 */
export interface ExternalLink {
  id: string
  /** 站点名称 */
  name: string
  /** 简介 */
  description: string
  /** 完整 URL */
  url: string
  /** 图标标识，使用 lucide icon 名称，或 'globe' 兜底 */
  icon: string
  /** 分类 */
  category: string
  /** 排序权重 */
  sortOrder: number
  visible: boolean
}

/** Mock 数据 */
const mockLinks: ExternalLink[] = [
  {
    id: "l001",
    name: "微博超话",
    description: "官方超话社区，最新动态和粉丝讨论聚集地",
    url: "https://weibo.com",
    icon: "MessageCircle",
    category: "社交平台",
    sortOrder: 1,
    visible: true,
  },
  {
    id: "l002",
    name: "Bilibili",
    description: "官方 B 站账号，舞台直拍、花絮、直播回放",
    url: "https://bilibili.com",
    icon: "Video",
    category: "视频平台",
    sortOrder: 2,
    visible: true,
  },
  {
    id: "l003",
    name: "Instagram",
    description: "官方 Instagram，日常照片和幕后花絮",
    url: "https://instagram.com",
    icon: "Camera",
    category: "社交平台",
    sortOrder: 3,
    visible: true,
  },
  {
    id: "l004",
    name: "Twitter / X",
    description: "官方 Twitter，即时消息和公告",
    url: "https://twitter.com",
    icon: "MessageCircle",
    category: "社交平台",
    sortOrder: 4,
    visible: true,
  },
  {
    id: "l005",
    name: "YouTube",
    description: "官方 YouTube 频道，完整舞台和综艺内容",
    url: "https://youtube.com",
    icon: "Video",
    category: "视频平台",
    sortOrder: 5,
    visible: true,
  },
  {
    id: "l006",
    name: "官方 Fanclub",
    description: "官方粉丝俱乐部，会员专属内容",
    url: "https://example.com/fanclub",
    icon: "Heart",
    category: "官方站点",
    sortOrder: 6,
    visible: true,
  },
]

// ── 后续对接数据库的接口占位 ──

/** 按分类获取所有可见外链 */
export async function getAllLinks(): Promise<ExternalLink[]> {
  // TODO: 替换为 prisma 查询
  return mockLinks
    .filter((l) => l.visible)
    .sort((a, b) => a.sortOrder - b.sortOrder)
}

/** 按分类分组 */
export async function getLinksGrouped(): Promise<Record<string, ExternalLink[]>> {
  const links = await getAllLinks()
  const grouped: Record<string, ExternalLink[]> = {}
  for (const link of links) {
    if (!grouped[link.category]) grouped[link.category] = []
    grouped[link.category].push(link)
  }
  return grouped
}
