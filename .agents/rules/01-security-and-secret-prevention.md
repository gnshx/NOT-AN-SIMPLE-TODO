# Universal Security & Secret Leak Prevention Rule

> **MANDATORY POLICY ACROSS ALL PROJECTS, REPOSITORIES, AND CHAT SESSIONS.**

## 1. Zero Secret Leaks Policy

1. **NO Hardcoded Secrets or Keys**:
   - NEVER commit or hardcode actual API keys, private keys, passwords, bearer tokens, or webhook secrets in any source file, configuration file, or CI/CD workflow (`.github/workflows/*.yml`, `gitlab-ci.yml`, Dockerfiles).
   - NEVER hardcode long synthetic hex strings (e.g. `0123456789abcdef...` or `whsec_...`) in workflow files or production code. Even if intended as dummy test data, security scanners and public commit viewers flag them as leaks.

2. **Secure CI/CD Workflow Execution**:
   - In GitHub Actions or test workflows that require 32-byte encryption keys or auth secrets, always generate them **dynamically and ephemerally** at test runtime:
     ```yaml
     - name: Generate Dynamic Ephemeral Test Secrets
       run: |
         echo "ENCRYPTION_MASTER_KEY=$(openssl rand -hex 32)" >> $GITHUB_ENV
         echo "AUTH_SECRET=$(openssl rand -hex 32)" >> $GITHUB_ENV
     ```
   - For real external service integration tests, reference secret values exclusively through GitHub repository secrets: `${{ secrets.SERVICE_API_KEY }}`.

3. **Pre-Commit File & Gitignore Auditing**:
   - Before committing any changes, verify that sensitive local environment files (`.env`, `.env.local`, `credentials.json`, `token.json`, `*.pem`, `*.key`) are explicitly listed in `.gitignore`.
   - Never stage or commit `.env` files. Provide only `.env.example` containing descriptive placeholders (e.g. `OPENAI_API_KEY="your_key_here"`).

4. **Fail-Closed Webhooks & Auth Routes**:
   - Webhook receivers (Stripe, GitHub, Telegram) must strictly fail closed: if the configured secret environment variable is missing on the server, reject with HTTP 500 configuration error. Never fall back to insecure default strings.
