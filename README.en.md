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

*No spots yet. Paste a facility URL into an Issue and assign Copilot to add one.*

<!-- SPOTS:END -->

## 🛠 How it works

- The single source of truth is [`data/spots.json`](data/spots.json) (holds both Japanese and English).
- The live site ([`index.html`](index.html)) loads `data/spots.json` and renders cards, filters, and a map.
- The lists in the READMEs are generated from `data/spots.json` by [`scripts/build_readme.py`](scripts/build_readme.py), sorted by prefecture.
- The rules for adding/updating spots live in [`.github/copilot-instructions.md`](.github/copilot-instructions.md).

---

*This guide reflects personal experience and impressions. Prices and opening information can change — always check each facility's official website.*
