# Kullanım rehberi (Türkçe)

"SEO'mu düzeltmek istiyorum" noktasından düzeltilmiş ve doğrulanmış bir siteye giden yol. Elinizde ne varsa ona uyan bölümü okuyun; geri kalanına gerek yok.

**[English guide →](GUIDE.md)**

- [1. Yolunuzu seçin](#1-yolunuzu-seçin)
- [2. Yol A — canlı siteyi bir dakikada denetleyin](#2-yol-a--canlı-siteyi-bir-dakikada-denetleyin)
- [3. Yol B — bir kodlama ajanına denetletip düzelttirin](#3-yol-b--bir-kodlama-ajanına-denetletip-düzelttirin)
- [4. Yol C — tek bir prompt kullanın](#4-yol-c--tek-bir-prompt-kullanın)
- [5. Raporu okumak](#5-raporu-okumak)
- [6. Düzeltmeyi kalıcı yapın: CI ve deploy kontrolleri](#6-düzeltmeyi-kalıcı-yapın-ci-ve-deploy-kontrolleri)
- [7. Google'ın ötesi](#7-googleın-ötesi)
- [8. Sorun giderme ve SSS](#8-sorun-giderme-ve-sss)

---

## 1. Yolunuzu seçin

| Elinizde… | Kullanın | Ne alırsınız |
|---|---|---|
| Sadece bir URL | **Yol A** — denetim aracı | Yaklaşık bir dakikada puanlı bir rapor |
| Projenin kodu ve bir yapay zekâ kodlama ajanı | **Yol B** — skill | Denetim → önceliklendirilmiş iş listesi → kodda düzeltmeler → yeniden doğrulanmış puan |
| Belirli bir soru ("robots.txt'im doğru mu?", "trafik neden düştü?") | **Yol C** — prompt kütüphanesi | O iş için kopyala-yapıştır bir prompt |

Yollar birlikte iyi çalışır. Tipik bir ilk hafta: Yol A ile nerede durduğunuzu görün, Yol B ile düzeltin, aracın ölçemediği içerik ve yapay zekâ görünürlüğü işleri için de Yol C'deki bir promptu kullanın.

---

## 2. Yol A — canlı siteyi bir dakikada denetleyin

**Gereksinim:** Node.js 18 veya üstü (`node --version`). Başka bir şey gerekmez.

```bash
npx github:umutxyp/Seo-Promt-Master --url https://siteniz.com --md seo-rapor.md
```

`npx` depoyu indirir ve denetçiyi çalıştırır. Projenize hiçbir şey kurulmaz, geride dosya kalmaz. Depoyu klonladıysanız `node tools/seo-audit.mjs` komutu aynı işi yapar.

Sırasıyla şunları yapar:
1. `robots.txt` dosyasını okur ve her büyük arama motoru ile yapay zekâ tarayıcısı için ayrı ayrı çözümler.
2. Host birleştirmesini kontrol eder (`http://` ve `www` varyantları).
3. Sitemap'i okur (sitemap index ve `.xml.gz` dosyaları dahil) ve yalnızca baştan değil, **tamamına yayılarak örnekler**. Bir kataloğun ilk N kaydı genelde tek bir şablondur.
4. Örneklenen her sayfayı denetler, ardından birden fazla sayfa gerektiren kontrolleri çalıştırır: hreflang karşılıklılığı, tekrarlanan başlıklar, canonical hedefleri.
5. Her şablonu soft 404 için yoklar.
6. SEO ve GEO puanlarını hesaplar ve raporu yazar.

### İşe yarayan bayraklar

| Bayrak | Ne zaman kullanılır |
|---|---|
| `--max 80` | Büyük siteler. Daha çok sayfa daha geniş kapsam demektir, çalışma süresi de uzar. Varsayılan 40. |
| `--404-paths "/blog /urunler /u"` | Bildiğiniz şablon köklerini ekleyin; her biri soft 404 için ayrıca yoklanır |
| `--json rapor.json` | Sonuçları başka bir araca veya panoya aktarmak için |
| `--fail-on P2` | CI'ı sıkılaştırır (varsayılan `P1`; `never` her zaman 0 ile çıkar) |
| `--url http://localhost:3000` | Yerel build'i yayına almadan önce denetlemek için |
| `--insecure` | Self-signed sertifikalı staging sunucusu |
| `--user-agent "…"` | WAF veya bot koruması varsayılan user-agent'ı engelliyorsa ([SSS](#8-sorun-giderme-ve-sss)) |

---

## 3. Yol B — bir kodlama ajanına denetletip düzelttirin

### Kurulum (proje başına bir kez)

```bash
git clone https://github.com/umutxyp/Seo-Promt-Master.git ~/seo-prompt-master
cd /projenizin/yolu
bash ~/seo-prompt-master/install.sh
```

Bu komut `.seo-prompt-master/` klasörünü (bilgi tabanı, promptlar, araçlar, prompt kütüphanesi) ve her ajanın okuduğu giriş dosyasını oluşturur: `.claude/skills/seo-audit/SKILL.md`, `AGENTS.md`, `.cursor/rules/seo-prompt-master.mdc`, `GEMINI.md` ve `.github/copilot-instructions.md`. `AGENTS.md` ve `GEMINI.md` zaten varsa üzerine yazılmaz, sonlarına ekleme yapılır.

> **Windows:** `install.sh` dosyasını Git Bash veya WSL'den çalıştırın. Denetim aracının kendisi (`node …/seo-audit.mjs` ya da `npx`) PowerShell'de doğrudan çalışır.

### Çalıştırma

Projeyi ajanınızda açın ve şunu söyleyin:

> **SEO denetimini çalıştır.** Canlı site https://siteniz.com (ya da: dev sunucusunu başlat ve localhost'u kullan).

Ajan bundan sonra `START.md` dosyasındaki adımları izler:

| Faz | Ne olur | Yazdığı dosya |
|---|---|---|
| 0 Hazırlık | Framework'ü, render modelini ve i18n yapısını tespit eder; başlangıç ölçümü için aracı çalıştırır | Stack raporu |
| 1 Keşif | **Her** route'u listeler ve sınıflandırır: `public-index`, `public-noindex` veya `private` | `ROUTES-INVENTORY.md` |
| 2 Denetim | İndekslenebilir her sayfada 9 maddelik kontrolü çalıştırır | `SEO-AUDIT-PROGRESS.md` |
| 3 Önceliklendirme | Önce altyapı olmak üzere tek bir iş listesi çıkarır ve başlangıç puanlarını hesaplar | (aynı dosya) |
| 4 Düzelt ve doğrula | Her madde için: düzelt → typecheck → lint → build → yeniden çek → işaretle | (aynı dosya) |
| 5 Canlı sinyaller | İsteğe bağlı: bağlı bir MCP SEO aracıyla gerçek Core Web Vitals verisi | (aynı dosya) |

**Saatler kazandıran ipuçları:**
- **Sorduğu iş kararlarını yanıtlayın** (örneğin "`/tools/x` indekslensin mi?" ya da yapay zekâ tarayıcı politikası). Yalnızca bu tür soruları sorması, beklerken de diğer işlere devam etmesi söylenmiştir.
- **Proje uzun mu?** Oturum kapanırsa yeni bir oturum açıp *"SEO denetimine devam et"* deyin. İki ilerleme dosyası her şeyi tutar.
- **Güvenin ama doğrulayın.** İş akışı bir puanı kesinleştirmeden önce kendi işaretlerinin rastgele %15'ini yeniden kontrol eder. Herhangi bir satırın kanıtını isteyebilirsiniz.

### Yeni sürüme güncelleme

```bash
cd ~/seo-prompt-master && git pull
cd /projenizin/yolu && bash ~/seo-prompt-master/install.sh
```

`.seo-prompt-master/` içeriği yenilenir. Projenizde zaten bulunan ajan giriş dosyalarına dokunulmaz; onları da yenilemek istiyorsanız önce silin.

---

## 4. Yol C — tek bir prompt kullanın

1. [`prompt-library/README.md`](prompt-library/README.md) dosyasını açıp bir kategori seçin.
2. İhtiyacınız olan promptun `text` bloğunu kopyalayın.
3. Her `{{değişken}}` yerine kendi bilginizi yazın.
4. Herhangi bir asistana yapıştırın.

Promptlar düz sohbette de çalışır. Asistan bu depoyu ya da projenizi görebildiğinde çok daha iyi çalışır: o zaman `docs/` dosyalarını kaynak gösterebilir, aracı çalıştırabilir ve kodu değiştirebilir. Her prompt asistana kanıt göstermesini ve eskimiş tavsiyelerden kaçınmasını söyler.

> Promptlar İngilizcedir; yapay zekâ asistanları bunları sorunsuz anlar. Yanıtı Türkçe almak için promptun sonuna **"Yanıtını Türkçe ver."** ekleyin.

**Başlamak için beş prompt:**
- [15 dakikalık sağlık kontrolü](prompt-library/01-start-here.md#quick-15-minute-health-check-url-only) — elinizde yalnızca URL varsa
- [robots.txt'i incele ve yeniden yaz](prompt-library/02-technical-seo.md#review-and-rewrite-robotstxt) — her lansmandan önce
- [Toplu title ve meta description yazımı](prompt-library/03-on-page-and-content.md#write-titles-and-meta-descriptions-in-bulk)
- [Yapay zekâ tarayıcı politikasına karar ver](prompt-library/05-geo-ai-search.md#decide-the-ai-crawler-policy)
- [Trafik düşüşünü teşhis et](prompt-library/07-monitoring-and-diagnosis.md#diagnose-a-traffic-drop)

---

## 5. Raporu okumak

### Önem dereceleri

| | Anlamı | Ne yapmalı |
|---|---|---|
| **P1** | Tarama veya indeksleme engeli: sayfa hiç indekslenmeyebilir | Her şeyden önce düzeltin. Tek bir P1, sayfanın puanını 60'ta sınırlar. |
| **P2** | İndeksleniyor ama yanlış temsil ediliyor (yanlış canonical, bozuk yapılandırılmış veri, yalnızca JavaScript ile gelen içerik…) | Ardından düzeltin |
| **P3** | Hijyen ve cila | Ortak bileşenlerden başlayarak toplu halde düzeltin |

Her bulgu dayandığı dokümanı belirtir (`docs/13`). Kuralı ve resmî kaynağını görmek için o dosyayı açın.

### İki puan

- **SEO Puanı** — teknik arama hazırlığı; bulgulardan hesaplanır. "Where the points went" tablosu puanların hangi `docs/11` kategorisinde kaybedildiğini gösterir.
- **GEO Puanı** — yapay zekâ cevap motorlarına hazırlık: açık bir yapay zekâ tarayıcı politikası, sunucuda render edilen HTML'de içerik, alıntılanabilir yapı, `sameAs` içeren bir varlık (entity), artı SEO Puanı'nın %15'i (yapay zekâ cevapları zaten sıralanan sayfalardan beslenir). *Heuristic* olarak işaretli satırlar aracın tam ölçemediği tahminlerdir; gizlenmez, etiketlenir.
- **"provisional"** sitemap'in yalnızca bir örneğinin çekildiği anlamına gelir. Daha geniş kapsam için `--max` değerini artırın.
- İki puan da backlink, içerik kalitesi veya rekabeti ölçmez. Yüksek puan temelin sağlam olduğunu söyler; sitenin sıralanacağını garanti etmez.

### Tarayıcı erişim tablosu

Bu tablo her tarayıcının ana sayfanıza erişip erişemediğini ve bunu robots.txt'deki hangi grubun belirlediğini gösterir.
- ⛔ işaretli bir **arama motoru** neredeyse her zaman bir hatadır. Bingbot engellenirse DuckDuckGo, Yahoo ve Copilot da siteyi kaybeder.
- ⛔ işaretli bir **AI training** tarayıcısı meşru bir tercihtir. ⛔ işaretli bir **AI search** tarayıcısı ise o ürünün sizi kaynak göstermeyeceği anlamına gelir. Her kararı bilinçli verin — artıları ve eksileri `docs/10`'da.

---

## 6. Düzeltmeyi kalıcı yapın: CI ve deploy kontrolleri

En pahalı SEO hataları kimsenin fark etmediği gerilemelerdir: canlıya çıkan bir staging `noindex`'i, boş dönen bir robots.txt, eksik sayfalar için 200 dönmeye başlayan bir şablon.

**Her deploy'dan sonra** (10 saniye):

```bash
SEO_SMOKE_404_PATHS="/ /blog /urunler" bash .seo-prompt-master/tools/seo-smoke.sh https://siteniz.com || rollback
```

**CI'da (GitHub Actions örneği):**

```yaml
- run: npm ci && npm run build
- run: npm start & npx --yes wait-on http://localhost:3000
- run: bash .seo-prompt-master/tools/seo-smoke.sh http://localhost:3000
- run: node .seo-prompt-master/tools/seo-audit.mjs --url http://localhost:3000 --max 25 --md seo-report.md
- uses: actions/upload-artifact@v4
  if: always()
  with: { name: seo-report, path: seo-report.md }
```

---

## 7. Google'ın ötesi

Referans motor Google'dır, ama önemli olan tek motor o değildir:

- **Bing** kendi sonuçlarını, **DuckDuckGo** ve **Yahoo** sonuçlarının büyük kısmını ve **Copilot** cevaplarını besler. Siteyi Bing Webmaster Tools'ta doğrulayın; içerik sık değişiyorsa **IndexNow** ekleyin. robots.txt'de `Crawl-delay` bırakmayın: Bing buna uyar.
- **Safari** aramaları varsayılan olarak Google'a gönderir. Apple'ın kendi yüzeyleri (Siri, Spotlight, Safari Önerileri) **Applebot** kullanır; Applebot'a özel bir grup yoksa Googlebot kurallarınıza uyar.
- **Brave** Googlebot kurallarınıza uyar ve bir webmaster paneli yoktur.
- **Yandex** için Yandex Webmaster gerekir; izleme parametreleri için `Clean-param` kullanın. Türkiye'de Yandex'in kayda değer bir payı vardır.

Ayrıntılar ve kaynaklar: [`docs/18`](docs/18-other-search-engines.md). Hazır promptlar: [Beyond Google](prompt-library/06-multi-engine.md).

---

## 8. Sorun giderme ve SSS

**"N URLs answered this tool with a bot-protection challenge."**
Cloudflare, Akamai veya Imperva aracın isteğine doğrulama ekranı (challenge) gösterdi. Bir veri merkezi IP'sinden bu normaldir ve o sayfalar puanlanmaz. Asıl önemli olan *gerçek* arama tarayıcılarının geçip geçemediğidir. Search Console → Ayarlar → Tarama istatistikleri'nde 403/503 sıçraması olup olmadığına bakın, o URL'lerden birinde URL Denetimi çalıştırın ve WAF'ınızda doğrulanmış botlara izin verildiğinden emin olun. Aracı kendi ağınızdan da çalıştırabilir ya da `--user-agent` verebilirsiniz.

**"No sitemap URLs found."**
robots.txt'de `Sitemap:` satırı yok ve `/sitemap.xml` de bulunamadı, bu yüzden yalnızca ana sayfa denetlendi. Bir sitemap ekleyin (`docs/06`) ya da ana sayfa bulgularından başlayın.

**Araç bilerek başka bir sayfayı gösteren canonical'ı işaretliyor.**
Bu bir P3 ve bir soru olarak yazılmıştır: bir varyant için doğrudur, tek başına duran bir sayfa için hatadır. Bilinçli bir tercihse görmezden gelin.

**İçerik kalitesini veya backlinkleri kontrol edebilir mi?**
Hayır, bunu kendisi de söyler. [Zayıf içerik ayıklama](prompt-library/03-on-page-and-content.md#triage-thin-and-low-value-pages) ve [E-E-A-T denetimi](prompt-library/03-on-page-and-content.md#e-e-a-t-and-trust-audit) promptlarını, ayrıca `docs/14` ve `docs/17`'yi kullanın.

**`llms.txt` eklemeli miyim?**
Bir SEO ya da GEO kaldıracı değildir — `docs/09`, `docs/10` ve [llms.txt promptuna](prompt-library/05-geo-ai-search.md#should-we-add-llmstxt) bakın. Olması da cezalandırılmaz.

**Çevrimdışı veya localhost'ta çalışır mı?**
Evet: `--url http://localhost:3000`. Host birleştirme kontrolleri localhost, IP adresleri ve açık port numaraları için atlanır.

**Kurallar nerede?**
[`docs/README.md`](docs/README.md) dosyasında. Her kural resmî kaynağını gösterir; bir iddia orada yoksa ajana tahmin etmek yerine bunu söylemesi söylenmiştir.
