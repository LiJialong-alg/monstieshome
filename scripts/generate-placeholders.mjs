/**
 * 生成占位图素材
 * 用 canvas 创建简单的 SVG 占位图
 * 后续替换为真实爱豆素材即可
 */
import { writeFileSync, mkdirSync } from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outputDir = path.join(__dirname, "..", "public", "images", "photo-booth")
mkdirSync(outputDir, { recursive: true })

const colors = [
  { name: "heart", bg: "#fce4ec", text: "#e91e63", emoji: "❤️" },
  { name: "handshake", bg: "#e8f5e9", text: "#4caf50", emoji: "🤝" },
  { name: "victory", bg: "#e3f2fd", text: "#2196f3", emoji: "✌️" },
  { name: "shoulder", bg: "#fff3e0", text: "#ff9800", emoji: "👫" },
]

// 生成爱豆占位图（全身剪影）
function generateIdolSVG(name, color) {
  const size = 300
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${color.bg}" rx="12"/>
  <text x="${size/2}" y="${size*0.3}" text-anchor="middle" font-size="80">${color.emoji}</text>
  <text x="${size/2}" y="${size*0.5}" text-anchor="middle" font-size="14" fill="${color.text}">IDOL</text>
  <text x="${size/2}" y="${size*0.58}" text-anchor="middle" font-size="11" fill="#999">爱豆素材</text>
  <text x="${size/2}" y="${size*0.66}" text-anchor="middle" font-size="10" fill="#bbb">替换为真实图片</text>
</svg>`
}

// 生成缩略图
function generateThumbSVG(name, color) {
  const size = 120
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${color.bg}" rx="8"/>
  <text x="${size/2}" y="${size*0.45}" text-anchor="middle" font-size="36">${color.emoji}</text>
  <text x="${size/2}" y="${size*0.7}" text-anchor="middle" font-size="9" fill="${color.text}">${name}</text>
</svg>`
}

// 生成默认爱豆占位（全身剪影）
const defaultIdolSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
  <rect width="400" height="600" fill="#f3e5f5" rx="16"/>
  <text x="200" y="200" text-anchor="middle" font-size="100">🌟</text>
  <text x="200" y="280" text-anchor="middle" font-size="16" fill="#9c27b0" font-weight="bold">BABYMONSTER</text>
  <text x="200" y="310" text-anchor="middle" font-size="12" fill="#bbb">爱豆站位占位图</text>
  <text x="200" y="340" text-anchor="middle" font-size="11" fill="#ccc">替换为真实爱豆图片</text>
  <rect x="100" y="380" width="200" height="60" rx="30" fill="#e1bee7" opacity="0.5"/>
  <text x="200" y="418" text-anchor="middle" font-size="14" fill="#7b1fa2">等待替换素材</text>
</svg>`

// 写入文件
writeFileSync(path.join(outputDir, "idol-default.png"), defaultIdolSVG)
console.log("✅ 创建: idol-default.png (SVG 占位)")

for (const c of colors) {
  const idolSVG = generateIdolSVG(c.name, c)
  writeFileSync(path.join(outputDir, `idol-${c.name}.png`), idolSVG)
  console.log(`✅ 创建: idol-${c.name}.png`)

  const thumbSVG = generateThumbSVG(c.name, c)
  writeFileSync(path.join(outputDir, `thumb-${c.name}.png`), thumbSVG)
  console.log(`✅ 创建: thumb-${c.name}.png`)
}

console.log("\n🎉 所有占位图已生成！")
console.log("📝 后续替换为真实爱豆素材即可")
