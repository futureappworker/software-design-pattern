# 軟體設計模式

## 目錄

- `example-1` - OOP 技法一：依賴
- `example-2` - OOP 技法二：關聯 1對1
- `example-3` - OOP 技法二：關聯 多對多
- `example-4` - OOP 技法三：關聯類別
- `example-5` - OOP 技法四：抽象類別

- `stage-1` - 副本一：撲克牌比大小遊戲

- `example-6` - 策略模式 step-1
- `example-6` - 策略模式 step-2

- `stage-2` - 副本二：交友配對系統

- `stage-3`/`PlayingCard` - 牌類遊戲框架 - 簡易撲克牌比大小遊戲

- `stage-3`/`UNO` - 牌類遊戲框架 - 簡易 UNO

- `stage-3` - 副本四：大老二撲克牌遊戲

## 執行

OOP 技法一：依賴
```bash
pnpm exec tsx example-1/src/index.ts
```

OOP 技法二：關聯 1對1
```bash
pnpm exec tsx example-2/src/index.ts
```

OOP 技法二：關聯 多對多
```bash
pnpm exec tsx example-3/src/index.ts
```

OOP 技法三：關聯類別
```bash
pnpm exec tsx example-4/src/index.ts
```

OOP 技法四：抽象類別
```bash
pnpm exec tsx example-5/src/index.ts
```

副本一：撲克牌比大小遊戲
```bash
pnpm exec tsx stage-1/src/index.ts
```

策略模式 step-1
```bash
pnpm exec tsx example-6/step-1/src/index.ts
```

策略模式 step-2
```bash
pnpm exec tsx example-6/step-2/src/index.ts
```

副本二：交友配對系統 - 策略模式
```bash
pnpm exec tsx stage-2/step-2/src/index.ts
```

副本二：交友配對系統 - 策略模式 + 樣板方法
```bash
pnpm exec tsx stage-2/step-4/src/index.ts
```

副本三：牌類遊戲框架 - 簡易撲克牌比大小遊戲
```bash
pnpm exec tsx stage-3/PlayingCard/src/index.ts
```

副本三：牌類遊戲框架 - 簡易 UNO
```bash
pnpm exec tsx stage-3/UNO/src/index.ts
```

副本四：大老二撲克牌遊戲
```bash
pnpm exec tsx stage-4/src/index.ts
```

## Node.js 環境執行 TypeScript

安裝開發依賴：
```bash
pnpm add -D typescript tsx @types/node
pnpm exec tsc --init
```

設定 `tsconfig.json`：
```json
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "node",
    "target": "ES2023",
    "strict": true,
    "esModuleInterop": true,
    "ignoreDeprecations": "6.0"
  }
}
```

設定 `package.json`：
```json
{
  "type": "module",
  "engines": {
    "node": "22.x"
  }
}
```

## 安裝 Vitest

```bash
pnpm add -D vitest
```

在 `package.json` 的 scripts 區塊加入：
```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run"
  }
}
```

設定 `vitest.config.ts`
```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node'
  },
})
```


## 安裝 Biome

```bash
pnpm add -D @biomejs/biome
pnpm biome init
```

設定 `biome.json`
```json
{
  "$schema": "https://biomejs.dev/schemas/2.4.16/schema.json",

  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2
  },

  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "style": {
        "noNonNullAssertion": "error"
      },
      "suspicious": {
        "noExplicitAny": "warn"
      }
    }
  },

  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "semicolons": "asNeeded"
    }
  }
}
```

在 `package.json` 的 scripts 區塊加入：
```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "lint": "biome lint .",
    "format": "biome format . --write",
    "check": "biome check . --write"
  }
}
```

