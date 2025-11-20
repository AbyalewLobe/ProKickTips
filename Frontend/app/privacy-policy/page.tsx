import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Privacy Policy
          </h1>
          <p className="text-foreground/60 mb-6">
            This Privacy Policy explains how ProKickTips collects, uses,
            discloses, and protects your personal information when you use our
            website and services.
          </p>

          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-2">
              1. Information We Collect
            </h2>
            <p className="text-foreground/60 mb-2">
              We collect information you provide directly to us, such as when
              you register an account, submit a contact message, or make a
              payment. This may include your name, email address, billing
              information, and any other data you choose to provide.
            </p>
            <p className="text-foreground/60">
              We also automatically collect usage information, such as IP
              address, device and browser details, pages visited, and
              interactions with the site to help us improve our service.
            </p>
          </Card>

          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-2">
              2. How We Use Your Information
            </h2>
            <p className="text-foreground/60 mb-2">
              We use the information we collect to provide, maintain and improve
              our services, process payments, send important communications
              (such as account and billing notices), and to personalize your
              experience.
            </p>
            <p className="text-foreground/60">
              We may also use data for analytics and fraud prevention.
            </p>
          </Card>

          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-2">
              3. Cookies & Tracking
            </h2>
            <p className="text-foreground/60 mb-2">
              We use cookies and similar technologies to remember your
              preferences, enable functionality, and collect analytics about use
              of the site. You can control cookie settings through your browser,
              but disabling cookies may affect how the site works.
            </p>
          </Card>

          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-2">
              4. Third-Party Services
            </h2>
            <p className="text-foreground/60 mb-2">
              We may share information with third-party service providers who
              perform services on our behalf (e.g., payment processors,
              analytics providers). These providers are contractually bound to
              protect your information and only process it as directed by us.
            </p>
          </Card>

          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-2">5. Data Security</h2>
            <p className="text-foreground/60 mb-2">
              We implement reasonable administrative, technical, and physical
              safeguards to protect your personal information. However, no
              system can be completely secure — if you suspect suspicious
              activity on your account, please contact us immediately.
            </p>
          </Card>

          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-2">6. Your Rights</h2>
            <p className="text-foreground/60 mb-2">
              Depending on your jurisdiction, you may have rights to access,
              correct, or delete your personal information. To exercise those
              rights or ask questions, contact us at the address below.
            </p>
          </Card>

          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-2">7. Contact Us</h2>
            <p className="text-foreground/60 mb-4">
              If you have questions about this Privacy Policy or our data
              practices, please contact us at:
            </p>
            <p className="text-foreground/60 mb-4">Email: labyalew@gmail.com</p>
            <Button asChild>
              <Link href="/contact">Contact Page</Link>
            </Button>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-2">
              8. Updates to This Policy
            </h2>
            <p className="text-foreground/60">
              We may update this Privacy Policy from time to time. When we do,
              we will update the effective date and, where appropriate, notify
              you of significant changes.
            </p>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
}
