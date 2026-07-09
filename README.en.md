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

### 愛知県 / Aichi

#### [Tenku SPA Hills Ryusenji no Yu Nagoya Moriyama](https://www.ryusenjinoyu.com/moriyama/)

📍 1501 Ryusenji 1-chome, Moriyama Ward, Nagoya City, Aichi

- **Access:** Alight at Ryusenji bus stop via Yutorito Line from JR Ozone Station. By car, ~5–8 min from Obata IC or Matsukawado IC. Free parking for ~400 cars
- **Stay:** Can stay overnight
- **Gender:** Separate men's / women's
- **Go with:** Solo / Friends / Couple
- **View:** ★★★★☆ — Panoramic open-air bath 'Tenku Hotaru no Yu' offers night views over Nagoya (auto-inferred)
- **Work-friendly:** ★★★☆☆ — Free Wi-Fi and power outlets throughout; banseki area has recliners and a 10,000-manga library (auto-inferred)
- **Price:** Adults: weekdays ¥850, weekends/holidays ¥950 (morning bath ¥100 off). Banseki 'Forest Villa': +¥600 weekdays / +¥800 weekends. Overnight rest from +¥3,600 (tax incl.)
- **Food & drink:** Yes — On-site dining available
- **Sauna:** Bazooka Löyly Sauna (auto-löyly at :00 and :30 every hour), Medi Sauna (self-löyly), Ochre Sauna (approx. 85–90°C), women-only Salt Sauna
- **Hot spring:** Open-air panoramic bath 'Tenku Hotaru no Yu', high-concentration carbonated bath, source bath, and more
- **✨ What sets it apart:** Large complex featuring bi-hourly Bazooka Löyly, a ~9°C single cold bath, a panoramic open-air bath, and a banseki zone with 10,000 manga books
- **💬 Note:** Outstanding value with superb sauna and great views—you could easily spend a whole day here. (auto-inferred)

### 大阪府 / Osaka

#### [Solaniwa Onsen OSAKA BAY TOWER](https://www.solaniwa.com/)

📍 1-2-3 Benten, Minato Ward, Osaka City, Osaka

- **Access:** Directly connected to Bentencho Station (JR Osaka Loop Line / Osaka Metro Chuo Line), about 1 min from the ticket gates
- **Stay:** Can stay overnight
- **Gender:** Separate men's / women's
- **Go with:** Solo / Friends / Couple
- **View:** ★★★★★ — A stunning 1,000-tsubo rooftop Japanese garden with seasonal illuminations and a footbath (auto-inferred)
- **Work-friendly:** ★★★☆☆ — Free in-facility Wi-Fi, recliners, and a manga corner for long stays (auto-inferred)
- **Price:** Adults ¥2,310–¥3,630 (varies by day/time; banseki extra from ¥1,100; check official site)
- **Food & drink:** Yes — Multiple restaurants and cafes on 2F, including an Osaka street-food themed area
- **Sauna:** Dry sauna at 80–86°C with auto-löyly twice per hour; women's mist sauna and 7 types of banseki available
- **Hot spring:** Natural hot spring drawn from 1,000m underground (hypotonic, mildly alkaline); open-air flowing bath and 9+ types of baths
- **✨ What sets it apart:** Kansai's largest hot-spring theme park with a 1,000-tsubo rooftop garden, 10 private open-air baths, and a private tent-sauna suite
- **💬 Note:** A full-scale Japanese garden and natural hot spring right above the station—perfect for capping off a day in Osaka. (auto-inferred)


<!-- SPOTS:END -->

## 🛠 How it works

- The single source of truth is [`data/spots.json`](data/spots.json) (holds both Japanese and English).
- The live site ([`index.html`](index.html)) loads `data/spots.json` and renders cards, filters, and a map.
- The lists in the READMEs are generated from `data/spots.json` by [`scripts/build_readme.py`](scripts/build_readme.py), sorted by prefecture.
- The rules for adding/updating spots live in [`.github/copilot-instructions.md`](.github/copilot-instructions.md).

---

*This guide reflects personal experience and impressions. Prices and opening information can change — always check each facility's official website.*
