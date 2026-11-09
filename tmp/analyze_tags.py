import glob
import re

files = sorted(glob.glob('src/components/screens/*.tsx') + glob.glob('src/components/common/*.tsx'))

for f in files:
    with open(f, 'r', encoding='utf-8') as fh:
        content = fh.read()
    
    matches = re.findall(r'<([a-zA-Z0-9_.-]+)[^>]*?className=[\'"{`][^\'"`}]*?border(?:-[0-9]+)?\s+(?:border-\[#000000\]|border-black)[^\'"`}]*?[\'"`}]', content, re.DOTALL)
    if matches:
        tags = set(matches)
        print(f'{f}: {len(matches)} elements with tags {tags}')
