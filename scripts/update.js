import fs from "fs";

const path = "profile/README.md";
const org = "CTU-ITClub";
const url = `https://api.github.com/orgs/${org}/repos?sort=updated&direction=desc&per_page=4`;

const token = process.env.TOKEN;
if (!token) throw new Error("Missing token");

const readme = fs.readFileSync(path, "utf8");

const response = await fetch(url, {
  headers: {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
  },
}).then((r) => r.json());

const content = response
  .map(
    (repo, i) =>
      `- **${repo.name}** – cập nhật: ${timeAgo(repo.updated_at)}`
  )
  .join("<br/> ");

const output = readme.replace(
  /<!-- START -->[\s\S]*?<!-- END -->/,
  `<!-- START -->\n${content}\n<!-- END -->`
);

fs.writeFileSync(path, output);

function timeAgo(dateString) {
  const diff = Date.now() - new Date(dateString).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  const mo = Math.floor(d / 30);
  const y = Math.floor(mo / 12);
  if (y) return `${y} năm trước`;
  if (mo) return `${mo} tháng trước`;
  if (d) return `${d} ngày trước`;
  if (h) return `${h} giờ trước`;
  if (m) return `${m} phút trước`;
  return "vừa xong";
}
