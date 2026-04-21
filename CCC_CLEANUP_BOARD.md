# 🚀 CCC CLEANUP BOARD

**Project:** Carnivore Command Center  
**Branch:** `cleanup-start`  
**Status:** Strong progress — entering final cleanup + architecture lock phase

---

# 📊 OVERALL STATUS

| Phase | Status | Notes |
|------|--------|------|
| Phase 1 | ✅ Done | Safe junk cleanup complete |
| Phase 2 | ✅ Done | Mascot duplicates + asset cleanup complete |
| Phase 3 | ✅ Done | Route cleanup complete |
| Phase 4 | ✅ Done | Legacy shell retirement phase |
| Phase 5 | ⬜ Pending | App/public experience lock |

---

# ✅ DONE

## Cleanup Completed
- Removed obsolete docs
- Removed backup files
- Removed duplicate mascot junk files
- Deleted `investors/`
- Standardized to `investor/`

## Build System Confirmed
- `src/` = source of truth
- `dist/` = build output
- `node scripts/build.js` working

## Modern Pages Migrated
- ✅ Investor
- ✅ Contact
- ✅ Disclaimer
- ✅ Login
- ✅ Signup
- ✅ Reset Password

## Git Workflow Healthy
- Working branch = `cleanup-start`
- Commits pushed successfully
- Build process operational

---

# 🟡 DOING NOW (PHASE 4)

## Legacy Root Retirement

Old root pages still exist and likely keep legacy shell alive.

### Retirement Targets

- [x] `auth/login/index.html`
- [x] `auth/reset/index.html`
- [x] `auth/signup/index.html`
- [x] `contact/index.html`
- [x] `disclaimer/index.html`
- [x] `investor/index.html`

### After Retirement

- [x] Run build
- [x] Search for old shell references
- [x] Remove legacy assets if unused:
  - [x] `assets/css/site.css`
  - [x] `assets/js/site.js`

---

# 🔵 NEXT UP (PHASE 5)

## App Structure Lock

### Public Site
- Marketing nav
- Footer
- Public routes only

### App Experience
- `/app/` auth gateway
- `/app/dashboard/`
- `/app/log/`
- `/app/onboarding/`

### Must Confirm

- [ ] App pages no marketing header
- [ ] App pages no marketing footer
- [ ] App feels like real product
- [ ] Public site feels separate from app

---

# 🧪 FINAL QA

## Public Routes
- [ ] `/`
- [ ] `/product/`
- [ ] `/dashboard/`
- [ ] `/beta/`
- [ ] `/investor/`
- [ ] `/contact/`
- [ ] `/disclaimer/`

## Auth Routes
- [ ] `/auth/login/`
- [ ] `/auth/signup/`
- [ ] `/auth/reset/`

## App Routes
- [ ] `/app/`
- [ ] `/app/dashboard/`
- [ ] `/app/log/`

---

# 🏁 MERGE READINESS

- [ ] `git diff main...cleanup-start`
- [ ] Build passes clean
- [ ] No broken routes
- [ ] No duplicate assets
- [ ] Ready to merge into `main`

---

# 🎯 RIGHT NOW / SIMPLEST NEXT MOVE

## Option A (Recommended)
Retire old root legacy pages

## Option B
Lock app shell behavior

## Option C
Do final full QA pass

---

# 🧠 NORTH STAR

**Public site sells the vision.**  
**App delivers the product.**  
**Repo stays clean and scalable.**