import fs from "fs";
import path from "path";

const staff = [
  ["clara","Clara"],
  ["elias","Elias"], 
  ["harbor","Michael"],
  ["librarian","Amelia"],
  ["sentry","David"],
  ["pathfinder","Olivia"],
  ["anvil","Marcus"],
  ["integrationsim","Samantha"],
  ["aegis","Isabella"],
  ["sherlock","Noah"],
  ["maestro","Daniel"],
];

// Ensure public/avatars directory exists
const avatarsDir = path.join(process.cwd(), "public", "avatars");
fs.mkdirSync(avatarsDir, { recursive: true });

// Color palettes for diversity
const colors = [
  { bg: '#F3F7FF', stroke: '#87A5FF', fill: '#6B7FD3' }, // blue
  { bg: '#FFF4F0', stroke: '#FFB08A', fill: '#E85A2B' }, // orange  
  { bg: '#F0FDF4', stroke: '#86EFAC', fill: '#22C55E' }, // green
  { bg: '#FEF3F2', stroke: '#FDA29B', fill: '#EF4444' }, // red
  { bg: '#F8F4FF', stroke: '#C4B5FD', fill: '#8B5CF6' }, // purple
  { bg: '#FFFBEB', stroke: '#FDE68A', fill: '#F59E0B' }, // amber
];

for (const [handle, name] of staff) {
  const colorIndex = staff.findIndex(s => s[0] === handle) % colors.length;
  const color = colors[colorIndex];
  
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='192' height='192'>
    <rect width='100%' height='100%' rx='24' fill='${color.bg}'/>
    <circle cx='96' cy='84' r='44' fill='white' stroke='${color.stroke}' stroke-width='3'/>
    <circle cx='80' cy='74' r='6' fill='${color.fill}'/><circle cx='112' cy='74' r='6' fill='${color.fill}'/>
    <path d='M72 96 Q96 114 120 96' stroke='${color.fill}' stroke-width='3' fill='none' stroke-linecap='round'/>
    <text x='96' y='170' text-anchor='middle' font-family='Inter, system-ui' font-size='22' font-weight='600' fill='#334155'>${name[0]}</text>
  </svg>`;
  
  fs.writeFileSync(path.join(avatarsDir, `${handle}.svg`), svg);
}

console.log(`✅ Generated ${staff.length} SVG avatars → public/avatars/`);
console.log('🎨 Avatars created with diverse color palettes for professional branding');