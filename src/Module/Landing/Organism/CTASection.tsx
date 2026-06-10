import React from "react";
import Button from "../Atoms/Button";
import { useNavigate } from "react-router-dom";

export const CTASection: React.FC = () => {
    const navigate = useNavigate();

    return (
        <section className="py-32 px-margin-mobile md:px-margin-desktop">
            <div className="max-w-5xl mx-auto zen-card bg-primary text-on-primary p-16 md:p-24 rounded-[64px] text-center space-y-10 relative overflow-hidden">
                <div className="relative z-10 space-y-8">
                    <h2 className="font-display-jp text-4xl md:text-6xl leading-tight text-white">
                        Siap untuk memulai perjalanan Zen Anda?
                    </h2>
                    <p className="font-body-md text-on-primary/80 max-w-2xl mx-auto text-xl text-white/80">
                        Bergabunglah dengan ribuan pelajar lainnya dan rasakan
                        cara belajar yang lebih tenang, efektif, dan mendalam
                        hari ini.
                    </p>
                    <div className="pt-8 flex flex-col sm:flex-row justify-center gap-6">
                        <Button
                            variant="custom"
                            onClick={() => navigate("/dashboard")}
                            className="bg-secondary-container text-on-secondary-container px-12 py-5 rounded-full font-bold text-xl hover:scale-105 shadow-xl shadow-secondary-container/20"
                        >
                            Daftar Sekarang - Gratis
                        </Button>
                        {/* <Button
              variant="custom"
              className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-12 py-5 rounded-full font-bold text-xl hover:bg-white/20"
            >
              Lihat Paket Pro
            </Button> */}
                    </div>
                </div>
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-fixed/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
            </div>
        </section>
    );
};

export default CTASection;
