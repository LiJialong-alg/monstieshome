/** 照片数据类型 - 预留后续对接数据库 */
export interface GalleryImage {
  id: string
  title: string
  description: string
  /** 本地图片路径或外部 URL */
  src: string
  /** 标签 */
  tags: string[]
  /** 外部链接（如原图、微博等） */
  link?: string
  /** 创建时间 ISO 字符串 */
  createdAt: string
  /** 随机倾斜角度，前端生成时填充 */
  rotate?: number
}

/** 示例用的 mock 数据，后续替换为数据库查询 */
export const mockGallery: GalleryImage[] = [
  {
    id: "g001",
    title: "春日出游",
    description: "阳光正好，微风不燥～",
    src: "",
    tags: ["日常", "春天"],
    link: "https://example.com/1",
    createdAt: "2025-03-15T10:00:00Z",
  },
  {
    id: "g002",
    title: "舞台直拍",
    description: "今晚的舞台真的太棒了！",
    src: "",
    tags: ["舞台", "直拍"],
    link: "https://example.com/2",
    createdAt: "2025-03-14T20:30:00Z",
  },
  {
    id: "g003",
    title: "可爱瞬间",
    description: "被抓拍到的小表情 🥺",
    src: "",
    tags: ["可爱"],
    link: "https://example.com/3",
    createdAt: "2025-03-13T15:00:00Z",
  },
  {
    id: "g004",
    title: "后台花絮",
    description: "彩排间隙偷偷拍的～",
    src: "",
    tags: ["花絮", "后台"],
    link: "https://example.com/4",
    createdAt: "2025-03-12T18:00:00Z",
  },
  {
    id: "g005",
    title: "粉丝合照",
    description: "今天和姐妹一起应援！💜",
    src: "",
    tags: ["合照", "应援"],
    link: "https://example.com/5",
    createdAt: "2025-03-11T14:00:00Z",
  },
  {
    id: "g006",
    title: "签名时刻",
    description: "拿到了签名，开心到飞起 ✨",
    src: "",
    tags: ["签名", "特别"],
    link: "https://example.com/6",
    createdAt: "2025-03-10T11:00:00Z",
  },
]

// ── 后续对接数据库的接口占位 ──

/** 获取所有照片 - 后续替换为 Prisma 查询 */
export async function getAllImages(): Promise<GalleryImage[]> {
  // TODO: 替换为 prisma.galleryImage.findMany(...)
  return mockGallery.map((img) => ({
    ...img,
    rotate: Math.random() * 6 - 3, // -3deg ~ 3deg
  }))
}

/** 按标签筛选 - 后续替换为数据库过滤 */
export async function getImagesByTag(tag: string): Promise<GalleryImage[]> {
  // TODO: 替换为 prisma 条件查询
  const all = await getAllImages()
  return all.filter((img) => img.tags.includes(tag))
}

/** 获取单张照片 - 后续替换为 findUnique */
export async function getImageById(id: string): Promise<GalleryImage | null> {
  // TODO: 替换为 prisma.galleryImage.findUnique(...)
  return mockGallery.find((img) => img.id === id) ?? null
}
