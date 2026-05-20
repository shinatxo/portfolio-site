# Threat Model — Portfolio Site

Mini STRIDE pass for a static, public-facing site (S3 + CloudFront + Route 53 + ACM). Updated 2026-05-20.

## Assets
- Site content (low sensitivity — public marketing material)
- Domain name + DNS records (integrity matters)
- AWS account credentials (high sensitivity — out of scope of the site itself but in scope of the operator)

## STRIDE

### Spoofing — someone serves a fake site under shinaoguntoye.dev
**Mitigated by:** ACM-issued TLS cert, HTTPS-only viewer protocol policy on CloudFront. Users see the padlock and a valid cert chain. Cert auto-renews via DNS validation.

### Tampering — site contents modified in transit or in the bucket
**Mitigated by:** TLS for in-transit integrity. At-rest: S3 bucket policy permits `s3:GetObject` only to the CloudFront service principal scoped by `AWS:SourceArn`. No write access from CloudFront. Operator write access is via the IAM admin user only.

### Repudiation
Not applicable — no user actions on the site to audit.

### Information disclosure — bucket goes public, or secrets leak in client-side code
**Mitigated by:** Block Public Access ON at the bucket level. OAC-scoped bucket policy. IAM Access Analyzer scan shows zero public/cross-account findings. Operating rule: no secrets in the site code or repo — it's a static front door.

### Denial of Service — volumetric attack on the origin
**Mitigated by:** CloudFront absorbs L3/L4 attacks; AWS Shield Standard is free and on by default for CloudFront. AWS WAF (bundled on the flat-rate plan) provides L7 protection with AWS-managed rule sets in block mode. S3 is shielded behind CloudFront — not directly reachable (verified via `curl -I` returning 403 against the S3 REST endpoint).

### Elevation of privilege
Not applicable — no compute, no auth, no roles assumed at runtime.

## Known limitations
- Layer 7 DDoS auto-mitigation is gated behind CloudFront Business plan; not enabled.
- Bucket versioning is off — accidental overwrite via `aws s3 sync --delete` is not recoverable. Acceptable for a low-stakes static site; will reconsider for Tier 1 projects.

## Evidence
- IAM Access Analyzer: clean (screenshot in `/docs/evidence/`)
- Direct-S3 access blocked: 403 confirmed via curl (output in `/docs/evidence/s3-direct-403.txt`)
- TLS cert chain: valid (verified in browser and `curl -vI`)
