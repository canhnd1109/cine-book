export function useDateInput() {
  function focusDateInput(inputRef: Ref<{ $el?: HTMLElement } | null> | { $el?: HTMLElement } | null): void {
    const component = inputRef && 'value' in inputRef ? inputRef.value : inputRef
    const el = component?.$el?.querySelector('input') as HTMLInputElement | null
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    el?.showPicker?.() || el?.focus()
  }

  return {
    focusDateInput
  }
}
