// @vitest-environment happy-dom
import { describe, it, expect, afterEach, vi } from 'vitest'
import { defineComponent, h, inject } from 'vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import {
  provideDropdown,
  useDropdown,
  DROPDOWN_INJECTION_KEY,
  type DropdownContext,
} from '../../src/composables/useDropdownRegistry'

const mounted: VueWrapper[] = []

/**
 * provideDropdown() を呼ぶルートと、useDropdown() を呼ぶ子を実際にマウントする。
 * ルートはトリガー(button)とメニュー(div)に ctx の ref を結び付ける。
 */
function mountDropdown() {
  let ctx!: DropdownContext
  let childCtx!: DropdownContext
  let injected: DropdownContext | undefined

  const Child = defineComponent({
    setup() {
      childCtx = useDropdown()
      injected = inject(DROPDOWN_INJECTION_KEY)
      return () => h('span', 'child')
    },
  })
  const Root = defineComponent({
    setup() {
      ctx = provideDropdown()
      return () =>
        h('div', [
          h('button', { ref: ctx.triggerRef, id: 'trigger' }, 'open'),
          h('div', { ref: ctx.contentRef, id: 'content' }, [h('span', { id: 'inside' }, 'inside')]),
          h(Child),
        ])
    },
  })
  const wrapper = mount(Root, { attachTo: document.body })
  mounted.push(wrapper)
  return { wrapper, ctx, childCtx, injected }
}

function mouseDownOn(target: Element) {
  target.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
}

function pressKey(key: string) {
  document.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
}

afterEach(() => {
  // モジュール内のシングルトン(現在開いているドロップダウン)を次のテストへ持ち越さない
  while (mounted.length) mounted.pop()!.unmount()
  document.body.replaceChildren()
  vi.restoreAllMocks()
})

describe('provideDropdown / useDropdown', () => {
  it('初期状態は閉じていて、トリガーとメニューの要素が ref に入る', () => {
    const { ctx, wrapper } = mountDropdown()
    expect(ctx.open.value).toBe(false)
    expect(ctx.triggerRef.value).toBe(wrapper.get('#trigger').element)
    expect(ctx.contentRef.value).toBe(wrapper.get('#content').element)
  })

  it('setOpen と toggle で開閉できる', () => {
    const { ctx } = mountDropdown()
    ctx.setOpen(true)
    expect(ctx.open.value).toBe(true)
    ctx.toggle()
    expect(ctx.open.value).toBe(false)
    ctx.toggle()
    expect(ctx.open.value).toBe(true)
    ctx.setOpen(false)
    expect(ctx.open.value).toBe(false)
  })

  it('子の useDropdown() は、ルートが provide したのと同じ context を返す', () => {
    const { ctx, childCtx, injected } = mountDropdown()
    expect(childCtx).toBe(ctx)
    expect(injected).toBe(ctx)
  })

  it('provide されていない場所の useDropdown() は、分かりやすいエラーで失敗する', () => {
    // setup 外での inject は Vue が警告を出す。ここで見たいのは例外だけなので警告は黙らせる
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(() => useDropdown()).toThrow('useDropdown() must be used inside a Dropdown component')
  })
})

describe('同時に開けるのは1つだけ', () => {
  it('別のドロップダウンを開くと、先に開いていた方が閉じる', () => {
    const a = mountDropdown()
    const b = mountDropdown()
    a.ctx.setOpen(true)
    expect(a.ctx.open.value).toBe(true)

    b.ctx.setOpen(true)
    expect(b.ctx.open.value).toBe(true)
    expect(a.ctx.open.value).toBe(false)

    a.ctx.setOpen(true)
    expect(a.ctx.open.value).toBe(true)
    expect(b.ctx.open.value).toBe(false)

    // 自分自身を開き直しても閉じない
    a.ctx.setOpen(true)
    expect(a.ctx.open.value).toBe(true)
  })

  it('アンマウントしたドロップダウンは登録から外れ、後から開いた方が触らない', () => {
    const a = mountDropdown()
    const b = mountDropdown()
    a.ctx.setOpen(true)
    a.wrapper.unmount()
    mounted.splice(mounted.indexOf(a.wrapper), 1)

    // まだ登録されていれば b を開いた時点で a.close() が呼ばれ、a の open が false になる
    b.ctx.setOpen(true)
    expect(a.ctx.open.value).toBe(true)
    expect(b.ctx.open.value).toBe(true)
  })
})

describe('キーボードとクリックによる閉じ方', () => {
  it('Escape で閉じ、フォーカスをトリガーへ戻す', () => {
    const { ctx, wrapper } = mountDropdown()
    ctx.setOpen(true)
    pressKey('Escape')
    expect(ctx.open.value).toBe(false)
    expect(document.activeElement).toBe(wrapper.get('#trigger').element)
  })

  it('閉じているときの Escape や、Escape 以外のキーでは何も起きない', () => {
    const { ctx, wrapper } = mountDropdown()
    pressKey('Escape')
    expect(ctx.open.value).toBe(false)
    expect(document.activeElement).not.toBe(wrapper.get('#trigger').element)

    ctx.setOpen(true)
    pressKey('Enter')
    pressKey('ArrowDown')
    expect(ctx.open.value).toBe(true)
  })

  it('外側の mousedown で閉じ、メニュー内・トリガー上の mousedown では閉じない', () => {
    const { ctx, wrapper } = mountDropdown()
    ctx.setOpen(true)

    mouseDownOn(wrapper.get('#inside').element)
    expect(ctx.open.value).toBe(true)
    mouseDownOn(wrapper.get('#trigger').element)
    expect(ctx.open.value).toBe(true)

    mouseDownOn(document.body)
    expect(ctx.open.value).toBe(false)
  })

  it('アンマウント後は document のリスナーが外れ、外側クリックにも Escape にも反応しない', () => {
    const remove = vi.spyOn(document, 'removeEventListener')
    const { ctx, wrapper } = mountDropdown()
    ctx.setOpen(true)
    wrapper.unmount()
    mounted.splice(mounted.indexOf(wrapper), 1)

    expect(remove.mock.calls.map(([type]) => type).sort()).toEqual(['keydown', 'mousedown'])
    mouseDownOn(document.body)
    pressKey('Escape')
    expect(ctx.open.value).toBe(true)
  })
})
