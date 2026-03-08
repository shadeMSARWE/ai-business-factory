"use client";

import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Header />
      <main className="pt-24 pb-20 px-6">
        <div className="container mx-auto max-w-3xl prose prose-invert prose-slate">
          <h1 className="text-4xl font-bold text-white mb-2">Privacy Policy</h1>
          <p className="text-slate-400 text-sm mb-12">Last updated: {new Date().toLocaleDateString("en-US")}</p>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h2>
            <p className="text-slate-300 leading-relaxed">
              We collect information you provide when using the AI Business Factory platform, including account details,
              prompts and inputs you submit to AI tools, and usage data necessary to operate and improve the service.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-3">2. How We Use Your Information</h2>
            <p className="text-slate-300 leading-relaxed">
              Your information is used to deliver the service, process AI generation requests, maintain your account,
              send important notices, and improve our platform. We do not sell your personal data to third parties.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-3">3. Data Security</h2>
            <p className="text-slate-300 leading-relaxed">
              We implement industry-standard security measures to protect your data. API keys and sensitive
              configuration are stored securely. Communication with our services uses encryption (HTTPS).
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-3">4. Third-Party Services</h2>
            <p className="text-slate-300 leading-relaxed">
              We use third-party services for authentication, hosting, and AI providers. Their use of data is governed
              by their respective privacy policies. We recommend reviewing those policies when using the platform.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-3">5. Your Rights</h2>
            <p className="text-slate-300 leading-relaxed">
              You may request access to, correction of, or deletion of your personal data. You can manage preferences
              and account settings from the dashboard. Contact us for any privacy-related requests.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-3">6. Contact</h2>
            <p className="text-slate-300 leading-relaxed">
              For privacy questions or requests, contact us at{" "}
              <a href="mailto:shademsarwe2@gmail.com" className="text-violet-400 hover:underline">
                shademsarwe2@gmail.com
              </a>{" "}
              or via the <Link href="/contact" className="text-violet-400 hover:underline">Contact</Link> page.
            </p>
          </section>

          <Link href="/" className="inline-flex text-violet-400 hover:underline mt-8">
            ← Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
