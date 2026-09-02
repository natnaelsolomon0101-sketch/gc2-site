# QA — redesign/institutional

## Kill list (must return nothing)
```
PASS  grep -rn "→\|·\|ticker\|\$0M\|0\.0%" src/
PASS  grep -rn "uppercase\|italic\|tracking-\[" src/
PASS  grep -rn "shadow-\|rounded-lg\|rounded-xl\|rounded-full" src/
FAIL  text-\[\|bg-\[\|p-\[\|m-\[\|w-\[
src/app/page.tsx:40:            <h1 className="t-display reveal reveal-1 max-w-[11em] text-black">
src/app/not-found.tsx:15:          <h1 className="t-h1 max-w-[14em] text-black">This page is not here.</h1>
src/components/Wordmark.tsx:7:      className={`font-display text-[22px] font-normal leading-none ${onBlack ? "text-stone" : "text-black"}`}>
src/components/MobileNav.tsx:39:          className="font-display text-[40px] font-light leading-none text-black">
PASS  grep -rn "Girls Country\|Frost Bank\|555-" src/
PASS  grep -rn "font-mono\|monospace" src/
PASS  no banned deps in package.json
```

## Structural
- PASS site.name appears only in src/config/site.ts
- PASS no anchor hrefs in Nav or Footer
- Strategy anchors resolve:
    systematic-macro -> /strategies#systematic-macro OK
    volatility-arbitrage -> /strategies#volatility-arbitrage OK
    statistical-relative-value -> /strategies#statistical-relative-value OK
    commodity-carry -> /strategies#commodity-carry OK
    event-dislocation -> /strategies#event-dislocation OK
    tail-overlay -> /strategies#tail-overlay OK
