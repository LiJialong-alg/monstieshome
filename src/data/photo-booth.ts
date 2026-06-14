/** 拍照姿势模板 */
export interface PoseTemplate {
  id: string
  name: string
  description: string
  /** 姿势引导框在画布中的位置比例 (0~1) */
  guideRect: { x: number; y: number; width: number; height: number }
  /** 用户位置提示文案 */
  hint: string
  /** 爱豆素材在画布中的位置比例 (0~1) */
  idolRect: { x: number; y: number; width: number; height: number }
  /** 爱豆素材文件名（放 public/images/photo-booth/ 下） */
  idolSrc: string
  /** 示例缩略图 */
  thumbnail: string
}

/** 爱豆素材定义 */
export interface IdolAsset {
  id: string
  name: string
  displayName: string
  src: string
  /** 可选的姿势模板列表 */
  poses: string[]
}

/** 拍立得边框样式 */
export interface FrameStyle {
  id: string
  name: string
  /** 边框内边距比例 */
  padding: number
  /** 底部白边高度比例 */
  bottomMargin: number
}

/**
 * 生成内联 SVG data URL 作为占位图
 * 后续替换为真实图片路径即可
 */
function placeholderSVG(emoji: string, label: string, w = 400, h = 600): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#f3e5f5"/>
        <stop offset="100%" style="stop-color:#fce4ec"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#bg)" rx="16"/>
    <text x="${w / 2}" y="${h * 0.35}" text-anchor="middle" font-size="80">${emoji}</text>
    <text x="${w / 2}" y="${h * 0.5}" text-anchor="middle" font-size="14" fill="#9c27b0" font-weight="bold">BABYMONSTER</text>
    <text x="${w / 2}" y="${h * 0.56}" text-anchor="middle" font-size="11" fill="#bbb">${label}</text>
    <text x="${w / 2}" y="${h * 0.62}" text-anchor="middle" font-size="10" fill="#ddd">替换为真实爱豆素材</text>
  </svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

function thumbSVG(emoji: string, label: string): string {
  return placeholderSVG(emoji, label, 120, 120)
}

// ── 静态素材数据 ──

export const poseTemplates: PoseTemplate[] = [
  {
    id: "pose-heart",
    name: "比心",
    description: "和爱豆一起比心 ❤️",
    guideRect: { x: 0.52, y: 0.08, width: 0.4, height: 0.7 },
    hint: "站到右侧框内，对着镜头比心～",
    idolRect: { x: 0.05, y: 0.08, width: 0.4, height: 0.7 },
    idolSrc: placeholderSVG("❤️", "比心姿势"),
    thumbnail: thumbSVG("❤️", "比心"),
  },
  {
    id: "pose-handshake",
    name: "牵手",
    description: "和爱豆牵手同框 🤝",
    guideRect: { x: 0.08, y: 0.12, width: 0.4, height: 0.65 },
    hint: "站到左侧框内，伸出手做牵手姿势～",
    idolRect: { x: 0.48, y: 0.12, width: 0.4, height: 0.65 },
    idolSrc: placeholderSVG("🤝", "牵手姿势"),
    thumbnail: thumbSVG("🤝", "牵手"),
  },
  {
    id: "pose-victory",
    name: "剪刀手",
    description: "经典的 V 字胜利手势 ✌️",
    guideRect: { x: 0.05, y: 0.08, width: 0.45, height: 0.75 },
    hint: "站到左侧框内，比 V 字手势～",
    idolRect: { x: 0.48, y: 0.08, width: 0.45, height: 0.75 },
    idolSrc: placeholderSVG("✌️", "剪刀手姿势"),
    thumbnail: thumbSVG("✌️", "剪刀手"),
  },
  {
    id: "pose-shoulder",
    name: "搭肩",
    description: "和爱豆肩并肩 👫",
    guideRect: { x: 0.05, y: 0.1, width: 0.42, height: 0.7 },
    hint: "站到左侧框内，自然站立微笑～",
    idolRect: { x: 0.5, y: 0.1, width: 0.42, height: 0.7 },
    idolSrc: placeholderSVG("👫", "肩并肩姿势"),
    thumbnail: thumbSVG("👫", "搭肩"),
  },
]

export const idolAssets: IdolAsset[] = [
  {
    id: "idol-default",
    name: "default",
    displayName: "默认爱豆",
    src: placeholderSVG("🌟", "默认爱豆站位"),
    poses: ["pose-heart", "pose-handshake", "pose-victory", "pose-shoulder"],
  },
]

export const frameStyles: FrameStyle[] = [
  { id: "classic", name: "经典白边", padding: 0.04, bottomMargin: 0.18 },
  { id: "narrow", name: "窄边", padding: 0.02, bottomMargin: 0.12 },
  { id: "wide", name: "宽边", padding: 0.06, bottomMargin: 0.22 },
]

/** 获取默认姿势模板 */
export function getDefaultPose(): PoseTemplate {
  return poseTemplates[0]
}

/** 通过 id 获取姿势模板 */
export function getPoseById(id: string): PoseTemplate | undefined {
  return poseTemplates.find((p) => p.id === id)
}
