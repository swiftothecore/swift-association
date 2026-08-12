#!/usr/bin/env python3

import re
import sys
from collections import Counter
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
CONFIG = (ROOT / "js" / "config.js").read_text(encoding="utf-8")
APP = (ROOT / "js" / "app.js").read_text(encoding="utf-8")
FAILURES = []


def slice_between(source, start, end, label):
    first = source.find(start)
    last = source.find(end, first + len(start))
    if first < 0 or last < 0:
        FAILURES.append(f"Could not find {label}")
        return ""
    return source[first:last]


def captures(source, pattern):
    return re.findall(pattern, source, re.MULTILINE | re.DOTALL)


def duplicates(values):
    return sorted(value for value, count in Counter(values).items() if count > 1)


def literal_array(name):
    match = re.search(rf"const\s+{name}\s*=\s*\[(.*?)\];", APP, re.DOTALL)
    if not match:
        FAILURES.append(f"Could not find {name} in js/app.js")
        return []
    return captures(match.group(1), r'''["']([a-z0-9-]+)["']''')


achievement_block = slice_between(
    CONFIG,
    "export const ACHIEVEMENTS = [",
    "export const ACH_BY_ID =",
    "the ACHIEVEMENTS table in js/config.js",
)
achievement_ids = captures(achievement_block, r'''\bid\s*:\s*["']([a-z0-9-]+)["']''')
achievement_set = set(achievement_ids)
duplicate_ids = duplicates(achievement_ids)
if duplicate_ids:
    FAILURES.append(f"Duplicate achievement ids: {', '.join(duplicate_ids)}")

group_block = slice_between(
    CONFIG,
    "export const ACH_GROUP_OF = {",
    "/* ---------- Easter-egg art ---------- */",
    "the ACH_GROUP_OF table in js/config.js",
)
group_ids = captures(group_block, r'''["']([a-z0-9-]+)["']\s*:''')
for achievement_id in group_ids:
    if achievement_id not in achievement_set:
        FAILURES.append(f"ACH_GROUP_OF has unknown achievement id: {achievement_id}")

app_refs = []
for achievement_id in captures(APP, r'''\bunlock\(\s*["']([a-z0-9-]+)["']\s*\)'''):
    app_refs.append((achievement_id, "unlock()"))
for name in ("HIDDEN_ACH_IDS", "META_ACH"):
    for achievement_id in literal_array(name):
        app_refs.append((achievement_id, name))
for achievement_id in captures(APP, r'''ACH_BY_ID\[\s*["']([a-z0-9-]+)["']\s*\]'''):
    app_refs.append((achievement_id, "ACH_BY_ID[]"))
for achievement_id in captures(APP, r'''\ba\.id\s*(?:===|!==)\s*["']([a-z0-9-]+)["']'''):
    app_refs.append((achievement_id, "achievement id comparison"))

sweep_match = re.search(
    r"const\s+sweepCharm\s*=\s*\{(.*?)\}\[bonusGame\.id\]",
    APP,
    re.DOTALL,
)
if not sweep_match:
    FAILURES.append("Could not find the sweepCharm map in js/app.js")
else:
    for achievement_id in captures(sweep_match.group(1), r''':\s*["']([a-z0-9-]+)["']'''):
        app_refs.append((achievement_id, "sweepCharm"))

for achievement_id, source in app_refs:
    if achievement_id not in achievement_set:
        FAILURES.append(
            f"js/app.js {source} has unknown achievement id: {achievement_id}"
        )

migration_match = re.search(
    r"export const ACH_ID_MIGRATIONS\s*=\s*\{(.*?)\};",
    CONFIG,
    re.DOTALL,
)
migration_count = 0
if migration_match:
    migration_keys = captures(
        migration_match.group(1), r'''["']?([a-z0-9-]+)["']?\s*:'''
    )
    migration_values = captures(
        migration_match.group(1), r''':\s*["']([a-z0-9-]+)["']'''
    )
    migration_count = len(migration_keys)
    duplicate_keys = duplicates(migration_keys)
    duplicate_targets = duplicates(migration_values)
    if duplicate_keys:
        FAILURES.append(
            f"Duplicate ACH_ID_MIGRATIONS keys: {', '.join(duplicate_keys)}"
        )
    if duplicate_targets:
        FAILURES.append(
            f"Duplicate ACH_ID_MIGRATIONS values: {', '.join(duplicate_targets)}"
        )
    for achievement_id in migration_keys:
        if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", achievement_id):
            FAILURES.append(f"Unknown migration key format: {achievement_id}")
        if achievement_id in achievement_set:
            FAILURES.append(
                f"ACH_ID_MIGRATIONS key is still a current id: {achievement_id}"
            )
    for achievement_id in migration_values:
        if achievement_id not in achievement_set:
            FAILURES.append(
                f"ACH_ID_MIGRATIONS has unknown target id: {achievement_id}"
            )

if FAILURES:
    plural = "" if len(FAILURES) == 1 else "s"
    print(
        f"Achievement id audit failed with {len(FAILURES)} problem{plural}:",
        file=sys.stderr,
    )
    for failure in FAILURES:
        print(f"  - {failure}", file=sys.stderr)
    raise SystemExit(1)

print(
    f"Achievement id audit passed: {len(achievement_ids)} achievements, "
    f"{len(app_refs)} app references, {len(group_ids)} group keys, "
    f"{migration_count} migrations."
)
