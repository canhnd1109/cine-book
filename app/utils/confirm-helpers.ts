export function formatConfirmContent(template: string, highlightText: string): string {
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
