import re
import json
import os

JSON_DB_PATH = "public/data/manuals.json"
SOURCE_MD_PATH = "manuals/extracted/extracted_manual.md"

def parse_manual(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            lines = f.readlines()
    except FileNotFoundError:
        print(f"Error: {filepath} not found.")
        return None

    manual = {
        "id": "",
        "title": "",
        "grade": "D",
        "status": "Active",
        "department": "미정",
        "overview": "",
        "entryMethod": "",
        "entryMethodSecurityLevel": "D",
        "explorationGuide": [],
        "specialNotes": "",
        "specialNotesSecurityLevel": "D",
        "isRestricted": False
    }

    if len(lines) > 0:
        header_match = re.search(r'# \[(.*?)\] (.*) 매뉴얼', lines[0])
        if header_match:
            manual["id"] = header_match.group(1)
            manual["title"] = header_match.group(2)
            if grade_match:
                manual["grade"] = grade_match.group(1)

            # [CUSTOM] Department Mappings
            if manual["id"] == "Qterw-B-11":
                manual["department"] = "현장탐사팀 A조"


    current_section = None
    buffer = []
    exploration_lines = []
    entry_lines = []
    note_lines = []
    
    # Check if this is a callout-only manual (Qterw-B-666)
    is_callout_only = manual["id"] == "Qterw-B-666"
    callouts = []
    
    if is_callout_only:
        # Parse callout-only mode: extract all <aside> blocks
        in_aside = False
        current_callout = []
        
        for line in lines[1:]:
            line = line.rstrip()
            
            if "<aside>" in line:
                in_aside = True
                current_callout = []
                continue
            elif "</aside>" in line:
                in_aside = False
                if current_callout:
                    # Join lines and clean up
                    callout_text = "\n".join(current_callout).strip()
                    # Remove --- separators
                    callout_text = re.sub(r'^---\s*$', '', callout_text, flags=re.MULTILINE)
                    callout_text = re.sub(r'\n{3,}', '\n\n', callout_text).strip()
                    callouts.append(callout_text)
                continue
            
            if in_aside and line.strip():
                current_callout.append(line)
        
        manual["calloutOnlyMode"] = True
        manual["callouts"] = callouts
        manual["overview"] = "본 문서는 특수 형식으로 작성되었습니다."
        return manual

    for line in lines[1:]:
        line = line.rstrip()
        
        if "[](" in line and "data:image" in line:
            line = line.replace("[](", "![image](")
            
        h2_match = re.match(r'^## \[(.*)\]', line)
        
        if h2_match:
            content = "\n".join(buffer).strip()
            if current_section == "overview":
                manual["overview"] = content
            elif current_section == "entry":
                # For basic string support (backward compat or mixed use)
                manual["entryMethod"] = content
            elif current_section == "notes":
                manual["specialNotes"] = content
            elif current_section == "guide":
                pass
            
            section_title = h2_match.group(1)
            buffer = []
            
            if "1. 개요" in section_title:
                current_section = "overview"
            elif "2. 진입 방법" in section_title:
                current_section = "entry"
            elif "3. 탐사 가이드" in section_title:
                current_section = "guide"
            elif "4. 특이사항" in section_title:
                current_section = "notes"
            # Add support for Qterw-D-16 sections
            elif "2. 정차역 유형별 분석" in section_title:
                current_section = "entry"
            elif "3. 이레귤러 상황 및 안내방송 대응" in section_title:
                current_section = "guide"
            
            # Add support for Qterw-B-11 sections (English subtitles)
            elif "2. 진입 방법 (Entry Protocol)" in section_title:
                current_section = "entry"
            elif "3. 탐사 가이드 (Exploration Guide)" in section_title:
                current_section = "guide"
            elif "4. 특이사항 (Special Notes)" in section_title:
                current_section = "notes"

        else:
            if current_section == "guide":
                exploration_lines.append(line)
            elif current_section == "entry":
                # Collect both specific lines for parsing AND buffer for fallback string
                entry_lines.append(line)
                buffer.append(line)
            elif current_section == "notes":
                note_lines.append(line)
                buffer.append(line)
            else:
                buffer.append(line)
    
    content = "\n".join(buffer).strip()
    if current_section == "notes":
        manual["specialNotes"] = content
    elif current_section == "overview": 
         manual["overview"] = content
    elif current_section == "entry":
         manual["entryMethod"] = content

    manual["explorationGuide"] = parse_exploration_guide(exploration_lines)
    
    # Process entry nodes if any lines were collected
    if entry_lines:
        entry_nodes = parse_exploration_guide(entry_lines)
        if entry_nodes:
            manual["entryNodes"] = entry_nodes

    # Process note nodes
    if note_lines:
        note_nodes = parse_exploration_guide(note_lines)
        if note_nodes:
            manual["specialNoteNodes"] = note_nodes

    return manual

def parse_exploration_guide(lines):
    root = []
    # Initialize stack with a root container
    stack = [{"children": root, "indent": -1}] 
    
    i = 0
    while i < len(lines):
        line = lines[i]
        stripped_line = line.strip()
        
        # Check for start of <aside> block
        if "<aside>" in line:
            # Collect aside block lines
            aside_lines = []
            current_indent = len(line) - len(line.lstrip())
            
            i += 1
            while i < len(lines):
                inner_line = lines[i]
                if "</aside>" in inner_line:
                    break
                # De-indenting inner lines slightly might be needed if they are indented relative to <aside>
                # But usually just keeping them or stripping based on first line is fine.
                if inner_line.strip(): # Skip empty lines inside
                     aside_lines.append(inner_line)
                i += 1
            
            # Parse the inner content
            if aside_lines:
                callout_nodes = parse_exploration_guide(aside_lines)
                # Mark these nodes as callouts
                for node in callout_nodes:
                    node["isCallout"] = True
                
                # Attach to current parent in stack
                # Note: aside block itself tracks indent from the <aside> tag line
                parent = stack[-1] 
                # If stack logic is strict about indent, we might need to pop.
                # But here we just append to the current active parent (which should be the node containing the aside)
                # Actually, `stack` management depends on indent.
                # Let's check stack against current_indent first to find correct parent
                while len(stack) > 1 and stack[-1]["indent"] >= current_indent:
                    stack.pop()
                
                stack[-1]["children"].extend(callout_nodes)
            
            i += 1
            continue

        if not stripped_line:
            i += 1
            continue
        
        indent = len(line) - len(line.lstrip())
        content = stripped_line
        
        # Determine if this line starts a new node
        is_list = content.startswith('- ')
        should_be_node = False
        
        # Checking node criteria
        if is_list:
            clean_text = content[2:]
            if "[열람 제한]" in clean_text:
                should_be_node = True
            elif re.match(r'^\d+(?:-\d+)+[-\.]', clean_text): 
                should_be_node = True
            elif clean_text.strip().endswith(':'):
                should_be_node = True
            elif indent == 0:
                should_be_node = True
        
        # Also handle lines that look like headers but no dash? 
        # Inside <aside>, headers might just be "**Title**" without dash.
        if not is_list:
             # Case 1: Bold titles (e.g. inside callouts)
             if content.startswith('**') and content.endswith('**'):
                 should_be_node = True
                 clean_text = content
                 is_list = True
             # Case 2: Numbered headers (e.g. "3-4-2. Title")
             elif re.match(r'^\d+(?:-\d+)+[-\.]', content):
                 should_be_node = True
                 clean_text = content
                 is_list = True 

        # Stack Management Logic
        # 1. Pop if we are strictly less indented (returning to parent level)
        while len(stack) > 1 and stack[-1]["indent"] > indent:
             stack.pop()
        
        # 2. If indentation is equal, Pop ONLY if we are starting a new node (sibling)
        #    If we are just content (not a node), we stay in the current node.
        if len(stack) > 1 and stack[-1]["indent"] == indent and should_be_node:
             stack.pop()

        current_node_on_stack = stack[-1].get("node")

        if is_list and should_be_node:
            text = clean_text 
            node = {
                "title": text,
                "content": "",
                "children": []
            }
            
            if "[열람 제한]" in node["title"]:
                node["securityLevel"] = "C"

            parent = stack[-1]
            parent["children"].append(node)
            stack.append({"children": node["children"], "indent": indent, "node": node})
            
        else:
            if current_node_on_stack:
                 if content.startswith(": "):
                     content = content[2:]
                 
                 # Append content
                 text_to_append = content
                 # We don't need complex padding calculation for content at same level?
                 # If we are deeper, maybe. But here we assume content flows.
                 # Let's keep simple.
                 
                 if current_node_on_stack["content"]:
                     current_node_on_stack["content"] += "\n" + text_to_append
                 else:
                     current_node_on_stack["content"] = text_to_append
                 
                 if "[열람 제한]" in text_to_append:
                     current_node_on_stack["securityLevel"] = "C"
        i += 1
    
    return root

def merge_and_save(new_manual):
    if not new_manual: return

    existing_data = []
    if os.path.exists(JSON_DB_PATH):
        try:
            with open(JSON_DB_PATH, 'r', encoding='utf-8') as f:
                existing_data = json.load(f)
        except json.JSONDecodeError:
            existing_data = []
    
    # Check if exists
    found_idx = -1
    for idx, item in enumerate(existing_data):
        if item["id"] == new_manual["id"]:
            found_idx = idx
            break
    
    if found_idx >= 0:
        print(f"Updating existing manual: {new_manual['id']}")
        existing_data[found_idx] = new_manual
    else:
        print(f"Appending new manual: {new_manual['id']}")
        existing_data.append(new_manual)
        
    with open(JSON_DB_PATH, 'w', encoding='utf-8') as f:
        json.dump(existing_data, f, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        source_path = sys.argv[1]
    else:
        source_path = SOURCE_MD_PATH

    print(f"Processing file: {source_path}")
    extracted_data = parse_manual(source_path)
    if extracted_data:
        merge_and_save(extracted_data)
        print("Done.")
