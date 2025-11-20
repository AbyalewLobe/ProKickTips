import Link from "next/link";
import { Mail, Twitter, Linkedin } from "lucide-react";
import { FaTelegram, FaTelegramPlane } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold mb-4">ProKickTips</h3>
            <p className="text-foreground/60 text-sm">
              Professional football predictions powered by data and expertise.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/predictions"
                  className="text-foreground/60 hover:text-foreground"
                >
                  Predictions
                </Link>
              </li>
              <li>
                <Link
                  href="/history"
                  className="text-foreground/60 hover:text-foreground"
                >
                  History
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-foreground/60 hover:text-foreground"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-foreground/60 hover:text-foreground"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-foreground/60 hover:text-foreground"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-foreground/60 hover:text-foreground"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Follow</h4>
            <div className="flex gap-4">
              <a
                href="https://t.me/Abyalew07"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/60 hover:text-foreground"
              >
                <FaTelegramPlane size={20} />
              </a>

              <a
                href="https://www.linkedin.com/in/abyalew07"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/60 hover:text-foreground"
              >
                <Linkedin size={20} />
              </a>

              <a
                href="mailto:labyalew@gmail.com"
                className="text-foreground/60 hover:text-foreground"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-foreground/60">
          <p>&copy; 2025 ProKickTips. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-foreground">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
