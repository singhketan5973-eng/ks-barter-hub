#!/usr/bin/env python3
"""Check the Barter Hub documentation.

Checks:
  1. Every file under docs/ has front matter with a title, a type, and a
     last_verified value (a YYYY-MM-DD date or the word "unverified").
  2. Every Markdown file has exactly one level-1 heading.
  3. Relative links point to files that exist.
  4. Discouraged terms from tools/terminology.json are not used in prose.

Documents whose last_verified value is "unverified" produce a warning.

Usage:
  python tools/docs_check.py            Errors fail the check, warnings do not.
  python tools/docs_check.py --strict   Warnings fail the check too.
"""

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VALID_TYPES = {"task", "concept", "reference", "decision", "index"}
DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
LINK_RE = re.compile(r"(?<!!)\[[^\]]*\]\(([^)\s]+)(?:\s+\"[^\"]*\")?\)")
FENCE_RE = re.compile(r"^\s*(```|~~~)")
INLINE_CODE_RE = re.compile(r"`[^`]*`")
LINK_TARGET_RE = re.compile(r"(\[[^\]]*\])\([^)]*\)")
AUTOLINK_RE = re.compile(r"<(?:https?://|mailto:)[^>]*>")
EXTERNAL_PREFIXES = ("http://", "https://", "mailto:", "#")


def markdown_files():
    names = ["README.md", "CONTRIBUTING.md", "CHANGELOG.md", "server/README.md", "client/README.md"]
    files = [ROOT / name for name in names if (ROOT / name).exists()]
    files += sorted((ROOT / "docs").rglob("*.md"))
    return files


def read_document(path):
    """Return (front_matter, body_lines, first_body_line_number)."""
    text = path.read_text(encoding="utf-8").replace("\r\n", "\n")
    lines = text.split("\n")
    if lines and lines[0].strip() == "---":
        for index in range(1, len(lines)):
            if lines[index].strip() == "---":
                front = {}
                for line in lines[1:index]:
                    if ":" in line:
                        key, value = line.split(":", 1)
                        front[key.strip()] = value.strip().strip('"')
                return front, lines[index + 1 :], index + 2
    return None, lines, 1


def prose_lines(body, first_number):
    """Yield (line_number, text) for lines outside code blocks, without inline code."""
    in_fence = False
    for offset, line in enumerate(body):
        if FENCE_RE.match(line):
            in_fence = not in_fence
            continue
        if not in_fence:
            yield first_number + offset, INLINE_CODE_RE.sub("", line)


def load_terminology():
    path = ROOT / "tools" / "terminology.json"
    if not path.exists():
        return []
    data = json.loads(path.read_text(encoding="utf-8"))
    pairs = []
    for preferred, discouraged in data.items():
        for term in discouraged:
            pattern = re.compile(r"(?<![\w])" + re.escape(term) + r"(?![\w])")
            pairs.append((pattern, term, preferred))
    return pairs


def check_file(path, terminology, errors, warnings):
    relative = path.relative_to(ROOT).as_posix()
    front, body, first_number = read_document(path)
    in_docs = relative.startswith("docs/")

    if in_docs:
        if front is None:
            errors.append(f"{relative}:1: missing front matter (title, type, last_verified)")
        else:
            for key in ("title", "type", "last_verified"):
                if not front.get(key):
                    errors.append(f"{relative}:1: front matter is missing '{key}'")
            if front.get("type") and front["type"] not in VALID_TYPES:
                errors.append(f"{relative}:1: type '{front['type']}' is not one of {sorted(VALID_TYPES)}")
            verified = front.get("last_verified", "")
            if verified == "unverified":
                warnings.append(f"{relative}: not yet verified against the product")
            elif verified and not DATE_RE.match(verified):
                errors.append(f"{relative}:1: last_verified must be YYYY-MM-DD or 'unverified'")

    headings = [(number, text) for number, text in prose_lines(body, first_number) if text.startswith("# ")]
    if len(headings) != 1:
        errors.append(f"{relative}: expected exactly one level-1 heading, found {len(headings)}")
    elif front and front.get("title") and headings[0][1][2:].strip() != front["title"]:
        errors.append(f"{relative}:{headings[0][0]}: heading does not match the front matter title")

    for number, text in prose_lines(body, first_number):
        for target in LINK_RE.findall(text):
            if target.startswith(EXTERNAL_PREFIXES):
                continue
            clean = target.split("#", 1)[0].split("?", 1)[0]
            if not clean:
                continue
            base = ROOT if clean.startswith("/") else path.parent
            if not (base / clean.lstrip("/")).resolve().exists():
                errors.append(f"{relative}:{number}: broken link to '{target}'")
        words = AUTOLINK_RE.sub("", LINK_TARGET_RE.sub(r"\1", text))
        for pattern, term, preferred in terminology:
            if pattern.search(words):
                errors.append(f"{relative}:{number}: use '{preferred}' instead of '{term}'")


def main():
    parser = argparse.ArgumentParser(description="Check the Barter Hub documentation.")
    parser.add_argument("--strict", action="store_true", help="treat warnings as errors")
    args = parser.parse_args()

    terminology = load_terminology()
    errors, warnings = [], []
    files = markdown_files()
    for path in files:
        check_file(path, terminology, errors, warnings)

    for message in errors:
        print(f"ERROR   {message}")
    for message in warnings:
        print(f"WARNING {message}")
    print(f"Checked {len(files)} files: {len(errors)} errors, {len(warnings)} warnings.")

    failed = bool(errors) or (args.strict and bool(warnings))
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
