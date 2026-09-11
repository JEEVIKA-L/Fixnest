import sys

path = r'd:/Fixnest/frontend/src/app/board/[id]/page.tsx'
content = open(path, 'r', encoding='utf-8').read()

# ========== 1. Insert "View as Table" button in the 3-dots menu ==========
# We look for the closing sequence after the Style Board button then before the divider
style_board_end = content.find('Style Board\n </button>')
if style_board_end == -1:
    print("ERROR: 'Style Board' button not found")
    sys.exit(1)

insert_pos = style_board_end + len('Style Board\n </button>')

view_toggle = '''
  <button
  onClick={() => {
  setViewMode(viewMode === 'kanban' ? 'table' : 'kanban');
  setShowMenu(false);
  }}
  className="w-full px-4 py-2 flex items-center gap-3 hover:bg-black/5 transition-colors text-sm font-bold text-left"
  >
  {viewMode === 'kanban' ? (
  <>
  <Table2 size={16} className="text-[#D94F9D]" />
  <span className="text-[#D94F9D]">View as Table</span>
  </>
  ) : (
  <>
  <LayoutGrid size={16} className="text-[#D94F9D]" />
  <span className="text-[#D94F9D]">View as Kanban</span>
  </>
  )}
  </button>'''

content = content[:insert_pos] + view_toggle + content[insert_pos:]
print('Menu toggle inserted OK')

# ========== 2. Replace canvas rendering area ==========
# Find old canvas block
old_canvas_search = '{/* Board Canvas Area */}'
canvas_idx = content.find(old_canvas_search)
if canvas_idx == -1:
    print("ERROR: Canvas area not found")
    sys.exit(1)

# Find the end of this div block
div_start = content.find('<div', canvas_idx)
# Find the matching </div> - we need to count nesting
i = div_start
depth = 0
while i < len(content):
    if content[i:i+4] == '<div':
        depth += 1
        i += 4
    elif content[i:i+6] == '</div>':
        depth -= 1
        i += 6
        if depth == 0:
            break
    else:
        i += 1

old_block = content[canvas_idx:i]
new_block = '''  {/* Board Canvas Area */}
  <div className="flex-1 overflow-hidden flex flex-col">
  {viewMode === 'kanban' ? (
  <BoardCanvas board={activeBoard} />
  ) : (
  <TableView board={activeBoard} lists={lists} allCards={allCards} />
  )}
  </div>'''

content = content.replace(old_block, new_block, 1)
print('Canvas replaced OK')

open(path, 'w', encoding='utf-8').write(content)
print('Done writing file')
