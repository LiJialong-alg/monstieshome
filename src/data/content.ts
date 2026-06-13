/** 站点首页的可配置内容 */

export interface FeatureCard {
  title: string
  description: string
  href: string
  icon: string // lucide icon name
  gradient: string
}

export interface HighlightItem {
  title: string
  subtitle: string
  image?: string
  href: string
  tag?: string
}

export const homeFeatures: FeatureCard[] = [
  {
    title: "最新照片",
    description: "看看最近大家分享了什么好照片吧～",
    href: "/gallery",
    icon: "Camera",
    gradient: "from-pink-500 to-rose-400",
  },
  {
    title: "公告更新",
    description: "站点动态、活动信息第一时间掌握",
    href: "/announcements",
    icon: "Megaphone",
    gradient: "from-purple-500 to-violet-400",
  },
  {
    title: "外链导航",
    description: "好用的应援工具和有趣站点收集",
    href: "/links",
    icon: "Link",
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    title: "精选合集",
    description: "整理好的主题相册，慢慢翻～",
    href: "/gallery",
    icon: "Sparkles",
    gradient: "from-amber-400 to-orange-400",
  },
]

export const todayHighlight: HighlightItem = {
  title: "今天还没有新内容～",
  subtitle: "站长正在路上，先随便逛逛吧 ✨",
  href: "/gallery",
  tag: "日常",
}

export const recentUploads: HighlightItem[] = [
  {
    title: "示例照片 01",
    subtitle: "等待站长上传第一张照片",
    href: "/gallery",
    tag: "新到",
  },
  {
    title: "示例照片 02",
    subtitle: "这里会展示最新的图片",
    href: "/gallery",
    tag: "新到",
  },
  {
    title: "示例照片 03",
    subtitle: "未来会支持自动排列展示",
    href: "/gallery",
    tag: "新到",
  },
  {
    title: "示例照片 04",
    subtitle: "移动端横向滑动浏览",
    href: "/gallery",
    tag: "新到",
  },
  {
    title: "示例照片 05",
    subtitle: "也可以纵向瀑布流查看",
    href: "/gallery",
    tag: "新到",
  },
]
