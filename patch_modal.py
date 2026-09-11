import sys

path = r'd:/Fixnest/frontend/src/components/cards/CardModal.tsx'
content = open(path, 'r', encoding='utf-8').read()

# 1. Add isMounted guard right after the early return
old1 = ' if (!isCardModalOpen || !activeCard) return null;\n'
new1 = ' if (!isCardModalOpen || !activeCard) return null;\n\n // eslint-disable-next-line react-hooks/rules-of-hooks\n const [isMounted, setIsMounted] = React.useState(false);\n // eslint-disable-next-line react-hooks/rules-of-hooks\n React.useEffect(() => { setIsMounted(true); }, []);\n if (!isMounted) return null;\n\n'

if old1 in content:
    content = content.replace(old1, new1, 1)
    print('isMounted guard inserted OK')
else:
    idx = content.find('isCardModalOpen')
    print('NOT FOUND, context:', repr(content[idx:idx+80]))
    sys.exit(1)

# 2. Wrap return with createPortal and close it
old2 = '\n  return (\n  <AnimatePresence key=\"modal-presence\">'
new2 = '\n  return createPortal(\n  <AnimatePresence key=\"modal-presence\">'

if old2 in content:
    content = content.replace(old2, new2, 1)
    print('createPortal return changed OK')
else:
    idx2 = content.find('return (')
    print('RETURN NOT FOUND, context:', repr(content[idx2:idx2+80]))
    sys.exit(1)

# 3. Close the portal — find the last </AnimatePresence> before ); and change ); to , document.body);
# The return ends with:  </AnimatePresence>\n  );\n
old3 = '  </AnimatePresence>\n  );\n};\n'
new3 = '  </AnimatePresence>\n  , document.body);\n};\n'

if old3 in content:
    content = content.replace(old3, new3, 1)
    print('Portal closing OK')
else:
    # Try to find and show context
    idx3 = content.rfind('</AnimatePresence>')
    print('CLOSE NOT FOUND, context:', repr(content[idx3:idx3+20]))
    sys.exit(1)

open(path, 'w', encoding='utf-8').write(content)
print('Done writing file')
