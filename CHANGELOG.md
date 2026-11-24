# Changelog

## v15 (2026-11-24)
- Phones: the Specials and Experiences card rows now drift slowly on a seamless loop, like Accommodation.
- All card carousels (Accommodation, Specials, Experiences) stop for good once the visitor touches, swipes, taps a card or uses the arrows; they no longer start again by themselves. Desktop Accommodation still pauses while the mouse is over it.
- Hidden loop copies are only shown on phones; desktop grids are unchanged. Reduced-motion visitors get no drift.

## v14 (2026-11-24)
- Experiences Golf card reframed on the golfer (object-position 24%) so phones and tall cards show him and the swing, not just the club head.
- Phones: Treatments and Weddings now sit in the same swipe carousel as the five Experiences cards (seven cards in one row, same size and style). Desktop keeps the two large panels.

## v13 (2026-11-24)
- Favicon and home-screen icons made from the client's own social profile picture (CI pack, Logo/Social Media): 16, 32, 192 and 180 (Apple) sizes in img/meta.
- Social share image (img/meta/og-image.jpg, 1200x630): the sunset deck photo with the small white primary logo bottom left, kept away from the horizon as the guide asks. Open Graph and X card tags added, with the existing page title and description. Share URLs point at the staging address and must be changed when the site moves to its real domain.

## v12 (2026-11-24)
- Contact sunset photo now melts into Midnight evenly on every edge (top, left, right and bottom) at all screen widths, instead of fading on some sides and showing hard square edges on others. Phones fade top and bottom only so the narrow crop keeps its full width.

## v11 (2026-11-19)
- Cookie preferences view now lists Essential (always on), Analytics and Marketing, each with its own on/off switch, like the Conversion Advantage card. Choices save and are shown again when reopened from the footer.

## v10 (2026-11-19)
- Cookie consent replaced with a small corner card copied from the Conversion Advantage site, in Head over Hills colours and fonts: Midnight card, Abask title with "matters." in Lagoon Mist, Shell buttons (Accept all, Reject optional), Manage preferences switches the card to a preferences view in place. No overlay, no blur, page stays scrollable, focus is not taken on first visit. Footer Cookie Preferences opens the card on the preferences view. Old full-screen photo card and separate preferences panel removed.

## v9 (2026-11-19)
- Contact section now opens on the client's sunset deck photo (Knysna Heads), with "Stay for the view." over it and the form panel rising over the photo's lower edge on a Midnight field with a Lagoon Mist top rule. Phone: 4:5 crop, details and form stack below.

## v8 (2026-11-19)
- Contact form restyled to the CI: no blue box, hairline underline fields on Midnight, Adam labels in Shell, Lagoon Mist focus line, Knysna Blue Submit.
- Accommodation subline ("Experience the Charm & Magic of our Boutique Hotel") now sits on one line on desktop; wraps naturally on phones.

## v1 (2026-11-06)
First build on Brand Guide V2. Sections: hero, about, specials (8 pop-ups), Hästens scroll scene, accommodation (8 rooms, sideways scroll, gallery pop-ups), Moments to Remember (dining, Wine Cellar with its own mark and red accent, experiences, treatments, weddings), awards, photo album, FAQ, contact. GSAP + ScrollTrigger + Lenis.

## v2 (2026-11-06)
Added the 18 photos from the CI pack (kept in assets/ci-photos, sized to 2400 wide in src/img/new) alongside the old ones: a four-photo dining strip under Dining, eight more in the Dining pop-up, thirteen more in the Photo Album. HoH28 (a couple at sunset) left out, as the people are not known. Fixed strip photo heights and phone strip widths. Phone file 5.1 MB.

## v3 (2026-11-18) audit round
- Copy audit against headoverhills specials site: every line present. Only differences: brand spellings, two typos, dashes removed, bullets as a list.
- Added the 12 clean Hästens photos from the original site's Hästens section as a sideways row (with arrows) under the Hästens scene. The 6 Hästens banners with text printed on them stay out.
- Added all 16 new CI pack PIONEER photos: a four-photo scroll scene after About using the guide's experience-led line (Wake to the ocean. Linger over breakfast. Watch the light change over the Heads. Sleep deeply.), aerials in the Photo Album, platters in the Dining and Celebrations pop-ups. hoh3 moved from the album into the scene.
- Photo rows open in the lightbox. Nav background now updates during smooth scroll. Pinned scenes are created in page order.
- Every section of index.html, site.css, site.js and build_single.py marked with * (reviewed 2026-11-18).
- Phone file 4.92 MB, full file 58.5 MB.

## v4 (2026-11-18) rooms carousel
Megan: visitors should not be stuck on Accommodation while scrolling through the rooms. The pinned sideways scroll is gone. The room cards now drift slowly on their own (26 px a second on desktop, 18 on phones) and loop without end (a hidden second copy of the cards). Mouse over the row: it stops and works like a normal row (hover zoom, click opens the room, arrows, trackpad sideways). On phones a finger stops it; it carries on 4 seconds after letting go. It also stops while a pop-up is open, off screen, or on keyboard focus. Reduced motion: no drift, plain row with arrows. Files head-over-hills-20261118-1440-*.html, snapshot versions/v4.

