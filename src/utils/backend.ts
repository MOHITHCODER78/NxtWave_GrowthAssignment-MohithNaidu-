export type PersistenceMode = 'local-only' | 'supabase-ready';

export interface BackendStatus {
  mode: PersistenceMode;
  hasSupabaseUrl: boolean;
  hasSupabaseAnonKey: boolean;
  isSecurelyConfigured: boolean;
  warning: string;
}

function readEnv(name: string): string | undefined {
  const value = typeof import.meta !== 'undefined' ? import.meta.env?.[name] : undefined;
  if (typeof value === 'string' && value.trim()) return value.trim();
  return undefined;
}

export function getBackendStatus(): BackendStatus {
  const supabaseUrl = readEnv('VITE_SUPABASE_URL');
  const supabaseAnonKey = readEnv('VITE_SUPABASE_ANON_KEY');
  const isSecurelyConfigured = Boolean(supabaseUrl && supabaseAnonKey);

  return {
    mode: isSecurelyConfigured ? 'supabase-ready' : 'local-only',
    hasSupabaseUrl: Boolean(supabaseUrl),
    hasSupabaseAnonKey: Boolean(supabaseAnonKey),
    isSecurelyConfigured,
    warning: isSecurelyConfigured
      ? 'Server-backed persistence is configured in the environment; non-browser validation and service-role secrets must stay on the server.'
      : 'No backend credentials are configured. This app is running in local-only prototype mode and should not be treated as secure or production-persistent storage.',
  };
}

export function hasBackendConfig(): boolean {
  const { isSecurelyConfigured } = getBackendStatus();
  return isSecurelyConfigured;
}

export function getPersistenceMode(): PersistenceMode {
  return getBackendStatus().mode;
}

export function getBackendChecklist(): string[] {
  return [
    'Set VITE_SUPABASE_URL to the project URL only.',
    'Set VITE_SUPABASE_ANON_KEY for browser-safe, non-service-role access.',
    'Keep service-role keys and database secrets on the server only.',
    'Add row-level security and admin authorization before live production use.',
  ];
}
