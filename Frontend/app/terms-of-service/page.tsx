import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Terms of Service
          </h1>
          <p className="text-foreground/60 mb-6">
            These Terms of Service ("Terms") govern your use of ProKickTips'
            website and services. By accessing or using our services you agree
            to be bound by these Terms.
          </p>

          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-2">
              1. Acceptance of Terms
            </h2>
            <p className="text-foreground/60">
              By accessing or using ProKickTips, you agree to these Terms and
              our Privacy Policy. If you do not agree, do not use the Service.
            </p>
          </Card>

          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-2">2. Use of Service</h2>
            <p className="text-foreground/60 mb-2">
              You may use the Service only in compliance with these Terms and
              all applicable laws. We may suspend or terminate accounts that
              breach these Terms.
            </p>
            <p className="text-foreground/60">
              You are responsible for maintaining the confidentiality of your
              account credentials.
            </p>
          </Card>

          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-2">
              3. Account Registration
            </h2>
            <p className="text-foreground/60">
              To access certain features you must create an account. You must
              provide accurate information and keep it up to date. You are
              responsible for activity on your account.
            </p>
          </Card>

          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-2">
              4. Payments and Subscriptions
            </h2>
            <p className="text-foreground/60 mb-2">
              Paid features are provided on a subscription basis. All fees are
              described on our Pricing page. You authorize us to charge
              applicable fees and taxes to your chosen payment method.
            </p>
            <p className="text-foreground/60">
              Refunds and cancellations are subject to our refund policy (see
              Pricing page or contact support).
            </p>
          </Card>

          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-2">5. User Content</h2>
            <p className="text-foreground/60">
              You retain ownership of content you post, but by posting you grant
              ProKickTips a license to use, reproduce, and display that content
              in connection with the Service.
            </p>
          </Card>

          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-2">
              6. Prohibited Conduct
            </h2>
            <p className="text-foreground/60">
              You must not: use the Service for unlawful purposes; attempt to
              gain unauthorized access; interfere with the Service; or post
              abusive, harassing, or infringing content.
            </p>
          </Card>

          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-2">7. Disclaimers</h2>
            <p className="text-foreground/60 mb-2">
              The Service is provided "as is" and "as available". We disclaim
              all warranties to the fullest extent permitted by law, including
              merchantability and fitness for a particular purpose.
            </p>
            <p className="text-foreground/60">
              Predictions, tips, or other content do not guarantee results and
              should not be considered financial or professional advice.
            </p>
          </Card>

          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-2">
              8. Limitation of Liability
            </h2>
            <p className="text-foreground/60">
              To the maximum extent permitted by law, ProKickTips and its
              affiliates are not liable for indirect, incidental, consequential
              or punitive damages arising from your use of the Service.
            </p>
          </Card>

          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-2">9. Termination</h2>
            <p className="text-foreground/60">
              We may suspend or terminate your access for violations of these
              Terms or for any reason with notice as required by law.
            </p>
          </Card>

          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-2">10. Governing Law</h2>
            <p className="text-foreground/60">
              These Terms are governed by the laws of the jurisdiction where
              ProKickTips operates, without regard to conflict of law
              principles.
            </p>
          </Card>

          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-2">11. Changes to Terms</h2>
            <p className="text-foreground/60">
              We may update these Terms from time to time. Material changes will
              be communicated by posting updated Terms and, where appropriate,
              providing notice.
            </p>
          </Card>

          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-2">12. Contact</h2>
            <p className="text-foreground/60 mb-4">
              For questions about these Terms, contact us at
              support@prokicktips.example or visit our
            </p>
            <Button asChild>
              <Link href="/contact">Contact Page</Link>
            </Button>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
}
