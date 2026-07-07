#!/usr/bin/env python3
"""Generate the bilingual README spot lists from data/spots.json.

Single source of truth: data/spots.json.
This script sorts spots by prefecture (JIS prefecture code order: Hokkaido -> Okinawa),
rewrites data/spots.json in that canonical order, and regenerates the auto-managed
sections of README.md (Japanese) and README.en.md (English), grouped by prefecture.

Usage:
    python scripts/build_readme.py

Only the Python standard library is used.
"""
from __future__ import annotations

import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
DATA = ROOT / "data" / "spots.json"
PREF = ROOT / "data" / "prefectures.json"
README_JA = ROOT / "README.md"
README_EN = ROOT / "README.en.md"

START = "<!-- SPOTS:START -->"
END = "<!-- SPOTS:END -->"

LABELS = {
    "ja": {
        "recommended_for": {"solo": "一人", "friends": "友人同士", "couple": "男女・カップル"},
        "gender": {
            "separate": "男女別",
            "men_only": "男性専用",
            "women_only": "女性専用",
            "mixed": "混浴",
        },
        "stay": {True: "泊まれる", False: "日帰り（宿泊不可）", None: "不明"},
        "yes": "あり",
        "no": "なし",
        "unknown": "不明",
        "inferred": "（自動推測）",
        "loc": "所在地",
        "access": "アクセス",
        "stay_label": "宿泊",
        "gender_label": "男女",
        "recommend_label": "おすすめの行き方",
        "view_label": "景色",
        "work_label": "作業向き",
        "price_label": "料金",
        "food_label": "飲食",
        "sauna_label": "サウナ",
        "onsen_label": "温泉",
        "unique_label": "差別化ポイント",
        "comment_label": "一言",
        "empty": "*まだ登録がありません。Issue に施設の URL を貼って Copilot をアサインすると追加されます。*",
    },
    "en": {
        "recommended_for": {"solo": "Solo", "friends": "Friends", "couple": "Couple"},
        "gender": {
            "separate": "Separate men's / women's",
            "men_only": "Men only",
            "women_only": "Women only",
            "mixed": "Mixed bathing",
        },
        "stay": {True: "Can stay overnight", False: "Day-use only", None: "Unknown"},
        "yes": "Yes",
        "no": "No",
        "unknown": "Unknown",
        "inferred": "(auto-inferred)",
        "loc": "Location",
        "access": "Access",
        "stay_label": "Stay",
        "gender_label": "Gender",
        "recommend_label": "Go with",
        "view_label": "View",
        "work_label": "Work-friendly",
        "price_label": "Price",
        "food_label": "Food & drink",
        "sauna_label": "Sauna",
        "onsen_label": "Hot spring",
        "unique_label": "What sets it apart",
        "comment_label": "Note",
        "empty": "*No spots yet. Paste a facility URL into an Issue and assign Copilot to add one.*",
    },
}


def load_json(path: pathlib.Path):
    with path.open(encoding="utf-8") as fh:
        return json.load(fh)


def loc(node, lang: str):
    """Return the localized string of a {ja, en} node, or None."""
    if not isinstance(node, dict):
        return None
    val = node.get(lang) or node.get("ja") or node.get("en")
    return val or None


def stars(rating):
    if not isinstance(rating, int) or rating < 1 or rating > 5:
        return None
    return "★" * rating + "☆" * (5 - rating)


def sort_key(spot: dict):
    return (
        spot.get("prefecture_code") or 99,
        loc(spot.get("city"), "ja") or "",
        loc(spot.get("name"), "ja") or "",
    )


def bullet(label: str, value: str) -> str:
    return f"- **{label}:** {value}\n"


