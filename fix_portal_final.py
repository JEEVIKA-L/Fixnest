import sys
import os
import re

file_path = r'd:\Fixnest\frontend\src\components\cards\CardModal.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the end of return AnimatePresence ); }; with portal completion
# We're looking for the very last AnimatePresence and closing paren
# The current pattern is:
# 728:  </AnimatePresence>
# 729:  );
# 730: };

pattern = r'(</AnimatePresence>)\s*(\);)\s*(\};)'
replacement = r'\1\n  , document.body);\n};'

if re.search(pattern, content):
    new_content = re.sub(pattern, replacement, content)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Fixed portal closing in CardModal.tsx.")
else:
    print("Could not find portal closing pattern.")
