# Round 0 fixes

Nine of the ten high/medium findings were fixed. One was rejected on facts the
critic could not see.

| Finding | Severity | Action |
|---|---|---|
| Name renders "Girlscantrade2" | high | **Rejected.** A.1 marks "Girls Can Trade 2" `// CONFIRM` and §0.2 calls it an assumption. The owner confirmed this exact spelling. A confirmed value outranks the spec placeholder. |
| Emails collide at 768 in the black band | high | Fixed. The `dl` held half the grid and split it three ways, giving ~92px columns. Stacks until `lg`. Verified: investors y=4180, press y=4262, no overlap. |
| Home h2 reads "The firm" | high | Fixed. Now "A research house that trades." per A.8.3. |
| Article h2s render at body size in slate | high | Fixed. `Prose` set a display family but no size, so headings inherited body size. Now 30px Newsreader 400 black. |
| /firm "Where we are" is a fragment | high | Fixed. Three paragraphs in the A.10 voice. No address invented. |
| Home firm paragraphs paraphrased | medium | Fixed. A.8 gives P1 and P2 verbatim; restored. |
| 768 is the desktop grid squashed | medium | Fixed. Facts row holds 2x2 until `lg`. Verified 2 columns at 768. |
| Surface hidden below 768 | medium | Fixed. Renders at 390; hairline strokes leave the display type legible. |
| Article measure ~86 chars | medium | Fixed. 34em, ~64 chars. Departs from A.8's literal 680px; A.4's 34em cap is the readability floor and wins. |
| /disclosures measure ~88 chars | medium | Fixed. `.measure-prose` 680px → 34em. |
| Strategy values right-aligned | medium | Fixed. A.5: everything left-aligned. |
| Six strategy blocks identical | medium | **Not actioned.** A.8 mandates the structure: h2, definition list, two paragraphs, hairline between. Appendix C-3 wants density variation. §0.1 puts Appendix A first. |
| No focus capture in the round | medium | Fixed in the harness. Focus states are captured per page, so criterion 8 is now judgeable. |

## Harness bugs found and fixed

- Full-page screenshots were height-capped at 1800px and width-scaled, so the
  critic judged 390px mobile from a 119px-wide image. Now native fold shots plus
  unscaled full-page frames, segmented past 4000px.
- The focus-black capture used a fixed tab count and landed mid-page. It now
  targets a link inside the band directly.
- The kill list flagged the surface's `mask-image` gradient and the skip link.
  Both are required by the spec (A.6, A.9). Rules narrowed to the decorative
  gradient and to anchor-scroll nav specifically.
