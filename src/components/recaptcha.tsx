"use client";

import { forwardRef, type Ref } from "react";

import ReCaptchaWidget, { type ReCAPTCHA } from "react-google-recaptcha";

import { useTheme } from "~/lib/theme";

export type ReCaptchaInner = ReCAPTCHA;
export type ReCaptchaProps = { captchaKey: string };

export const ReCaptcha = forwardRef<ReCaptchaInner, ReCaptchaProps>(function ReCaptcha(
  { captchaKey }: ReCaptchaProps,
  ref: Ref<ReCaptchaInner>,
) {
  const theme = useTheme();

  return (
    <div className="h-20">
      {theme && (
        <ReCaptchaWidget
          ref={ref}
          theme={theme}
          className="h-[76px] w-[302px] overflow-hidden rounded-[3px]"
          sitekey={captchaKey}
        />
      )}
    </div>
  );
});
