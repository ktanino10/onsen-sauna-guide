<!-- [日本語](README.md) | English -->

# ♨️🧖 Onsen &amp; Sauna Guide / 温泉サウナ手帖

A personal guide to **hot springs (onsen) and saunas** that were genuinely worth the visit.
Each entry covers location, whether you can stay overnight, the men's/women's policy, the view, how work-friendly it is, who to go with, price, food, and what sets it apart — in both Japanese and English.

🌐 **Live site (GitHub Pages)**: https://ktanino10.github.io/onsen-sauna-guide/
🇯🇵 **日本語**: [README.md](README.md)

## 🧭 How to add a spot (just paste a URL)

1. Go to **Issues → New issue → "♨️ 温泉サウナを追加 / Add a spot"**.
2. **Paste the facility's official website URL** and create the issue (that's the only input needed).
3. **Assign the issue to Copilot**.
4. Copilot reads the page, appends the details to `data/spots.json`, and **automatically updates** this README and the live site in a pull request.
5. Merge the PR and it appears in the list.

> The list is ordered **by prefecture (Hokkaido → Okinawa)**, not by the order spots were added.

## 📋 What each entry captures

- 📍 Where it is (location, access, map)
- 🛏 Whether you can stay overnight
- 🚻 Men's / women's policy (separate / men only / women only / mixed)
- 🌄 Whether the view is good
- 💻 Whether it is suitable for PC work
- 🧑‍🤝‍🧑 Whether to go solo / with friends / as a couple
- 💴 Price
- 🍽 Whether food &amp; drink are available
- 🔥♨️ Sauna &amp; hot-spring details
- ✨ What sets it apart from others

## 🗾 Spots (ordered by prefecture)

<!-- SPOTS:START -->

### 東京都 / Tokyo

#### [PARADISE Otemachi](https://paradise-otemachi.com/)

📍 Taisei Otemachi Building 25F/26F, 2-1-1 Otemachi, Chiyoda City, Tokyo

- **Access:** About 3 min via Otemachi Station Exit B2a, or about 5 min on foot from JR Tokyo Station Marunouchi North Exit
- **Stay:** Day-use only
- **Gender:** Men only
- **Go with:** Solo / Friends
- **View:** ★★★★★ — High-floor 25F-26F setting with sweeping city views (auto-inferred)
- **Work-friendly:** ★★★★★ — Coworking seats offer Wi-Fi and power, plus online booths and free coffee (auto-inferred)
- **Price:** Morning bath ¥1,408, 1 hour ¥2,178, 3 hours ¥3,278, then ¥1,100 per additional hour (tax incl.)
- **Food & drink:** Yes — Free Sarutahiko coffee and water are available in the 25F coworking area
- **Sauna:** Multiple saunas with self/auto loyly plus a large cold-plunge pool on 26F
- **✨ What sets it apart:** A high-rise complex above Otemachi Station combining sauna, spa, gym, and coworking
- **💬 Note:** A polished city spot where you can go from work straight into sauna mode. (auto-inferred)

#### [Spa LaQua](https://www.laqua.jp/spa/)

📍 Tokyo Dome City, 1-1-1 Kasuga, Bunkyo City, Tokyo

- **Access:** Short walk from Korakuen / Suidobashi Station
- **Stay:** Day-use only
- **Gender:** Separate men's / women's
- **Go with:** Solo / Friends / Couple
- **View:** ★★☆☆☆ — Urban indoor spa; limited view (auto-inferred)
- **Work-friendly:** ★★★☆☆ — Has relaxation lounges; comfortable for longer stays (auto-inferred)
- **Price:** Adults from approx. 3,000 JPY (varies; check official site)
- **Food & drink:** Yes — Restaurants and cafes on site
- **Sauna:** Various saunas incl. loyly
- **Hot spring:** Natural hot spring drawn from approx. 1,700m underground
- **✨ What sets it apart:** Large natural hot-spring spa in central Tokyo Dome City with excellent access
- **💬 Note:** A handy spot to relax and recharge in central Tokyo. (auto-inferred)

### 静岡県 / Shizuoka

#### [Sauna Shikiji](https://saunashikiji.jp/)

📍 2-25-1 Shikiji, Suruga Ward, Shizuoka City, Shizuoka

- **Access:** Bus or taxi from JR Shizuoka Station
- **Stay:** Day-use only
- **Gender:** Separate men's / women's
- **Go with:** Solo / Friends
- **Work-friendly:** ★☆☆☆☆ — A dedicated sauna facility; not suited for PC work (auto-inferred)
- **Price:** Prices differ by gender area (check official site)
- **Food & drink:** Yes — Dining area available on site
- **Sauna:** Famous nationwide for its natural spring-water cold bath
- **✨ What sets it apart:** Revered as a 'sauna mecca' for its flowing natural spring-water cold bath
- **💬 Note:** Worth visiting at least once for the quality of the cold bath water. (auto-inferred)


<!-- SPOTS:END -->

## 🛠 How it works

- The single source of truth is [`data/spots.json`](data/spots.json) (holds both Japanese and English).
- The live site ([`index.html`](index.html)) loads `data/spots.json` and renders cards, filters, and a map.
- The lists in the READMEs are generated from `data/spots.json` by [`scripts/build_readme.py`](scripts/build_readme.py), sorted by prefecture.
- The rules for adding/updating spots live in [`.github/copilot-instructions.md`](.github/copilot-instructions.md).

---

*This guide reflects personal experience and impressions. Prices and opening information can change — always check each facility's official website.*