def render_spot(spot: dict, lang: str) -> str:
    L = LABELS[lang]
    name = loc(spot.get("name"), lang) or spot.get("id", "?")
    url = spot.get("url")
    header = f"#### [{name}]({url})\n\n" if url else f"#### {name}\n\n"
    out = header

    # Location line
    parts = []
    pref = loc(spot.get("prefecture"), lang)
    city = loc(spot.get("city"), lang)
    address = loc(spot.get("address"), lang)
    place = address or " ".join(p for p in [pref, city] if p)
    if place:
        parts.append(f"📍 {place}")
    if parts:
        out += "  ".join(parts) + "\n\n"

    access = loc(spot.get("access"), lang)
    if access:
        out += bullet(L["access"], access)

    # Stay
    stay = spot.get("stay")
    out += bullet(L["stay_label"], L["stay"].get(stay, L["unknown"]))

    # Gender policy
    gp = spot.get("gender_policy")
    if gp:
        out += bullet(L["gender_label"], L["gender"].get(gp, gp))

    # Recommended for
    rec = spot.get("recommended_for") or []
    if rec:
        labels = [L["recommended_for"].get(r, r) for r in rec]
        out += bullet(L["recommend_label"], " / ".join(labels))

    # View
    view = spot.get("view") or {}
    view_txt = view_line(view, lang, L)
    if view_txt:
        out += bullet(L["view_label"], view_txt)

    # Work friendly
    work = spot.get("work_friendly") or {}
    work_txt = work_line(work, lang, L)
    if work_txt:
        out += bullet(L["work_label"], work_txt)

    # Price
    price = loc(spot.get("price"), lang)
    if price:
        out += bullet(L["price_label"], price)

    # Food
    food = spot.get("food") or {}
    food_txt = avail_line(food, lang, L)
    if food_txt:
        out += bullet(L["food_label"], food_txt)

    # Sauna
    sauna = loc(spot.get("sauna"), lang)
    if sauna:
        out += bullet(L["sauna_label"], sauna)

    # Onsen
    onsen = loc(spot.get("onsen"), lang)
    if onsen:
        out += bullet(L["onsen_label"], onsen)

    # Unique point
    unique = loc(spot.get("unique_point"), lang)
    if unique:
        out += bullet("✨ " + L["unique_label"], unique)

    # Personal comment
    comment_node = spot.get("personal_comment") or {}
    comment = loc(comment_node, lang)
    if comment:
        suffix = " " + L["inferred"] if comment_node.get("_inferred") else ""
        out += bullet("💬 " + L["comment_label"], comment + suffix)

    return out + "\n"


def view_line(view: dict, lang: str, L: dict):
    rating = stars(view.get("rating"))
    text = loc(view, lang)
    pieces = [p for p in [rating, text] if p]
    if not pieces:
        return None
    line = " — ".join(pieces)
    if view.get("_inferred"):
        line += " " + L["inferred"]
    return line


def work_line(work: dict, lang: str, L: dict):
    rating = stars(work.get("rating"))
    text = loc(work, lang)
    pieces = [p for p in [rating, text] if p]
    if not pieces:
        return None
    line = " — ".join(pieces)
    if work.get("_inferred"):
        line += " " + L["inferred"]
    return line


def avail_line(node: dict, lang: str, L: dict):
    avail = node.get("available")
    text = loc(node, lang)
    if avail is True:
        head = L["yes"]
    elif avail is False:
        head = L["no"]
    else:
        head = None
    pieces = [p for p in [head, text] if p]
    if not pieces:
        return None
    return " — ".join(pieces)


def build_section(spots: list, prefectures: list, lang: str) -> str:
    L = LABELS[lang]
    if not spots:
        return L["empty"] + "\n"
    pref_by_code = {p["code"]: p for p in prefectures}
    out = ""
    current = None
    for spot in spots:
        code = spot.get("prefecture_code")
        if code != current:
            current = code
            pref = pref_by_code.get(code, {})
            ja = pref.get("ja", loc(spot.get("prefecture"), "ja") or "")
            en = pref.get("en", loc(spot.get("prefecture"), "en") or "")
            out += f"### {ja} / {en}\n\n"
        out += render_spot(spot, lang)
    return out


def replace_section(path: pathlib.Path, section: str) -> None:
    text = path.read_text(encoding="utf-8")
    if START not in text or END not in text:
        raise SystemExit(f"Markers {START} / {END} not found in {path.name}")
    before = text.split(START)[0]
    after = text.split(END)[1]
    new = f"{before}{START}\n\n{section}\n{END}{after}"
    path.write_text(new, encoding="utf-8")


def main() -> int:
    spots = load_json(DATA)
    prefectures = load_json(PREF)

    spots.sort(key=sort_key)

    # Rewrite the canonical, prefecture-sorted data file.
    DATA.write_text(
        json.dumps(spots, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

    replace_section(README_JA, build_section(spots, prefectures, "ja"))
    replace_section(README_EN, build_section(spots, prefectures, "en"))

    print(f"Rebuilt READMEs from {len(spots)} spot(s), sorted by prefecture.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
