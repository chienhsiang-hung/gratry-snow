import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';

export const dynamicParams = false;
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata = {
  title: "Terms of Service", 
};

export default async function TermsOfServicePage({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 sm:px-6">
      <div className="rounded-xl border bg-card p-8 shadow-sm">
        <h1 className="mb-6 text-3xl font-bold">Terms of Service (服務條款)</h1>
        <p className="mb-8 text-sm text-muted-foreground">Last Updated: {new Date().toLocaleDateString()}</p>

        <div className="space-y-8 text-sm leading-relaxed text-foreground">
          {/* Section 1: Acceptance */}
          <section>
            <h2 className="mb-3 text-xl font-semibold">1. Acceptance of Terms</h2>
            <p className="mb-2">
              By accessing and using Gratry Snow ("the Service"), you accept and agree to be bound by the terms and provision of this agreement.
            </p>
            <p className="text-muted-foreground">當您存取並使用 Gratry Snow (以下簡稱「本服務」) 時，即表示您接受並同意受本條款之拘束。</p>
          </section>

          {/* Section 2: YouTube API Services (Google 審查重點) */}
          <section>
            <h2 className="mb-3 text-xl font-semibold">2. YouTube API Services</h2>
            <p className="mb-2">
              Our Service utilizes <strong>YouTube API Services</strong> to allow you to upload your snowboarding trick videos directly to YouTube. By using this feature, you agree to be bound by the <a href="https://www.youtube.com/t/terms" target="_blank" rel="noreferrer" className="text-primary hover:underline">YouTube Terms of Service</a>.
            </p>
            <p className="text-muted-foreground">
              本服務使用 <strong>YouTube API 服務</strong> 協助您上傳滑雪平花影片。使用本功能即表示您同意遵守 YouTube 服務條款。
            </p>
          </section>

          {/* Section 3: User Content & Conduct */}
          <section>
            <h2 className="mb-3 text-xl font-semibold">3. User Content and Conduct</h2>
            <p className="mb-2">
              You are solely responsible for the videos and content you upload. You agree not to upload any content that is illegal, offensive, infringes on intellectual property rights, or violates YouTube's Community Guidelines. We reserve the right to remove any associated data or terminate accounts that violate these terms.
            </p>
            <p className="text-muted-foreground">
              您必須對您上傳的影片及內容負完全責任。您同意不上傳任何非法、具攻擊性、侵犯智慧財產權或違反 YouTube 社群規範的內容。我們保留移除違規資料或終止違規帳戶的權利。
            </p>
          </section>

          {/* Section 4: Disclaimer */}
          <section>
            <h2 className="mb-3 text-xl font-semibold">4. Disclaimer of Warranties</h2>
            <p className="mb-2">
              The Service is provided "as is" without any warranties, expressed or implied. We do not guarantee that the Service will be uninterrupted or error-free.
            </p>
            <p className="text-muted-foreground">
              本服務按「現況」提供，不附帶任何明示或暗示的保證。我們不保證本服務不會中斷或完全沒有錯誤。
            </p>
          </section>
          
          {/* Section 5: Changes to Terms */}
          <section>
            <h2 className="mb-3 text-xl font-semibold">5. Changes to Terms</h2>
            <p className="mb-2">
              We reserve the right to modify these terms at any time. We will notify users of any significant changes by updating the date at the top of this page.
            </p>
            <p className="text-muted-foreground">
              我們保留隨時修改本條款的權利。如有重大變更，我們將透過更新本頁面上方的日期來通知使用者。
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}