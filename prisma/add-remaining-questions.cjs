const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

const additions = [
  { scope: "group", memberId: "", question: "BABYMONSTER首张迷你专辑的名称是？", options: ["BABYMONS7ER", "DRIP", "WE GO UP", "HELLO MONSTERS"], answer: 0 },
  { scope: "group", memberId: "", question: "《SHEESH》收录于哪张专辑？", options: ["DRIP", "BABYMONS7ER", "WE GO UP", "FOREVER"], answer: 1 },
  { scope: "group", memberId: "", question: "以下哪首歌是BABYMONSTER的出道前作品？", options: ["DREAM", "DRIP", "FOREVER", "SHEESH"], answer: 0 },
  { scope: "group", memberId: "", question: "《LIKE THAT》由哪位歌手参与创作并赠予BABYMONSTER？", options: ["Charlie Puth", "Bruno Mars", "The Weeknd", "Justin Bieber"], answer: 0 },
  { scope: "group", memberId: "", question: "BABYMONSTER首张正规专辑的名称是？", options: ["BABYMONS7ER", "DRIP", "BATTER UP", "SHEESH"], answer: 1 },
  { scope: "group", memberId: "", question: "展示BABYMONSTER最终出道过程的节目名称是？", options: ["LAST EVALUATION", "YG TREASURE BOX", "MIXNINE", "WIN: WHO IS NEXT"], answer: 0 },

  { scope: "member", memberId: "ruka", question: "Ruka的出生日期是？", options: ["2002年3月20日", "2002年4月20日", "2003年3月20日", "2001年3月20日"], answer: 0 },
  { scope: "member", memberId: "ruka", question: "Ruka在BABYMONSTER中是年龄排行第几的成员？", options: ["第一", "第二", "第三", "第四"], answer: 0 },
  { scope: "member", memberId: "ruka", question: "Ruka的本名是？", options: ["河井瑠花", "榎並杏紗", "郑雅贤", "李茶仁"], answer: 0 },
  { scope: "member", memberId: "ruka", question: "Ruka来自哪个国家？", options: ["韩国", "日本", "泰国", "中国"], answer: 1 },
  { scope: "member", memberId: "ruka", question: "Ruka出生于哪一年？", options: ["2001年", "2002年", "2003年", "2004年"], answer: 1 },
  { scope: "member", memberId: "ruka", question: "Ruka的生日位于哪个月份？", options: ["1月", "3月", "8月", "11月"], answer: 1 },
  { scope: "member", memberId: "ruka", question: "Ruka和哪位成员同为日本籍？", options: ["Asa", "Rami", "Rora", "Ahyeon"], answer: 0 },
  { scope: "member", memberId: "ruka", question: "Ruka在团内主要以哪项能力受到关注？", options: ["说唱与舞蹈", "古典钢琴", "小提琴", "作曲指挥"], answer: 0 },

  { scope: "member", memberId: "pharita", question: "Pharita的出生日期是？", options: ["2005年8月26日", "2005年2月26日", "2006年8月26日", "2004年8月26日"], answer: 0 },
  { scope: "member", memberId: "pharita", question: "Pharita的本名是？", options: ["Pharita Chaikong", "Riracha Phondechaphiphat", "Shin Haram", "Lee Dain"], answer: 0 },
  { scope: "member", memberId: "pharita", question: "Pharita来自哪个国家？", options: ["日本", "韩国", "泰国", "新加坡"], answer: 2 },
  { scope: "member", memberId: "pharita", question: "Pharita出生于哪一年？", options: ["2004年", "2005年", "2006年", "2007年"], answer: 1 },
  { scope: "member", memberId: "pharita", question: "Pharita和哪位成员同为泰国籍？", options: ["Chiquita", "Asa", "Ruka", "Rami"], answer: 0 },
  { scope: "member", memberId: "pharita", question: "Pharita的生日位于哪个月份？", options: ["3月", "4月", "8月", "10月"], answer: 2 },
  { scope: "member", memberId: "pharita", question: "Pharita在团内年龄排行是？", options: ["第一", "第二", "第三", "第四"], answer: 1 },

  { scope: "member", memberId: "asa", question: "Asa的出生日期是？", options: ["2006年4月17日", "2006年3月17日", "2005年4月17日", "2007年4月17日"], answer: 0 },
  { scope: "member", memberId: "asa", question: "Asa的本名是？", options: ["榎並杏紗", "河井瑠花", "郑雅贤", "申厦蓝"], answer: 0 },
  { scope: "member", memberId: "asa", question: "Asa和哪位成员同为日本籍？", options: ["Ruka", "Pharita", "Chiquita", "Rora"], answer: 0 },

  { scope: "member", memberId: "ahyeon", question: "Ahyeon的出生日期是？", options: ["2007年4月11日", "2007年10月17日", "2006年4月17日", "2008年8月14日"], answer: 0 },
  { scope: "member", memberId: "ahyeon", question: "Ahyeon的本名是？", options: ["郑雅贤", "李茶仁", "申厦蓝", "榎並杏紗"], answer: 0 },
  { scope: "member", memberId: "ahyeon", question: "Ahyeon出生于哪一年？", options: ["2005年", "2006年", "2007年", "2008年"], answer: 2 },
  { scope: "member", memberId: "ahyeon", question: "Ahyeon的生日位于哪个月份？", options: ["2月", "4月", "8月", "10月"], answer: 1 },

  { scope: "member", memberId: "rami", question: "Rami的出生日期是？", options: ["2007年10月17日", "2007年4月11日", "2008年10月17日", "2006年10月17日"], answer: 0 },
  { scope: "member", memberId: "rami", question: "Rami的本名是？", options: ["申厦蓝", "郑雅贤", "李茶仁", "河井瑠花"], answer: 0 },
  { scope: "member", memberId: "rami", question: "Rami来自哪个国家？", options: ["泰国", "韩国", "日本", "中国"], answer: 1 },
  { scope: "member", memberId: "rami", question: "Rami出生于哪一年？", options: ["2006年", "2007年", "2008年", "2009年"], answer: 1 },
  { scope: "member", memberId: "rami", question: "Rami在出道前公开活动时使用过哪个名字？", options: ["Haram", "Dain", "Riracha", "Ruka"], answer: 0 },
  { scope: "member", memberId: "rami", question: "Rami的生日位于哪个月份？", options: ["3月", "4月", "8月", "10月"], answer: 3 },
  { scope: "member", memberId: "rami", question: "Rami在团内年龄排行是？", options: ["第三", "第四", "第五", "第六"], answer: 2 },
  { scope: "member", memberId: "rami", question: "Rami在成为练习生前有过哪类经历？", options: ["童装模特", "职业网球选手", "芭蕾舞教师", "新闻主播"], answer: 0 },

  { scope: "member", memberId: "rora", question: "Rora的出生日期是？", options: ["2008年8月14日", "2008年4月14日", "2007年8月14日", "2009年8月14日"], answer: 0 },
  { scope: "member", memberId: "rora", question: "Rora的本名是？", options: ["李茶仁", "郑雅贤", "申厦蓝", "河井瑠花"], answer: 0 },
  { scope: "member", memberId: "rora", question: "Rora出生于哪一年？", options: ["2006年", "2007年", "2008年", "2009年"], answer: 2 },
  { scope: "member", memberId: "rora", question: "Rora在加入YG前曾是哪一儿童组合的成员？", options: ["U.SSO Girl", "AKMU", "2NE1", "BLACKPINK"], answer: 0 },

  { scope: "member", memberId: "chiquita", question: "Chiquita的出生日期是？", options: ["2009年2月17日", "2009年8月17日", "2008年2月17日", "2010年2月17日"], answer: 0 },
  { scope: "member", memberId: "chiquita", question: "Chiquita的本名是？", options: ["Riracha Phondechaphiphat", "Pharita Chaikong", "Lee Dain", "Shin Haram"], answer: 0 },
  { scope: "member", memberId: "chiquita", question: "Chiquita出生于哪一年？", options: ["2007年", "2008年", "2009年", "2010年"], answer: 2 },
  { scope: "member", memberId: "chiquita", question: "Chiquita在BABYMONSTER中是？", options: ["大姐", "队内第三", "忙内", "队内第二"], answer: 2 },
  { scope: "member", memberId: "chiquita", question: "Chiquita和哪位成员同为泰国籍？", options: ["Pharita", "Ruka", "Asa", "Rami"], answer: 0 },
  { scope: "member", memberId: "chiquita", question: "Chiquita的生日位于哪个月份？", options: ["2月", "4月", "8月", "10月"], answer: 0 },
  { scope: "member", memberId: "chiquita", question: "Chiquita的哥哥是从事演艺活动的哪位艺人？", options: ["Copper Dechawat", "BamBam", "Ten", "Nichkhun"], answer: 0 },
]

async function main() {
  const existing = await prisma.question.findMany({ select: { scope: true, memberId: true, question: true, sortOrder: true } })
  const existingTexts = new Set(existing.map((item) => `${item.scope}|${item.memberId}|${item.question.trim()}`))
  const maxOrder = new Map()
  for (const item of existing) {
    const key = `${item.scope}|${item.memberId}`
    maxOrder.set(key, Math.max(maxOrder.get(key) ?? -1, item.sortOrder))
  }

  let created = 0
  for (const item of additions) {
    const textKey = `${item.scope}|${item.memberId}|${item.question.trim()}`
    if (existingTexts.has(textKey)) continue
    const categoryKey = `${item.scope}|${item.memberId}`
    const sortOrder = (maxOrder.get(categoryKey) ?? -1) + 1
    await prisma.question.create({ data: { ...item, options: JSON.stringify(item.options), image: "", explanation: "", difficulty: "入门", visible: true, sortOrder } })
    maxOrder.set(categoryKey, sortOrder)
    existingTexts.add(textKey)
    created += 1
  }
  console.log(`CREATED=${created}`)
}

main().finally(() => prisma.$disconnect())
