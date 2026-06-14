/** 成员数据类型 */
export interface Member {
  id: string
  /** 成员名（英文） */
  name: string
  /** 显示名称 */
  displayName: string
  /** 简介 */
  bio: string
  /** 头像路径 */
  avatar: string
  /** 渐变配色 */
  gradient: string
  /** 代表 emoji */
  emoji: string
  /** 排序 */
  sortOrder: number
}

export const members: Member[] = [
  {
    id: "ruka",
    name: "Ruka",
    displayName: "Ruka",
    bio: "",
    avatar: "",
    gradient: "from-pink-400 to-rose-400",
    emoji: "🦥", // 树懒
    sortOrder: 1,
  },
  {
    id: "pharita",
    name: "Pharita",
    displayName: "Pharita",
    bio: "",
    avatar: "",
    gradient: "from-purple-400 to-violet-400",
    emoji: "🦌", // 小鹿
    sortOrder: 2,
  },
  {
    id: "asa",
    name: "Asa",
    displayName: "Asa",
    bio: "",
    avatar: "",
    gradient: "from-blue-400 to-cyan-400",
    emoji: "🐱", // 粉色猫 -> 用 🐱，Asa 代表色是蓝/青
    sortOrder: 3,
  },
  {
    id: "ahyeon",
    name: "Ahyeon",
    displayName: "Ahyeon",
    bio: "",
    avatar: "",
    gradient: "from-amber-400 to-orange-400",
    emoji: "🦋", // 蝴蝶
    sortOrder: 4,
  },
  {
    id: "rami",
    name: "Rami",
    displayName: "Rami",
    bio: "",
    avatar: "",
    gradient: "from-green-400 to-emerald-400",
    emoji: "🐬", // 海豚
    sortOrder: 5,
  },
  {
    id: "rora",
    name: "Rora",
    displayName: "Rora",
    bio: "",
    avatar: "",
    gradient: "from-sky-400 to-blue-400",
    emoji: "🐼", // 熊猫
    sortOrder: 6,
  },
  {
    id: "chiquita",
    name: "Chiquita",
    displayName: "Chiquita",
    bio: "",
    avatar: "",
    gradient: "from-yellow-400 to-pink-400",
    emoji: "🐈‍⬛", // 黑猫
    sortOrder: 7,
  },
]

export function getMemberById(id: string): Member | undefined {
  return members.find((m) => m.id === id)
}

export function getMemberByPagePath(path: string): Member | undefined {
  return members.find((m) => m.name.toLowerCase() === path.toLowerCase())
}

