const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

const NAME_REGEX = /^[a-zA-ZÀ-ÿ\s]+$/

const XSS_REGEX = /<[^>]*>/g

const EMOJI_REGEX = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{200D}\u{20E3}\u{E0020}-\u{E007F}]/gu

function containsXSS(value: string): boolean {
  return XSS_REGEX.test(value)
}

function containsEmoji(value: string): boolean {
  return EMOJI_REGEX.test(value)
}

export function sanitizeInput(value: string): string {
  let clean = value
  clean = clean.replace(XSS_REGEX, '')
  clean = clean.replace(EMOJI_REGEX, '')
  return clean
}

export function sanitizeName(value: string): string {
  let clean = sanitizeInput(value)
  clean = clean.replace(/[^a-zA-ZÀ-ÿ\s]/g, '')
  return clean
}

export function sanitizeEmail(value: string): string {
  let clean = sanitizeInput(value)
  clean = clean.replace(/[^a-zA-Z0-9._%+-@]/g, '')
  return clean
}

export function validateName(name: string): string | null {
  const trimmed = name.trim()
  if (trimmed.length === 0) return 'Nome é obrigatório'
  if (trimmed.length < 2) return 'Nome deve ter pelo menos 2 caracteres'
  if (containsXSS(trimmed)) return 'Nome contém caracteres não permitidos'
  if (containsEmoji(trimmed)) return 'Nome não pode conter emojis'
  if (!NAME_REGEX.test(trimmed)) return 'Nome só pode conter letras e espaços'
  return null
}

export function validateEmail(email: string): string | null {
  const trimmed = email.trim()
  if (trimmed.length === 0) return 'E-mail é obrigatório'
  if (containsXSS(trimmed)) return 'E-mail contém caracteres não permitidos'
  if (containsEmoji(trimmed)) return 'E-mail não pode conter emojis'
  if (!EMAIL_REGEX.test(trimmed)) return 'E-mail inválido'
  return null
}

export function validatePassword(senha: string): string | null {
  if (senha.length === 0) return 'Senha é obrigatória'
  if (senha.length < 8) return 'Senha deve ter pelo menos 8 caracteres'
  if (containsXSS(senha)) return 'Senha contém caracteres não permitidos'
  if (containsEmoji(senha)) return 'Senha não pode conter emojis'
  return null
}

export function validatePasswordMatch(senha: string, confirmar: string): string | null {
  if (confirmar.length === 0) return 'Confirmação de senha é obrigatória'
  if (senha !== confirmar) return 'As senhas não coincidem'
  return null
}
