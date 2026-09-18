服务器相关细节在桌面的 codex 文件夹里。

部署规则：

- 服务器上的项目、`.env` 和正式数据库独立存在，服务器数据是线上数据的唯一来源。
- 本地修改后只部署程序文件，禁止用本地数据库或本地 `.env` 覆盖服务器版本。
- 需要同步数据或项目时，只允许将服务器版本同步到本地备份；不得反向替换服务器数据。

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
