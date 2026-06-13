# 軟體設計模式

## 目錄

- `example-1` - OOP 技法一：依賴

## 執行

OOP 技法一：依賴
```bash
pnpm exec tsx example-1/src/index.ts
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
