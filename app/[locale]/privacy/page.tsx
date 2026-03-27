import { setRequestLocale } from 'next-intl/server';

export default function PrivacyPolicyPage({ 
  params: { locale } 
}: { 
  params: { locale: string } 
}) {
  setRequestLocale(locale);

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 sm:px-6">
      <div className="rounded-xl border bg-card p-8 shadow-sm">
        <h1 className="mb-6 text-3xl font-bold">Privacy Policy (隱私權政策)</h1>
        <p className="mb-8 text-sm text-muted-foreground">Last Updated: {new Date().toLocaleDateString()}</p>

        <div className="space-y-8 text-sm leading-relaxed text-foreground">
          {/* Section 1: Introduction */}
          <section>
            <h2 className="mb-3 text-xl font-semibold">1. Introduction</h2>
            <p className="mb-2">
              Gratry Snow ("we", "our", or "us") operates the Gratry Snow web application. This Privacy Policy informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
            </p>
            <p className="text-muted-foreground">Gratry Snow (以下簡稱「本服務」) 非常重視您的隱私權。本政策說明我們如何收集、使用及保護您的資料。</p>
          </section>

          {/* Section 2: YouTube API Services (Google 審查必看重點！) */}
          <section>
            <h2 className="mb-3 text-xl font-semibold">2. YouTube API Services</h2>
            <p className="mb-2">
              Our application uses <strong>YouTube API Services</strong> to allow you to upload snowboarding trick videos directly to your own YouTube channel. By using our application and its upload features, you are agreeing to be bound by the <a href="https://www.youtube.com/t/terms" target="_blank" rel="noreferrer" className="text-primary hover:underline">YouTube Terms of Service</a> and the <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" className="text-primary hover:underline">Google Privacy Policy</a>.
            </p>
            <p className="text-muted-foreground">
              本服務使用 <strong>YouTube API 服務</strong> 來協助您將滑雪影片上傳至您個人的 YouTube 頻道。當您使用本服務時，即表示您同意遵守 YouTube 服務條款與 Google 隱私權政策。
            </p>
          </section>

          {/* Section 3: Data Collection */}
          <section>
            <h2 className="mb-3 text-xl font-semibold">3. Information Collection and Use</h2>
            <p className="mb-2">
              We collect the minimum amount of information necessary to provide our service.
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-2">
              <li><strong>Google Account Data:</strong> We use Supabase Authentication to verify your identity via your Google Account. We only receive your email address and basic profile information.</li>
              <li><strong>YouTube Uploads:</strong> When you upload a video, it is sent directly to YouTube's servers via their API. <strong>We do not store your video files on our servers.</strong> We only store the resulting YouTube Video ID, trick name, and notes in our Supabase database to display them on your dashboard.</li>
              <li><strong>Local Processing:</strong> Video muting is performed entirely locally on your device using WebAssembly (FFmpeg.wasm). The unmuted original video never leaves your device.</li>
            </ul>
          </section>

          {/* Section 4: Revoking Access */}
          <section>
            <h2 className="mb-3 text-xl font-semibold">4. Revoking Access to Your Data</h2>
            <p className="mb-2">
              You can revoke Gratry Snow's access to your YouTube account at any time via your Google Account Security settings page. To do so, please visit the <a href="https://myaccount.google.com/permissions" target="_blank" rel="noreferrer" className="text-primary hover:underline">Google Security Settings</a> page and remove access for Gratry Snow.
            </p>
            <p className="text-muted-foreground">
              您可以隨時前往「Google 帳戶安全性設定」頁面，撤銷本服務對您 YouTube 帳戶的存取權限。
            </p>
          </section>

          {/* Section 5: Contact */}
          <section>
            <h2 className="mb-3 text-xl font-semibold">5. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us via our GitHub repository.</p>
          </section>
        </div>
      </div>
    </div>
  );
}