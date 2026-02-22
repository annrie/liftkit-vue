import {
  ref,
  provide,
  inject,
  onMounted,
  onBeforeUnmount,
  type InjectionKey,
  type Ref,
} from 'vue'

export interface DropdownContext {
  open: Ref<boolean>
  setOpen: (value: boolean) => void
  toggle: () => void
  triggerRef: Ref<HTMLElement | null>
  contentRef: Ref<HTMLDivElement | null>
}

export const DROPDOWN_INJECTION_KEY: InjectionKey<DropdownContext> = Symbol('liftkit-dropdown')

// Singleton registry to ensure only one dropdown is open at a time
interface DropdownInstance {
  close: () => void
}

let currentDropdown: DropdownInstance | null = null

function registerDropdown(instance: DropdownInstance) {
  if (currentDropdown && currentDropdown !== instance) {
    currentDropdown.close()
  }
  currentDropdown = instance
}

function unregisterDropdown(instance: DropdownInstance) {
  if (currentDropdown === instance) {
    currentDropdown = null
  }
}

/**
 * Provides dropdown state management to child components.
 * Call this in the root Dropdown component.
 */
export function provideDropdown() {
  const open = ref(false)
  const triggerRef = ref<HTMLElement | null>(null)
  const contentRef = ref<HTMLDivElement | null>(null)

  let instance: DropdownInstance | null = null

  function setOpen(value: boolean) {
    open.value = value
    if (value && instance) {
      registerDropdown(instance)
    } else if (!value && instance) {
      unregisterDropdown(instance)
    }
  }

  function toggle() {
    setOpen(!open.value)
  }

  // Click outside detection
  function handleClickOutside(e: MouseEvent) {
    if (
      contentRef.value &&
      !contentRef.value.contains(e.target as Node) &&
      triggerRef.value &&
      !triggerRef.value.contains(e.target as Node)
    ) {
      setOpen(false)
    }
  }

  // Keyboard navigation
  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape' && open.value) {
      setOpen(false)
      triggerRef.value?.focus()
    }
  }

  onMounted(() => {
    instance = { close: () => setOpen(false) }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
  })

  onBeforeUnmount(() => {
    if (instance) {
      unregisterDropdown(instance)
    }
    document.removeEventListener('mousedown', handleClickOutside)
    document.removeEventListener('keydown', handleKeyDown)
  })

  const ctx: DropdownContext = {
    open,
    setOpen,
    toggle,
    triggerRef,
    contentRef,
  }

  provide(DROPDOWN_INJECTION_KEY, ctx)

  return ctx
}

/**
 * Injects dropdown context. Must be used inside a component
 * that is a descendant of a component calling provideDropdown().
 */
export function useDropdown(): DropdownContext {
  const ctx = inject(DROPDOWN_INJECTION_KEY)
  if (!ctx) {
    throw new Error('useDropdown() must be used inside a Dropdown component')
  }
  return ctx
}
