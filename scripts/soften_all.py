import glob
import re
import os

CTA_KEYWORDS = [
    # Action verbs and key phrases
    r'get started',
    r'explore courts',
    r'enter arena',
    r'book court',
    r'book this court',
    r'จองคอร์ท',
    r'จองสนาม',
    r'start training',
    r'เริ่มการฝึกซ้อม',
    r'find my match',
    r'ค้นหาการฝึกที่ใช่',
    r'add match',
    r'เพิ่มผลแข่ง',
    r'joined',
    r'join guild',
    r'join',
    r'เข้าร่วม',
    r'claim & continue',
    r'claim',
    r'confirm pro',
    r'select court',
    r'pay now',
    r'confirm & pay',
    r'ชำระเงิน',
    r'ยืนยันการชำระเงิน',
    r'ยืนยันและรับบัตรเข้าสนาม',
    r'proceed to checkout',
    r'ดำเนินการจอง',
    r'finish match',
    r'start match',
    r'start live',
    r'start ai',
    r'record stats',
    r'บันทึกผล',
    r'บันทึก dna',
    r'บันทึกข้อมูล',
    r'save recap',
    r'ตรวจ 3d ช็อต',
    r'analyze 3d',
    r'download recap',
    r'บันทึกการ์ด',
    r'duel in e3',
    r'start quest',
    r'เริ่มภารกิจ',
    r'suggest a new court',
    r'host squad session',
    r'find sparring duel',
    r'rsvp now',
    r'ยืนยันเข้าร่วม',
    r'challenge player',
    r'ท้าดวล',
    r'sync device',
    r'เชื่อมต่ออุปกรณ์',
    r'top up',
    r'เติมเงิน',
    r'withdraw',
    r'ถอนเงิน',
    r'generate draw',
    r'สร้างตารางแข่ง',
    r'navigate',
    r'นำทางไปสนาม',
    r'live scorer',
    r'let\'s find workout',
    r'ค้นหาการฝึกซ้อมตามพลังงาน',
    r'slush-cta-primary',
    r'slush-cta-outline',
    r'claim reward',
    r'รับรางวัล',
    r'start duel',
    r'เริ่มดวล'
]

cta_regex = re.compile('|'.join(CTA_KEYWORDS), re.IGNORECASE)

def is_cta_button(button_html, inner_text):
    combined = (button_html + " " + inner_text).lower()
    return bool(cta_regex.search(combined))

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    orig_content = content

    # Regex to find all JSX elements: <tag ...>
    # Note: we need to handle multi-line tags
    tag_pattern = re.compile(r'(<([a-zA-Z0-9_.-]+)(\s+[^>]*?)?>)', re.DOTALL)

    replacements = 0
    cta_kept = 0

    def replace_tag(match):
        nonlocal replacements, cta_kept
        full_tag = match.group(1)
        tag_name = match.group(2)
        attrs = match.group(3) or ''

        # Check if tag has harsh border classes
        has_black_border = bool(re.search(r'border(?:-[0-9]+)?\s+(?:border-\[#000000\]|border-black)|border-[btlr](?:-[0-9]+)?\s+(?:border-\[#000000\]|border-black)|divide-\[#000000\]', attrs))
        if not has_black_border:
            return full_tag

        # Check if it is a button or link
        is_btn = tag_name in ['button', 'a']
        if is_btn:
            # Check context following the tag
            start_pos = match.end()
            lookahead = content[start_pos:start_pos + 300]
            # Strip tags from lookahead to get text
            text_context = re.sub(r'<[^>]+>', ' ', lookahead)
            if is_cta_button(full_tag, text_context):
                cta_kept += 1
                # Ensure it keeps solid black border
                # If it already has border-2 or border border-[#000000], leave it
                return full_tag

        # For non-CTA elements (or non-CTA buttons):
        new_attrs = attrs

        # Replace 2px black borders
        new_attrs = re.sub(r'\bborder-2\s+border-\[#000000\]\b', 'border border-black/[0.08]', new_attrs)
        new_attrs = re.sub(r'\bborder-2\s+border-black\b', 'border border-black/[0.08]', new_attrs)
        
        # Replace 1px black borders
        new_attrs = re.sub(r'\bborder\s+border-\[#000000\]\b', 'border border-black/[0.08]', new_attrs)
        new_attrs = re.sub(r'\bborder\s+border-black\b', 'border border-black/[0.08]', new_attrs)

        # Replace directional black borders
        new_attrs = re.sub(r'\bborder-b(?:-2)?\s+border-\[#000000\]\b', 'border-b border-black/[0.08]', new_attrs)
        new_attrs = re.sub(r'\bborder-b(?:-2)?\s+border-black\b', 'border-b border-black/[0.08]', new_attrs)
        new_attrs = re.sub(r'\bborder-t(?:-2)?\s+border-\[#000000\]\b', 'border-t border-black/[0.08]', new_attrs)
        new_attrs = re.sub(r'\bborder-t(?:-2)?\s+border-black\b', 'border-t border-black/[0.08]', new_attrs)
        new_attrs = re.sub(r'\bborder-l(?:-2)?\s+border-\[#000000\]\b', 'border-l border-black/[0.08]', new_attrs)
        new_attrs = re.sub(r'\bborder-l(?:-2)?\s+border-black\b', 'border-l border-black/[0.08]', new_attrs)
        new_attrs = re.sub(r'\bborder-r(?:-2)?\s+border-\[#000000\]\b', 'border-r border-black/[0.08]', new_attrs)
        new_attrs = re.sub(r'\bborder-r(?:-2)?\s+border-black\b', 'border-r border-black/[0.08]', new_attrs)

        # Replace divide-[#000000]
        new_attrs = re.sub(r'\bdivide-\[#000000\]\b', 'divide-black/[0.08]', new_attrs)

        if new_attrs != attrs:
            replacements += 1
            return f"<{tag_name}{new_attrs}>"
        return full_tag

    new_content = tag_pattern.sub(replace_tag, content)

    if new_content != orig_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}: {replacements} borders softened, {cta_kept} CTA borders kept.")
    else:
        print(f"No changes needed for {filepath} (CTA borders kept: {cta_kept})")

def main():
    target_files = sorted(glob.glob('src/components/screens/*.tsx') + glob.glob('src/components/common/*.tsx'))
    # Skip DeviceFrame since it defines the phone frame wrapper
    for tf in target_files:
        if 'DeviceFrame.tsx' in tf:
            continue
        process_file(tf)

if __name__ == '__main__':
    main()
