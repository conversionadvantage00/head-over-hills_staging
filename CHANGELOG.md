# Changelog

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
