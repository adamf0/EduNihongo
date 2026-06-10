import React from "react";
import Logo from "../Atoms/Logo";
import Icon from "../Atoms/Icon";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-surface-container-high py-20 px-margin-mobile md:px-margin-desktop border-t border-outline-variant/30">
      <div className="max-w-container-max mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 lg:gap-8">
          {/* Brand block */}
          <div className="lg:col-span-2 space-y-6">
            <Logo className="text-3xl" />
            <p className="text-base text-on-surface-variant max-w-xs leading-relaxed">
              Membawa ketenangan dalam proses belajar bahasa Jepang. Modern, minimalis, dan dirancang untuk retensi maksimal.
            </p>
            <div className="flex gap-4">
              <a
                className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm group"
                href="#"
                aria-label="Website"
              >
                <Icon name="public" className="text-base block group-hover:text-white text-on-surface" />
              </a>
              <a
                className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm group"
                href="#"
                aria-label="Email"
              >
                <Icon name="mail" className="text-base block group-hover:text-white text-on-surface" />
              </a>
            </div>
          </div>

          {/* Links block 1 */}
          {/* <div>
            <h5 className="font-bold text-primary mb-8 uppercase tracking-widest text-xs">
              Produk
            </h5>
            <ul className="space-y-4 text-base text-on-surface-variant font-medium">
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Flashcards Premium
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Kamus Kanji
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Audio Native
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Komunitas
                </a>
              </li>
            </ul>
          </div> */}

          {/* Links block 2 */}
          {/* <div>
            <h5 className="font-bold text-primary mb-8 uppercase tracking-widest text-xs">
              Perusahaan
            </h5>
            <ul className="space-y-4 text-base text-on-surface-variant font-medium">
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Tentang Kami
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Blog Zen
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Karir
                </a>
              </li>
            </ul>
          </div> */}

          {/* Links block 3 */}
          <div>
            <h5 className="font-bold text-primary mb-8 uppercase tracking-widest text-xs">
              Bantuan
            </h5>
            <ul className="space-y-4 text-base text-on-surface-variant font-medium">
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Pusat Bantuan
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Kontak
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Privasi
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer bottom bar */}
        <div className="pt-16 mt-16 border-t border-outline-variant/20 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-sm text-on-surface-variant font-medium">
            © 2024 NihongoZen. Dibuat dengan ❤️ untuk pelajar bahasa Jepang di seluruh dunia.
          </p>
          <div className="flex gap-6 items-center">
            <span className="text-sm text-on-surface-variant font-medium">
              Pilih Bahasa:
            </span>
            <div className="relative">
              <select
                className="appearance-none bg-surface-container-highest/50 border border-outline-variant/30 text-sm py-2 px-6 rounded-full focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer font-bold text-on-surface"
                defaultValue="Bahasa Indonesia"
              >
                <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                <option value="English">English</option>
                <option value="日本語">日本語</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
