// File: src/slices/TextBlock/index.tsx

import { Content, isFilled } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import Button from "@/components/Button";

/**
 * Props for `TextBlock`.
 */
export type TextBlockProps = SliceComponentProps<Content.TextBlockSlice>;

/**
 * Component for "TextBlock" Slices.
 */
const TextBlock = ({ slice }: TextBlockProps): JSX.Element => {
  return (
    <div className="max-w-prose">
      {/* Render Teks Utama */}
      <PrismicRichText field={slice.primary.text} />

      {/* Render Button (Jika ada link dan text button) */}
      {isFilled.link(slice.primary.button_link) &&
        slice.primary.button_text && (
          <div className="mt-8 flex justify-start">
            <Button
              linkField={slice.primary.button_link}
              label={slice.primary.button_text}
              className="font-semibold text-slate-900 text-sm py-3 px-4"
              showIcon={false}
            />
          </div>
        )}
    </div>
  );
};

export default TextBlock;