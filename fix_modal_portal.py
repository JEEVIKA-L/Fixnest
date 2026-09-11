import sys
import os

file_path = r'd:\Fixnest\frontend\src\components\cards\CardModal.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# 1. Add isMounted state
# Find line with activeBoard
for i, line in enumerate(lines):
    if 'const { activeBoard } = useBoardStore();' in line:
        # Check if isMounted already exists
        if 'const [isMounted, setIsMounted]' not in lines[i+1]:
            lines.insert(i+1, "  const [isMounted, setIsMounted] = React.useState(false);\n  React.useEffect(() => { setIsMounted(true); }, []);\n")
        break

# 2. Wrap return statement
# Find the return statement inside CardModal component
for i, line in enumerate(lines):
    if 'return (' in line:
        if 'return createPortal(' not in line:
            lines[i] = "  if (!isMounted) return null;\n\n  return createPortal(\n"
        break

# 3. Add document.body to createPortal
# Look for the last </AnimatePresence> before component close
for i in range(len(lines) - 1, 0, -1):
    if '  </AnimatePresence>' in lines[i] and '  );' in lines[i+1]:
        if ', document.body);' not in lines[i+1]:
            lines[i+1] = "  , document.body);\n"
        break

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("Patch applied to CardModal.tsx.")
