export const siteConfig = {
  name: "MONSTIEZ HOME",
  shortName: "M-LAB",
  tagline: "测一测，你有多懂 TA",
  description: "面向粉丝的团体与成员知识问答网站。",
  url: "https://monstiez.lijialong.online",
  since: 2026,
  footer: {
    copyright: `© ${new Date().getFullYear()} MONSTIEZ HOME`,
    disclaimer: "本站为粉丝运营的非官方知识问答网站。",
  },
  nav: [] as Array<{ label: string; href: string }>,
}

export type SiteConfig = typeof siteConfig
