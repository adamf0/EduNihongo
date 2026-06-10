import React from "react";

export const TestimonialOverlay: React.FC = () => {
  return (
    <div className="absolute bottom-10 left-10 right-10 text-on-primary">
      <div className="p-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl">
        <p className="font-body-md text-lg italic leading-relaxed text-white">
          "Dulu saya bingung membaca menu di Tokyo, sekarang saya bisa berbicara dengan percaya diri kepada penduduk lokal!"
        </p>
        <div className="flex items-center gap-4 mt-6">
          <div className="w-14 h-14 rounded-full bg-secondary-container shadow-inner border-2 border-white/20 shrink-0"></div>
          <div>
            <p className="font-bold text-base text-white">Andini Putri</p>
            <p className="text-xs font-medium opacity-80 uppercase tracking-widest text-white/90">
              Pelajar Level N3
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialOverlay;
