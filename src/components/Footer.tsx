import React from 'react';
import { Logo } from './Logo';
import { ArrowUp, Github, Twitter, Instagram, Youtube } from 'lucide-react';

interface FooterProps {
  onNavClick: (href: string) => void;
  onOpenModal: (type: 'docs' | 'support' | 'faq') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavClick, onOpenModal }) => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="relative border-t border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-[#06080D] pt-16 pb-12 text-slate-600 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 pb-14 border-b border-slate-200 dark:border-white/10">
          {/* Brand Column (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                scrollToTop();
              }}
              className="inline-block focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg cursor-pointer"
            >
              <Logo size="md" />
            </a>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              Technology for the next generation.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>All Systems Operational • 2026 Edge Mesh</span>
            </div>
          </div>

          {/* Column 1: Company */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 font-mono">
              Company
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => onNavClick('#about')}
                  className="hover:text-slate-950 dark:hover:text-white transition-colors duration-150 focus:outline-none focus:underline cursor-pointer"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavClick('#services')}
                  className="hover:text-slate-950 dark:hover:text-white transition-colors duration-150 focus:outline-none focus:underline cursor-pointer"
                >
                  Services
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavClick('#products')}
                  className="hover:text-slate-950 dark:hover:text-white transition-colors duration-150 focus:outline-none focus:underline cursor-pointer"
                >
                  Products
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavClick('#contact')}
                  className="hover:text-slate-950 dark:hover:text-white transition-colors duration-150 focus:outline-none focus:underline cursor-pointer"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 font-mono">
              Resources
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenModal('docs')}
                  className="hover:text-slate-950 dark:hover:text-white transition-colors duration-150 focus:outline-none focus:underline cursor-pointer"
                >
                  Documentation
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenModal('support')}
                  className="hover:text-slate-950 dark:hover:text-white transition-colors duration-150 focus:outline-none focus:underline cursor-pointer"
                >
                  Support
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenModal('faq')}
                  className="hover:text-slate-950 dark:hover:text-white transition-colors duration-150 focus:outline-none focus:underline cursor-pointer"
                >
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Social */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 font-mono">
              Social
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="NeubytrixID Instagram (opens in new tab)"
                  className="inline-flex items-center gap-2 hover:text-slate-950 dark:hover:text-white transition-colors duration-150 cursor-pointer"
                >
                  <Instagram className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                  <span>Instagram</span>
                </a>
              </li>
              <li>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="NeubytrixID X / Twitter (opens in new tab)"
                  className="inline-flex items-center gap-2 hover:text-slate-950 dark:hover:text-white transition-colors duration-150 cursor-pointer"
                >
                  <Twitter className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <span>X</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="NeubytrixID GitHub (opens in new tab)"
                  className="inline-flex items-center gap-2 hover:text-slate-950 dark:hover:text-white transition-colors duration-150 cursor-pointer"
                >
                  <Github className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>GitHub</span>
                </a>
              </li>
              <li>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="NeubytrixID YouTube (opens in new tab)"
                  className="inline-flex items-center gap-2 hover:text-slate-950 dark:hover:text-white transition-colors duration-150 cursor-pointer"
                >
                  <Youtube className="w-4 h-4 text-rose-500 dark:text-rose-400" />
                  <span>YouTube</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright and back-to-top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="text-slate-500 dark:text-slate-400">
            © 2026 NeubytrixID. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="text-slate-500 dark:text-slate-400 font-mono">
              Designed with Precision & Ergonomics
            </span>
            <button
              id="footer-back-to-top-btn"
              type="button"
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center gap-1.5 cursor-pointer"
              aria-label="Back to top"
            >
              <span>Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
