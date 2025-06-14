"use client";
import React, { useEffect, useRef } from "react";

interface RecaptchaProps {
  siteKey: string;
  onChange: (token: string) => void;
}

const Recaptcha: React.FC<RecaptchaProps> = ({ siteKey, onChange }) => {
  const recaptchaRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Load script if not present
    if (!document.getElementById("recaptcha-script")) {
      const script = document.createElement("script");
      script.src = "https://www.google.com/recaptcha/api.js";
      script.async = true;
      script.defer = true;
      script.id = "recaptcha-script";
      document.body.appendChild(script);
    }
    // Render widget
    const interval = setInterval(() => {
      const grecaptcha = (window as any).grecaptcha;
      if (grecaptcha && recaptchaRef.current && !recaptchaRef.current.hasChildNodes()) {
        grecaptcha.render(recaptchaRef.current, {
          sitekey: siteKey,
          callback: onChange,
        });
        clearInterval(interval);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [siteKey, onChange]);
  return <div ref={recaptchaRef} className="my-4" />;
};

export default Recaptcha;
