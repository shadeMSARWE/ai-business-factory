import Script from "next/script";

/**
 * Applies stored locale before React hydrates to prevent RTL/LTR flash.
 */
export function LocaleInitScript() {
  return (
    <Script
      id="locale-init"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(){
            try {
              var s = localStorage.getItem('instantbizsite_locale');
              var rtl = s === 'ar' || s === 'he';
              if (s && ['en','ar','he'].indexOf(s) >= 0) {
                document.documentElement.lang = s;
                document.documentElement.dir = rtl ? 'rtl' : 'ltr';
              }
            } catch(e){}
          })();
        `,
      }}
    />
  );
}
