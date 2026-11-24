// ビルド(vite)の入口。CSS をここで読み込むのは、index.ts に書くと型定義(dist/index.d.ts)にも
// CSS の import が残り、skipLibCheck: false の利用者で型エラー(TS2882)になるため
import './css/index.css'

export * from './index'
