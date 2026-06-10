import React from "react";
import Icon from "../Atoms/Icon";

interface MnemonicBoxProps {
  htmlContent: string;
}

export const MnemonicBox: React.FC<MnemonicBoxProps> = ({ htmlContent }) => {
  return (
    <section className="bg-secondary-fixed rounded-xl p-8 flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
      {/* Background large decorative lightbulb icon */}
      <div className="absolute -right-4 -top-4 opacity-10 pointer-events-none select-none">
        <Icon
          name="lightbulb"
          className="text-[160px] text-on-secondary-fixed block"
        />
      </div>

      <div className="flex-1 relative z-10">
        <h4 className="text-xs font-bold uppercase text-on-secondary-fixed-variant mb-3 flex items-center gap-2 select-none">
          <Icon name="tips_and_updates" className="text-sm block" />
          Mnemonic / Pengingat
        </h4>
        <p
          className="text-xl font-body-lg-jp text-on-secondary-fixed leading-relaxed"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </section>
  );
};

export default MnemonicBox;
