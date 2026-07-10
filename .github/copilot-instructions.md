# Copilot instructions — 温泉サウナ手帖 / Onsen &amp; Sauna Guide

This repository is a bilingual (Japanese/English) guide to hot springs (onsen) and saunas.
The **single source of truth** is [`data/spots.json`](../data/spots.json). The README lists and the
GitHub Pages site ([`index.html`](../index.html)) are both generated from that file.

## Your main task: adding a spot from an Issue

When you are assigned an issue labeled **`add-spot`** (title starts with `[Add]`):

1. **Read the official URL(s)** from the issue body. The issue may list **multiple URLs, one per
   line** — process **every** URL (add/refresh one spot per URL, all in the same pull request).
2. **Fetch and read the page** (use your web/browsing tools; fall back to `curl -L <url>`).
   Follow obvious sub-pages when helpful (access, pricing, facility/sauna info).
3. **Add one new object per URL** to the array in `data/spots.json`, following the schema below.
   - Fill **objective** fields from the page. If something is not stated, use `null` — **never invent
     concrete facts** (address, price, hours, gender policy, etc.).
   - **Best-effort infer** the **subjective** fields (`view`, `work_friendly`, `recommended_for`,
     `unique_point`, `personal_comment`) from the page's description/marketing, and set
     `"_inferred": true` on those nodes. Keep `personal_comment` to one short, warm sentence.
   - Always provide **both `ja` and `en`** for every localized field. Japanese is primary; the
     English can be a concise translation.
   - Set `prefecture_code` and the English prefecture name using
     [`data/prefectures.json`](../data/prefectures.json) (JIS code order, Hokkaido=1 … Okinawa=47).
   - Set `geo` `{lat, lng}` only if you can find reliable coordinates (e.g. an embedded Google Map,
     a maps link, or clearly stated coordinates). Otherwise use `null`.
   - `id`: a unique lowercase slug, e.g. `sauna-shikiji-shizuoka`.
   - `added_at`: today's date (`YYYY-MM-DD`). `source_issue`: the issue number.
4. **De-duplicate** (per URL): if an entry with the same `url` already exists, **update that entry**
   instead of adding a duplicate.
5. **Regenerate** by running:
   ```bash
   python scripts/build_readme.py
   ```
   This sorts `data/spots.json` by prefecture, and rewrites the `<!-- SPOTS:START -->`…`<!-- SPOTS:END -->`
   sections of `README.md` and `README.en.md`. **Do not hand-edit those sections or hand-sort the JSON** —
   the script owns ordering (always by prefecture, never by insertion order).
6. **Commit** the changed `data/spots.json`, `README.md`, and `README.en.md` (with **all** spots from
   the issue), and open a single pull request.

## `data/spots.json` schema (one object per spot)

```jsonc
{
  "id": "facility-city",                 // unique slug
  "url": "https://...",                  // official site
  "name":       { "ja": "…", "en": "…" },
  "prefecture_code": 13,                  // JIS code 1–47 (sort key)
  "prefecture": { "ja": "東京都", "en": "Tokyo" },
  "city":       { "ja": "…", "en": "…" },
  "address":    { "ja": "…", "en": "…" },
  "geo":        { "lat": 35.70, "lng": 139.75 },   // or null
  "access":     { "ja": "…", "en": "…" },
  "stay": true,                           // 泊まれるか: true / false / null
  "gender_policy": "separate",            // separate | men_only | women_only | mixed | null
  "view":          { "rating": 4, "ja": "…", "en": "…", "_inferred": true },   // 景色 (rating 1–5 or null)
  "work_friendly": { "rating": 3, "wifi": true, "power": null, "ja": "…", "en": "…", "_inferred": true }, // PC作業
  "recommended_for": ["solo", "friends", "couple"],   // 一人/友人/男女。subset, best-effort
  "price": { "ja": "…", "en": "…" },
  "food":  { "available": true, "ja": "…", "en": "…" },   // 飲食
  "sauna": { "temp": null, "cold_bath": "…", "loyly": true, "ja": "…", "en": "…" },
  "onsen": { "spring_type": "…", "flowing": null, "ja": "…", "en": "…" },
  "unique_point":     { "ja": "…", "en": "…" },                  // 差別化ポイント
  "personal_comment": { "ja": "…", "en": "…", "_inferred": true }, // 一言（短く）
  "photo": null,
  "added_at": "YYYY-MM-DD",
  "source_issue": 12
}
```

### Field notes (maps to what the owner cares about)
- **どこにあるか** → `prefecture` / `city` / `address` / `access` / `geo`
- **泊まれるか** → `stay`
- **男性だけ / 女性だけ / 男女で** → `gender_policy`
- **一人 / 友人 / 男女で行くべきか** → `recommended_for`
- **景色は良いか** → `view` (`rating` + text)
- **PC作業できそうか** → `work_friendly` (`rating`, `wifi`, `power`)
- **値段** → `price`
- **飲食はあるか** → `food`
- **サウナ / 温泉の詳細** → `sauna` / `onsen`
- **差別化ポイント** → `unique_point`

## Hard rules
- Keep `data/spots.json` **valid JSON**, UTF-8, no comments/trailing commas.
- **Never fabricate** concrete facts; unknown objective values must be `null`.
- Mark inferred subjective content with `"_inferred": true`.
- Every localized field must have **both `ja` and `en`**.
- Always run `python scripts/build_readme.py` before opening the PR.
- Only the Python standard library is available/needed — do not add dependencies for the build script.

## Conventions
- Japanese text: concise and friendly. English: short and clear.
- Prefecture ordering is **always** Hokkaido → Okinawa; the site and READMEs must never be ordered by
  insertion order.
