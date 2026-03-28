import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const map = {
  'bg-white': 'dark:bg-[#1E293B]',
  'bg-[#F6F7FB]': 'dark:bg-[#0F172A]',
  'bg-gray-50': 'dark:bg-[#1A2333]',
  'border-[#E5E7EB]': 'dark:border-[#334155]',
  'border-gray-100': 'dark:border-[#1E293B]',
  'border-gray-200': 'dark:border-[#334155]',
  'text-gray-900': 'dark:text-gray-50',
  'text-[#1F2937]': 'dark:text-gray-100',
  'text-gray-800': 'dark:text-gray-200',
  'text-gray-700': 'dark:text-gray-300',
  'text-gray-600': 'dark:text-gray-400',
  'text-gray-500': 'dark:text-gray-400'
};

function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); 
}

let modified = 0;

walkDir('./src', (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let originalCode = fs.readFileSync(filePath, 'utf8');
    let code = originalCode;
    
    for (const [light, dark] of Object.entries(map)) {
      const eLight = escapeRegex(light);
      const regex = new RegExp(`(^|[\\s'"\`])(${eLight})(?=[\\s'"\`]|$)`, 'g');
      
      code = code.replace(regex, (match, p1, p2) => {
         return `${p1}${light} ${dark}`;
      });
    }
    
    // Deduplication of dark classes if already existed
    for (const dark of Object.values(map)) {
        const dReg = new RegExp(`(${escapeRegex(dark)}\\s*){2,}`, 'g');
        code = code.replace(dReg, `${dark} `);
    }
    
    // Fix any potential string template literal issues like bg-white  dark...
    code = code.replace(/  +/g, ' '); 

    // Because of regex, "bg-white dark:bg-[#1E293B]" applied twice becomes "bg-white dark:bg-[#1E293B] dark:bg-[#1E293B]". The deduplication fixes this.
    // wait, what if it was "bg-white ${" -> "bg-white dark... ${"
    
    if (code !== originalCode) {
      fs.writeFileSync(filePath, code, 'utf8');
      console.log(`Updated ${filePath}`);
      modified++;
    }
  }
});

console.log(`\nCompleted. Modified ${modified} files.`);
