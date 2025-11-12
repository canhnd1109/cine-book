export function formatConfirmContent(template: string, highlightText: string): string {
  // Trên server (SSR), trả về text thuần không format
  if (!import.meta.client) {
    return template
  }

  const escapeHtml = (text: string) => {
    const div = document.createElement('p')
    div.textContent = text
    return div.innerHTML
  }

  const escapedTemplate = escapeHtml(template)
  const escapedHighlight = escapeHtml(highlightText)

  return escapedTemplate.replace(
    new RegExp(escapedHighlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'),
    `<strong class="font-semibold">${escapedHighlight}</strong>`
  )
}
