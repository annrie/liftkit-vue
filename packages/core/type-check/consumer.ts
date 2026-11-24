// 利用者のコードを模した型検査。パッケージ名での import は、exports を通って dist/index.d.ts に解決される
import { h } from 'vue'
import { LkButton, LkDropdown, getOnToken, useTheme, type ThemeColors } from '@liftkit-vue/core'

export const button = h(LkButton, { label: 'x', color: 'primary', size: 'md' })
export const dropdown = h(LkDropdown)
export const theme: () => ReturnType<typeof useTheme> = useTheme
export const primary: ThemeColors['primary'] = '#000000'
export const onToken = getOnToken('primary')

// src/types の手書きの型(グローバル)が dist/types から届いていること
export const size: LkSizeUnit = 'md'
export const color: LkColorWithOnToken = 'primary'

// @ts-expect-error 存在しない size はエラーになること(部品の型が any に落ちると、ここで検出できる)
export const wrongSize = h(LkButton, { label: 'x', size: 'huge' })
// @ts-expect-error 存在しない color はエラーになること
export const wrongColor: LkColorWithOnToken = 'no-such-color'
// @ts-expect-error 存在しない export はエラーになること(モジュール全体が any に落ちると、ここで検出できる)
export { noSuchExport } from '@liftkit-vue/core'
