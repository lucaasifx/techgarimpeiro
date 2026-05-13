-- Migration 0006 — Helpers de Role para RLS
-- Funções usadas nas policies (0007) para verificar o role do admin autenticado.

CREATE OR REPLACE FUNCTION current_admin_role()
RETURNS text
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT role FROM admin_users WHERE id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS boolean
LANGUAGE sql STABLE AS $$
  SELECT current_admin_role() = 'super_admin'
$$;

CREATE OR REPLACE FUNCTION is_curator_or_above()
RETURNS boolean
LANGUAGE sql STABLE AS $$
  SELECT current_admin_role() IN ('super_admin', 'curator')
$$;

CREATE OR REPLACE FUNCTION is_authenticated_admin()
RETURNS boolean
LANGUAGE sql STABLE AS $$
  SELECT current_admin_role() IS NOT NULL
$$;
