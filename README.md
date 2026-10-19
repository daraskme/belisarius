# プロコピオス『戦史』日本語訳

六世紀の歴史家プロコピオスによる『戦史』全8巻・243章・7,240節の日本語訳と、ギリシャ語原典・H. B. Dewing英訳の対訳サイトです。

- [全文・対訳サイト](https://belisarius.pages.dev/)
- [カクヨム連載](https://kakuyomu.jp/works/11054822665012517931)（2026年10月20日から毎日18:00、日本時間）

## AI翻訳と修正提案

この日本語訳は、ギリシャ語原典とDewing英訳を底本に、Claude Opus 4.7を用いて作成した既存の訳文を公開したものです。2026年10月20日に、欠落していた6.7.9・7.9.1を補訳し、6.7.8の末尾の訳抜けも補いました。全篇の学術的な校訂を済ませたものではありません。

**訳文に異論があれば、原文の根拠と修正案を添えてPull Requestをどうぞ。** 誤訳、脱落、人名・地名の表記、読みにくい箇所の改善を歓迎します。AI利用そのものへの賛否にとどまらず、具体的な訳文をよりよくする提案をお寄せください。

巻・章・節の番号を残しているので、修正箇所を特定できます。原文の読み、参照した版や研究文献、修正理由を添えてください。投稿方法は[CONTRIBUTING.md](CONTRIBUTING.md)をご覧ください。

## 訳文を直す

日本語本文は `translations/book01/1.json` のように巻・章ごとに分かれています。各節の `ja` を編集してください。節番号 `id` は変えないでください。

```json
{
  "id": "6.7.9",
  "ja": "ただし、船の警備には多くのイサウロイ人を残しておいた。…"
}
```

Node.js 22以降で、依存パッケージのインストールなしにビルドできます。

```sh
npm run check
npm run build
```

`dist/` に公開用ファイルが出力されます。`site/` は2026年10月20日の公開用静的HTMLを元にした表示用ベースです。元のAstroプロジェクトのソース一式ではありません。ビルドは `translations/` の訳文を反映し、既存の対訳・訳注・人名地名解説を保持します。既知の名称の解説ボタンは修正文にも付け直します。

**PRを `main` にマージすると、GitHub Actionsが検証・ビルドを実行し、Cloudflare Pagesの本番サイトに自動公開します。** 検証が失敗した場合は公開しません。PRの段階では本文の検証だけを行います。

自動公開は `.github/workflows/deploy.yml` に定義しています。接続情報はGitHubの `cloudflare-pages-production` 環境のSecretsに保存し、その環境で公開できるブランチは `main` に限定しています。手動でやり直す場合は、Actionsの「Cloudflare Pages 本番公開」からRun workflowを実行してください。

この自動公開の対象は対訳サイトです。カクヨムへの反映は別途行います。

## 出典と利用条件

- プロコピオス『戦史』、H. B. Dewing編・訳、Loeb Classical Library（1914–1928）。古代の原著およびDewing英訳はパブリックドメインとして参照しています。
- ギリシャ語原典：Perseus Digital Library。既存サイトはCC BY-SA 3.0と表記しています。今回追加した二節のギリシャ語データは[PerseusDL/canonical-greekLit](https://github.com/PerseusDL/canonical-greekLit/blob/master/data/tlg4029/tlg001/tlg4029.tlg001.perseus-grc2.xml)から取得し、同データセットのCC BY-SA 4.0表示を引き継ぎます。
- Dewing英訳：[LacusCurtius](https://penelope.uchicago.edu/Thayer/E/Roman/Texts/Procopius/home.html)、[Project Gutenberg（第5・6巻）](https://www.gutenberg.org/ebooks/20298)、[ToposText](https://topostext.org/work/666)。今回の補訳では6.7.8–9をGutenberg、7.9.1をToposText掲載のDewing本文と照合しました。
- 既存サイトの地名タグ等：ToposText（サイト記載：CC BY-NC 4.0）。原典、英訳、タグ・注釈はそれぞれ別の資料です。

公開リポジトリにしたことによって、第三者の資料の利用条件が変わるわけではありません。リポジトリ全体に一律のライセンスは付与していません。出典ごとの表示・条件を確認してください。
