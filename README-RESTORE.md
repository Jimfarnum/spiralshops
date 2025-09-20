# Restore from backup
1) Pick an archive from `backups/20250818-012356/` (or any timestamp under `backups/`).
2) Extract:
   ```bash
   tar -xzf backups/20250818-012356/spiral-essential-code-20250818-012356.tar.gz -C /tmp/spiral-restore
   ```
3) Install & run:
   ```bash
   cd /tmp/spiral-restore
   npm ci
   npm run build --if-present
   npm start
   ```
4) Configure environment via `.env` (use `.env.example` as a template).
