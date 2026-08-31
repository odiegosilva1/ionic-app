export interface PasswordRule {
  label: string;
  test: (senha: string) => boolean;
}

export const PASSWORD_RULES: PasswordRule[] = [
  { label: 'Pelo menos 8 caracteres', test: (s) => s.length >= 8 },
  { label: 'Uma letra maiúscula', test: (s) => /[A-Z]/.test(s) },
  { label: 'Uma letra minúscula', test: (s) => /[a-z]/.test(s) },
  { label: 'Um número', test: (s) => /[0-9]/.test(s) },
  {
    label: 'Um caractere especial (!@#$%...)',
    test: (s) => /[^A-Za-z0-9]/.test(s),
  },
];

export function getPasswordStrength(senha: string): number {
  return PASSWORD_RULES.filter((r) => r.test(senha)).length;
}

export function getStrengthColor(strength: number): string {
  if (strength <= 2) return 'danger';
  if (strength <= 3) return 'warning';
  if (strength <= 4) return 'medium';
  return 'success';
}

export function getStrengthLabel(strength: number): string {
  if (strength === 0) return '';
  if (strength <= 2) return 'Fraca';
  if (strength <= 3) return 'Razoável';
  if (strength <= 4) return 'Boa';
  return 'Forte';
}

export function ruleMet(rule: PasswordRule, senha: string): boolean {
  return rule.test(senha);
}