設定 `.vscode/settings.json`
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "biomejs.biome",
  "editor.codeActionsOnSave": {
    "source.organizeImports": "never"
  },

  "[javascript]": {
    "editor.defaultFormatter": "biomejs.biome"
  },

  "[typescript]": {
    "editor.defaultFormatter": "biomejs.biome"
  },

  "[javascriptreact]": {
    "editor.defaultFormatter": "biomejs.biome"
  },

  "[typescriptreact]": {
    "editor.defaultFormatter": "biomejs.biome"
  },

  "css.validate": false,
  "less.validate": false,
  "scss.validate": false
}
```

VSCode 安裝 extension
```
Biome
```

## Forces 範例

### 依模式語意命名 class

替換算法 → Strategy

處理請求 → Handler

接收事件 → Listener

### 策略模式 ( Strategy Pattern )

```
Force-BV (原始型):
在 <操作> 中可抽換多種行為之一
可以選擇多種執行行為之一
好比 <行為1>, <行為2>... (不同種行為)
且未來會持續擴充新的行為
```

```
Force-擴充性:
擴充新的 <行為> 時
不必修改既有的 <Context>
```

```
Problem:
如何讓 Client 能夠簡單地
抽換或是擴充行為
```

### 樣板方法 ( Template Method )

```
Force-重復程式:
這多道行為之間, 有部分重復
```

```
Force-BV:
但這些重復的程式碼中, 又有部分行為是不同的
```

```
Force:
開發同類型行為時, 被迫以撰寫重復程式, 再加以改寫的方式實作
希望能只實作變動之處就好
```

```
Problem:
如何在開發新的類似的 <行為> 時
能只撰寫變動的部分就好了
```

### 責任鏈模式 ( Chain of Responsibility Pattern, CoR )

```
Force-BV (輸入對比型):
在 <操作> 執行時
系統得先解析 <輸入參數> 的類型
每類對應的處理方式不同

好比: <行為1>, <行為2>, ...
且未來會持續擴充新的 <輸入參數> 類型, 及對應的處理方式
```

```
Force-擴充性:
擴充新的 <輸入參數> 類型 or 每類對應的處理方式時
不必修改既有的 <Context>
```

```
Problem:
如何解耦 <Context> 和所有訊息的處理者
以致於能夠有彈性地，在系統中決定要支援哪些訊息的處理
```

### 觀察者模式 ( Observer Pattern )

```
Force-BV (響應式):
於 <Context> 中 <做某件事> 而得到 <某種結果> 後
<多個類別，如 A, B, C> 都需要執行一些行為來響應此事件
好比 <A> 需要做 <響應式行為 A> ...等等
```

```
Force-擴充性:
擴充新的 <觀察者> or <響應式行為> 時
不必修改既有的 <Context>
```

```
Problem:
如何有彈性地, 讓多個物件能持續觀察著某另一物件的最新狀態?
而當狀態改變時, 所有觀察者物件都能立即響應?
```

### 指令模式 ( Command Pattern )

```
Force-行為賦予:
<Context> 有多個操作 (e.g. 操作 1 & 2)，操作 1 & 2 都未定義行為
我們希望能動態設定操作 1 & 2 的行為
設定成對 <Receiver A, B, C> 類別的操作呼叫
好比 設定成當 <操作1> 執行時，要去呼叫 A 的 任務 A 操作
```

```
Force-擴充性:
當擴充新的 <Receiver>，並且想要動態將 <Context> 的某操作
設定成呼叫新的 <Receiver> 的操作時
不必修改 <Context>, 以及既有的 <Receiver>
```

```
Problem:
如何把每一道指令都轉變為一個物件
讓我們能夠將這些指令物件
用有彈性的方式, 挷定在 Application 的各項操作上?
```

### 狀態模式 ( State Pattern )

```
Force-BV (狀態型):
當 <Context> 中處於不同的狀態下, 會引起多道行為的變化
好比 <A>, <B> 兩者狀態下的 <操作1> 的行為不同
以及 <A>, <B>, <C> 三者狀態下的 <操作2> 的行為也不同
(越多例子, 代表變化越強)
```

```
Force-擴充性:
擴充新的 <狀態> 時
不必修改既有的 <Context>
```

```
Problem:
如何設計程式
使工程師能夠專注維護類別，在不同狀態下的個別行為
並允許該類別物件，能隨著狀態的改變，而抽換自身行為?
```
