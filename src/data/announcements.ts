/** 公告数据类型 - 预留后续对接数据库 */
export interface Announcement {
  id: string
  /** 标题 */
  title: string
  /** 发布日期 ISO 字符串 */
  date: string
  /** 摘要 / 正文（纯文本或简单 HTML） */
  summary: string
  /** 标签 */
  tags: string[]
  /** 是否置顶 */
  pinned: boolean
  /** 是否可见 */
  visible: boolean
  createdAt: string
}

/** Mock 数据 */
const mockAnnouncements: Announcement[] = [
  {
    id: "a001",
    title: "🎉 站点正式上线啦！",
    date: "2025-06-14",
    summary: "经过一段时间的准备，Monsties Home 终于和大家见面了！目前首页、照片墙、公告、外链导航等功能已初步完成，后续会持续更新内容和功能。欢迎常来玩～",
    tags: ["站点公告"],
    pinned: true,
    visible: true,
    createdAt: "2025-06-14T00:00:00Z",
  },
  {
    id: "a002",
    title: "照片墙功能更新预告",
    date: "2025-06-13",
    summary: "照片墙即将支持「拍立得生成器」功能，可以选择成员照片 + 上传自己的合照，自动生成拍立得风格图片，敬请期待！",
    tags: ["功能预告", "照片"],
    pinned: false,
    visible: true,
    createdAt: "2025-06-13T10:00:00Z",
  },
  {
    id: "a003",
    title: "关于本站的定位",
    date: "2025-06-12",
    summary: "本站是一个粉丝个人运营的非官方站点，主要目的是记录和分享美好瞬间。所有内容均由站长手动整理上传，与任何官方组织无关。如有任何问题或建议，欢迎通过留言或社交媒体联系站长。",
    tags: ["站点说明"],
    pinned: false,
    visible: true,
    createdAt: "2025-06-12T08:00:00Z",
  },
  {
    id: "a004",
    title: "新成员入驻纪念",
    date: "2025-06-10",
    summary: "等待站长来写第一篇有意义的公告... ✨",
    tags: ["日常"],
    pinned: false,
    visible: true,
    createdAt: "2025-06-10T12:00:00Z",
  },
]

// ── 后续对接数据库的接口占位 ──

/** 获取所有可见公告，按时间倒序，置顶优先 */
export async function getAnnouncements(): Promise<Announcement[]> {
  // TODO: 替换为 prisma 查询
  return mockAnnouncements
    .filter((a) => a.visible)
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
}

/** 获取单条公告 */
export async function getAnnouncementById(id: string): Promise<Announcement | null> {
  // TODO: 替换为 prisma.findUnique
  return mockAnnouncements.find((a) => a.id === id) ?? null
}
