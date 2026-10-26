# SUKUMA! QA / Flag Register

This register distinguishes verified constraints from provisional recommendations. It is not the recovered historical flag list.

## Critical blockers before production
- **BLOCKED:** No verified server-side authentication, authorization, account isolation, or role enforcement in this public frontend.
- **BLOCKED:** No verified secure municipal case-submission endpoint or status integration.
- **BLOCKED:** No production persistence, backup recovery, or tamper-proof audit trail verified.
- **REQUIRED:** Do not enter live resident, political, health, financial, or other sensitive data in the preview.
- **REQUIRED:** Public maps or issue feeds must never expose reporter identity/contact details.
- **REQUIRED:** Imports must validate the complete payload and require explicit confirmation before replacing any local data.

## Important gaps
- The area-intelligence panel is a placeholder, not a live map or verified statistics.
- Some module forms remain generic and do not satisfy complete type-specific workflows.
- Records remain local to one browser/device and do not sync across devices.
- Browser-local activity history is not a tamper-proof security audit trail.
- Speech recognition varies by browser and may send audio to a browser/vendor service.
- Exact official logo files, colour values, clear-space/minimum-size rules, and font/licence details require owner verification.
- Automated checks validate source-level invariants; they do not replace browser, device, screen-reader, or contrast testing.

## Proposed severity definitions
- **Red:** security/privacy risk, data loss, critical workflow failure, or misleading public-facing claim.
- **Orange:** incomplete workflow, usability/accessibility issue, reliability limitation, or missing non-critical capability.
