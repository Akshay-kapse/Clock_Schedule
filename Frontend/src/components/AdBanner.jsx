import React, { useEffect } from "react";

function AdBanner() {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  return (
    <ins className="adsbygoogle"
      style={{ display: "block", textAlign: "center" }}
      data-ad-client="ca-pub-8362591593697106"
      data-ad-slot="7894561230"  
      data-ad-format="auto"
      data-full-width-responsive="true">
    </ins>
  );
}

export default AdBanner;
