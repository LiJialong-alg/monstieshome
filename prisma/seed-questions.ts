import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const questions = [
  { scope: "group", memberId: "", question: "BABYMONSTER 的出道单曲专辑是哪一张？", options: ["BABYMONS7ER", "BABYMONSTER", "DRIP", "FOREVER"], answer: 0, explanation: "团体首张单曲专辑为《BABYMONS7ER》。", difficulty: "入门" },
  { scope: "group", memberId: "", question: "以下哪首歌是 BABYMONSTER 的代表作？", options: ["SHEESH", "LOVE DIVE", "ANTIFRAGILE", "Dynamite"], answer: 0, explanation: "《SHEESH》是团体早期最具代表性的歌曲之一。", difficulty: "入门" },
  { scope: "group", memberId: "", question: "BABYMONSTER 来自哪家公司？", options: ["YG Entertainment", "SM Entertainment", "JYP Entertainment", "HYBE"], answer: 0, explanation: "BABYMONSTER 是 YG Entertainment 旗下女团。", difficulty: "入门" },
  { scope: "member", memberId: "ruka", question: "Ruka 的国籍是？", options: ["日本", "韩国", "泰国", "中国"], answer: 0, explanation: "Ruka 来自日本。", difficulty: "入门" },
  { scope: "member", memberId: "asa", question: "Asa 最常被粉丝称赞的能力是？", options: ["RAP", "芭蕾", "小提琴", "料理"], answer: 0, explanation: "Asa 以敏捷、有辨识度的 RAP 受到喜爱。", difficulty: "进阶" },
  { scope: "member", memberId: "chiquita", question: "Chiquita 来自哪个国家？", options: ["泰国", "日本", "韩国", "菲律宾"], answer: 0, explanation: "Chiquita 是来自泰国的成员。", difficulty: "入门" },
]

async function main() {
  if (await prisma.question.count() > 0) return
  for (const item of questions) {
    await prisma.question.create({ data: { ...item, options: JSON.stringify(item.options) } })
  }
}

main().finally(() => prisma.$disconnect())