## v5 (2026-11-18) colours checked against Brand Guide V2
- Buttons (Reserve your stay, Book Now, Enquire Now, View our Menu, Submit) and the WhatsApp button were Lagoon Mist fills. The guide says Mist is a glint of colour only and calls to action use Knysna Blue, so they are now Knysna Blue with white text (hover: white with Midnight Lagoon text).
- Pop-up arrows and close button hover in Knysna Blue instead of Mist.
- Off-brand darks (#0b0b20, #0a0a1c) replaced with Midnight Lagoon; the pop-up backdrop is now Midnight Lagoon too.
- Form error pinks replaced with white (bold text, thicker border). Wine Cellar button hover is white with Wine Cellar Red text instead of a darker red.
- Slate was unused: the Awards section now sits on a Slate field (guide: Shell + Slate = balance).
- Mist stays only where the guide allows it: stars, rules, underlines, the selected words ("view."), small labels, focus rings.
- The CSS now holds only the six brand colours plus white.

## v6 (2026-11-18) full brand guide pass and premium pop-ups
Brand Guide V2 re-read end to end and the site checked against every rule.
- Shell + Slate = balance: the FAQ now sits on a Slate field (as well as Awards). Shell stays the body text and thin-rule colour.
- Wine Cellar: the guide pairs the white lock-up with a Wine Cellar Red field, so the logo now sits on a red tile. Red stays inside the Wine Cellar only.
- Adam (the guide's secondary face for geometric labels, used sparingly) added for the "Learn More" labels and the small amenity headings. Font from the CI pack; web licence to confirm, like Century Gothic.
- 8-point rhythm: off-grid spacing (6, 12, 14, 18, 20, 88 px) moved to 8, 16, 24, 96.
- House rule: "luxury retreat" in lower case in running copy (About paragraph). The formal descriptor stays capitalised.
Card pop-ups redesigned:
- Larger window, photo side 60 percent. Photos fill the frame; a photo smaller than the frame sits on a soft blurred copy of itself instead of empty bands (never stretched past real size).
- Thin rule markers along the bottom of the photo show which photo you are on (Mist on the current one).
- Book Now and Enquire are pinned at the bottom, always in view; the copy scrolls above with soft fades and a thin Slate scroll bar instead of the white browser bar.
- Title with a short Mist rule beneath (red in the Wine Cellar pop-up); amenities as a tidy list with thin dividers.
- Arrows and close button: square, thin Shell outline, frosted, Knysna Blue on hover. Gentle opening motion.
Files head-over-hills-20261118-1643-*.html (phone 4.9 MB), snapshot versions/v6. Not on staging.

## v7 (2026-11-19) privacy and POPIA
Nothing else on the site changed.
- Cookie consent panel (bottom centre, ivory tint of Shell, Abask heading, brand buttons): Accept all, Reject optional, Manage preferences, plus Privacy Policy and Cookie Policy links. Bottom sheet on phones. Fades up; no motion with reduced motion on.
- Cookie preferences panel: Essential (always on). Analytics and Marketing exist in the code but are hidden while the site runs no tracking (Megan: no tracking for now; the old site's GTM-5RFZ7TPT was not carried over).
- Working consent engine in js/site.js: blocks scripts marked type="text/plain" data-consent="..." (and iframes with data-src) until consent, runs each once, stores the choice in localStorage (hoh-consent, with version 2026-11-19), restores it on return, re-asks when the version changes, clears that category's cookies and reloads on withdrawal. window.hohConsent.open() / get() / has().
- Cookie Policy panel (site's dark editorial style), based on what the site actually stores.
- Footer: Privacy Policy and Terms & Conditions (link to the client's own PDFs on headoverhills.co.za), Cookie Policy, Cookie Preferences.
- Enquiry form: privacy notice above Submit linking to the Privacy Policy. No marketing checkbox (the site offers no newsletter or marketing sign-up).
Files head-over-hills-20261119-0920-*.html (phone 4.96 MB), snapshot versions/v7.
- Fix (same day): the enquiry form's Submit button is now Midnight Lagoon on the Knysna Blue form (it was blue on blue since v5). Hover: white.
- Restyle (same day, Megan: "looks nothing like what I wanted"): the consent panel now follows the SUNSET reference closely. Attached flush to the bottom edge instead of floating, near-white (a 10 percent tint of Shell), short and wide (880 px, text on two lines), close cross top right (closes with optional cookies off), three small equal Knysna Blue buttons in light uppercase. Preferences panel matches. Bottom sheet on phones kept.
- Redesign (same day, Megan: the box should look like the reference "with an image of head over hills"): the consent panel is now a card like the SUNSET reference. A large rounded photo of Head over Hills (the aerial above the Heads, already on the site) with the white primary lock-up at the top and the white cookie box at the bottom centre; the page behind is softly blurred and does not scroll. Focus starts in the box and stays inside it; Escape or the cross closes with optional cookies off. On phones the photo is shifted to keep the house in view. The decorative wave shape from the reference was left out (the brand guide bans wave motifs).
