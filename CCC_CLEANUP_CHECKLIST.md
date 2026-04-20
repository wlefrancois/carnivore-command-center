# ✅ CCC Cleanup Checklist

**Project:** Carnivore Command Center  
**Working Branch:** `cleanup-start`  
**Source of Truth:** GitHub `main`  
**Goal:** Separate public site from real app, remove junk, simplify assets, and make future builds easier.

---

# 📊 Progress

- **Phase 1:** ✅ Complete
- **Phase 2:** ⏳ In Progress
- **Phase 3:** ⬜ Not Started
- **Phase 4:** ⬜ Not Started
- **Phase 5:** ⬜ Not Started

---

# 🟢 Phase 1 — Initial Safe Cleanup

## Completed
- [x] Delete `BRAND_SYSTEM.md`
- [x] Delete `DEPLOYMENT_GUIDE.md`
- [x] Delete `ROADMAP.md`
- [x] Delete `src/index.bkup`
- [x] Create cleanup branch `cleanup-start`
- [x] Commit Phase 1 cleanup
- [x] Push Phase 1 cleanup to GitHub

---

# 🟡 Phase 2 — Safe File Cleanup

## General cleanup
- [ ] Review `assets/README.md`
- [ ] Delete `assets/README.md` if unused
- [ ] Delete `assets/img/test.txt`

## Duplicate mascot junk files
- [ ] Delete `assets/img/mascot/metabo-damage-control.webp.png`
- [ ] Delete `assets/img/mascot/metabo-damage-control.webp.webp`
- [ ] Delete `assets/img/mascot/metabo-focus.webp.png`
- [ ] Delete `assets/img/mascot/metabo-recovery.webp.png`
- [ ] Delete `assets/img/mascot/metabo-recovery.webp.webp`
- [ ] Delete `assets/img/mascot/metabo-scientist.webp.png`
- [ ] Delete `assets/img/mascot/metabo-scientist.webp.webp`
- [ ] Delete `assets/img/mascot/metabo-scientist1.webp.png`
- [ ] Delete `assets/img/mascot/metabo-travel.webp.png`
- [ ] Delete `assets/img/mascot/metabo-travel.webp.webp`
- [ ] Delete `assets/img/mascot/metabo-welcome.webp.png`
- [ ] Delete `assets/img/mascot/metabo-welcome.webp.webp`
- [ ] Delete `assets/img/mascot/metabo-workout.webp.png`
- [ ] Delete `assets/img/mascot/metabo-workout.webp.webp`

## Keep these core mascot files
- [ ] Keep `metabo-home-hero.webp`
- [ ] Keep `metabo-dashboard.webp`
- [ ] Keep `metabo-focus.webp` or `metabo-focus.png` whichever is actually used
- [ ] Keep `metabo-welcome.webp` or `metabo-welcome.png` whichever is actually used
- [ ] Keep `metabo-avatar.png`

## Commit checkpoint
- [ ] Run `git status`
- [ ] Run `git add .`
- [ ] Run `git commit -m "Cleanup pass 2 remove duplicate mascot files"`
- [ ] Run `git push`

---

# 🟠 Phase 3 — Route Cleanup

## Route decisions
- [ ] Decide whether to keep `investor/` or `investors/`
- [ ] Delete the duplicate route folder
- [ ] Update links to the surviving route

## Lock route purposes
- [ ] Confirm `dashboard/` = public demo only
- [ ] Confirm `app/dashboard/` = real app only
- [ ] Confirm `app/index.html` = auth entry

## Commit checkpoint
- [ ] Run `git status`
- [ ] Run `git add .`
- [ ] Run `git commit -m "Cleanup pass 3 route cleanup"`
- [ ] Run `git push`

---

# 🔵 Phase 4 — CSS / JS Cleanup

## CSS review
- [ ] Confirm `css/styles.css` is the public site stylesheet
- [ ] Confirm whether `assets/css/site.css` is used
- [ ] Delete `assets/css/site.css` if unused

## JS review
- [ ] Confirm `js/site.js` is the active site script
- [ ] Confirm whether `assets/js/site.js` is used
- [ ] Delete `assets/js/site.js` if unused

## Public vs app separation
- [ ] Public pages use marketing header/footer
- [ ] App pages do not use marketing header/footer
- [ ] App pages do not rely on public-site nav behavior

## Commit checkpoint
- [ ] Run `git status`
- [ ] Run `git add .`
- [ ] Run `git commit -m "Cleanup pass 4 css and js cleanup"`
- [ ] Run `git push`

---

# 🟣 Phase 5 — App Structure Lock

## Keep and focus
- [ ] Keep `app/index.html` as auth gateway
- [ ] Keep `app/onboarding/`
- [ ] Keep `app/dashboard/`
- [ ] Keep `app/log/`

## App shell rules
- [ ] App pages use app topbar only
- [ ] App pages do not show marketing footer
- [ ] App pages do not show marketing header
- [ ] App pages feel clearly different from public pages

## Commit checkpoint
- [ ] Run `git status`
- [ ] Run `git add .`
- [ ] Run `git commit -m "Cleanup pass 5 lock app structure"`
- [ ] Run `git push`

---

# 🧪 Final Validation

## Public routes
- [ ] Test `/`
- [ ] Test `/dashboard/`
- [ ] Test `/product/`
- [ ] Test `/beta/`

## App routes
- [ ] Test `/app/`
- [ ] Test `/app/dashboard/`
- [ ] Test `/app/log/`

## Visual checks
- [ ] Confirm no duplicate header on app pages
- [ ] Confirm no marketing footer on app pages
- [ ] Confirm mascot images load correctly
- [ ] Confirm logo paths still work
- [ ] Confirm public and app experiences feel clearly separated

---

# 🏁 Ready to Merge

- [ ] Review `git diff main...cleanup-start`
- [ ] Confirm local site works
- [ ] Confirm GitHub branch looks clean
- [ ] Merge `cleanup-start` into `main`

---

# 📝 Notes

- Use `[x]` for completed items
- Commit after each cleanup pass
- Keep changes small and safe