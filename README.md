<!-- 日本語 | [English](README.en.md) -->

# ♨️🧖 温泉サウナ手帖 / Onsen &amp; Sauna Guide

実際に入って「良かった！」と思えた**温泉・サウナ**を紹介するための個人ガイドです。
所在地・宿泊可否・男女区分・景色・作業のしやすさ・おすすめの行き方・料金・飲食・差別化ポイントなどを、日本語と英語でまとめています。

🌐 **公開サイト（GitHub Pages）**: https://ktanino10.github.io/onsen-sauna-guide/
🇬🇧 **English**: [README.en.md](README.en.md)

## 🧭 使い方（施設の追加は URL を貼るだけ）

1. リポジトリの **Issues → New issue →「♨️ 温泉サウナを追加 / Add a spot」** を選ぶ。
2. 施設の**公式サイトの URL を貼り付けて** Issue を作成する（入力はこれだけ）。
3. その Issue を **Copilot にアサイン**する。
4. Copilot がページを読み取り、`data/spots.json` に情報を追記し、この README と公開サイトを**自動で更新**して Pull Request を作成します。
5. PR をマージすれば、一覧に反映されます。

> 一覧は**追加した順ではなく、都道府県順（北海道 → 沖縄）**で表示されます。

## 📋 まとめている項目

- 📍 どこにあるか（所在地・アクセス・地図）
- 🛏 泊まれるか（宿泊可否）
- 🚻 男女区分（男女別／男性専用／女性専用／混浴）
- 🌄 景色は良いか
- 💻 PC 作業などができそうか
- 🧑‍🤝‍🧑 一人／友人同士／男女で行くべきか（おすすめの行き方）
- 💴 料金
- 🍽 飲食はあるか
- 🔥♨️ サウナ・温泉の詳細
- ✨ ここが他と違う差別化ポイント

## 🗾 温泉サウナ一覧（都道府県順）

<!-- SPOTS:START -->

*まだ登録がありません。Issue に施設の URL を貼って Copilot をアサインすると追加されます。*

<!-- SPOTS:END -->

## 🛠 仕組み

- 施設データの唯一の情報源は [`data/spots.json`](data/spots.json)（日本語・英語の両方を保持）。
- 公開サイト（[`index.html`](index.html)）は `data/spots.json` を読み込んで、カード一覧・条件絞り込み・地図で表示します。
- この README の一覧は [`scripts/build_readme.py`](scripts/build_readme.py) が `data/spots.json` から自動生成します（都道府県順にソート）。
- 施設の追加・更新のルールは [`.github/copilot-instructions.md`](.github/copilot-instructions.md) に定義しています。

---

*このガイドは個人的な体験・感想に基づくものです。料金や営業情報は変わることがあるため、必ず各施設の公式サイトでご確認ください。*
