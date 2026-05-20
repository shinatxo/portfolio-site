# Portfolio Site - shinaoguntoye.dev

Static personal site hosted on AWS. Built as the Tier 0 project in my cloud portfolio, en route to AWS SAA-C03.

🌐 **Live:** https://shinaoguntoye.dev

## Architecture

Browser
│  HTTPS (TLS via ACM)
▼
Route 53  ──►  CloudFront distribution  ──►  S3 bucket (private)
(DNS alias)    (edge caching + TLS)        (Origin Access Control)


## Services and why

| Service | Role | Why this choice |
| --- | --- | --- |
| **S3** | Stores the HTML/CSS | Private bucket with Block Public Access ON; only CloudFront can read. Modern OAC pattern, not legacy public-bucket static hosting. |
| **CloudFront** | Global CDN + TLS termination | Edge caching for performance; HTTPS-only viewer policy; Shield Standard for DDoS protection. |
| **ACM** | Free TLS certificate | DNS-validated, auto-renews. Lives in `us-east-1` because CloudFront only attaches certs from there. |
| **Route 53** | DNS | Apex + www A-alias records pointing at CloudFront. Alias queries are free (CNAMEs aren't, and CNAMEs can't be set at the apex). |
| **IAM** | Bucket policy | Least-privilege resource policy: only the `cloudfront.amazonaws.com` service principal, restricted to *this* distribution's ARN via the `AWS:SourceArn` condition. |
| **AWS WAF** | L7 protection | Bundled free on the CloudFront flat-rate plan. Managed rules in block mode. |

## Cost

- Domain: ~£10/year (`.dev`)
- Hosted zone: $0.50/month
- Everything else: within free tier for the first year
- Steady-state actual: _(filled in after month 1)_

## Security posture

See [THREAT_MODEL.md](./THREAT_MODEL.md). IAM Access Analyzer findings on the bucket: zero.

## Deploy

```bash
aws s3 sync ./site/ s3://shinaoguntoye.dev/ --delete
aws cloudfront create-invalidation --distribution-id <DIST_ID> --paths "/*"
```

