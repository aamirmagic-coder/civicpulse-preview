# CivicPulse QA / Flag Register
This register distinguishes verified defects from provisional recommendations.

## Historical red flag list
Status: NOT RECOVERED. Do not label newly proposed items as original.

## Historical orange flag list
Status: NOT RECOVERED. Do not label newly proposed items as original.

## Provisional red flags (critical blockers before production)
- Public/private data boundary not enforced by a verified server-side authorization layer.
- Public issue map must not expose reporter identity or contact details.
- No production use until authentication, RBAC, account isolation and persistence are verified.
- Do not use production credentials, database or live resident records in the public preview.
- Imports must not overwrite existing records without explicit confirmation and successful validation.

## Provisional orange flags (important gaps / follow-up)
- The dashboard area-intelligence panel is a placeholder, not a live map.
- Module forms are currently generic and do not yet satisfy the full type-specific workflows.
- Current records are local to the browser/device and do not sync across devices.
- Local activity history is not a tamper-proof audit log.
- Voice dictation support and third-party speech handling vary by browser.
- The exact historical user-approved red/orange entries must be recovered from the archived source before treating this register as final.

## Proposed severity definitions
- Red: security/privacy risk, data loss, critical workflow failure, or a misleading public-facing claim.
- Orange: incomplete workflow, usability/accessibility issue, reliability limitation or missing non-critical capability.
