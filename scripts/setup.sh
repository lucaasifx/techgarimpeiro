#!/usr/bin/env bash
# setup.sh — checklist interativo do Sprint 0
# Execute: bash scripts/setup.sh

set -euo pipefail

BOLD="\033[1m"
GREEN="\033[32m"
YELLOW="\033[33m"
CYAN="\033[36m"
RESET="\033[0m"

step() { echo -e "\n${BOLD}${CYAN}▶ $1${RESET}"; }
ok()   { echo -e "  ${GREEN}✓${RESET} $1"; }
warn() { echo -e "  ${YELLOW}!${RESET} $1"; }

step "Verificando dependências"
command -v node   >/dev/null 2>&1 && ok "Node.js $(node -v)" || { warn "Node.js não encontrado — instale v20+"; exit 1; }
command -v pnpm   >/dev/null 2>&1 && ok "pnpm $(pnpm -v)"   || { warn "pnpm não encontrado — corepack enable"; exit 1; }
command -v supabase >/dev/null 2>&1 && ok "Supabase CLI"     || warn "Supabase CLI não encontrado (opcional para dev local)"

step "Instalando dependências do monorepo"
pnpm install
ok "pnpm install concluído"

step "Verificando .env"
if [ ! -f ../.env ]; then
  cp ../.env.example .env
  warn ".env criado a partir de .env.example — preencha as variáveis antes de continuar"
else
  ok ".env já existe"
fi

step "Checklist manual — confirme cada item antes de continuar:"
echo ""
echo "  [ ] 1. Crie um projeto no Supabase (https://supabase.com)"
echo "  [ ] 2. Habilite as extensões: pgcrypto, pg_cron, pg_trgm, http"
echo "         Database → Extensions → buscar e habilitar"
echo "  [ ] 3. Execute as migrations na ordem:"
echo "         supabase db push  OU  copie cada arquivo em Database → SQL Editor"
echo "         - supabase/migrations/0001_base_tables.sql"
echo "         - supabase/migrations/0002_triggers_functions.sql"
echo "         - supabase/migrations/0003_cron_jobs.sql  (após configurar app.workers_url)"
echo "         - supabase/migrations/0004_storage_buckets.sql"
echo "         - supabase/migrations/0005_enable_rls.sql"
echo "         - supabase/migrations/0006_role_helpers.sql"
echo "         - supabase/migrations/0007_policies.sql"
echo "  [ ] 4. Execute o seed: supabase/seed.sql"
echo "  [ ] 5. Desative signup público:"
echo "         Authentication → Providers → Email → desmarcar 'Enable Sign Ups'"
echo "  [ ] 6. Crie o primeiro admin:"
echo "         Authentication → Users → Invite user"
echo "         Depois insira em admin_users:"
echo "         INSERT INTO admin_users (id, email, role)"
echo "         VALUES ('<uuid-do-auth>', '<email>', 'super_admin');"
echo "  [ ] 7. Atualize SUPABASE_URL e as chaves no .env"
echo "  [ ] 8. Solicite acesso à AliExpress Open Platform:"
echo "         https://portals.aliexpress.com"
echo "  [ ] 9. Crie o canal e grupo no Telegram:"
echo "         - Canal: somente admins postam"
echo "         - Grupo de discussão linkado ao canal"
echo "         - Adicione o bot como admin em ambos"
echo "  [ ] 10. Atualize channels SET telegram_chat_id = '<id>' WHERE slug = 'main'"
echo ""
ok "Setup concluído. Próximo passo: Sprint 1 — Discovery worker + AliExpress adapter"
