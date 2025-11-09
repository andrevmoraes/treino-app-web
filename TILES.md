# Sistema de Tiles - Windows Phone Style

## Tamanhos Disponíveis

O sistema suporta 4 tamanhos de tiles, exatamente como no Windows Phone:

### `small` - 1x1 pequeno
- Grid: `col-span-1 row-span-1`
- Aspecto: Quadrado
- Uso: Ícones, ações rápidas

### `medium` - 1x1 médio (padrão)
- Grid: `col-span-1 row-span-1`  
- Aspecto: Quadrado
- Uso: Apps principais (padrão atual dos treinos)

### `wide` - 2x1 largo
- Grid: `col-span-2 row-span-1`
- Aspecto: Retangular horizontal
- Uso: Destaque, informações amplas

### `large` - 2x2 grande
- Grid: `col-span-2 row-span-2`
- Aspecto: Quadrado grande
- Uso: Widgets, dashboards

## Como Adicionar Novos Tiles

No arquivo `app/home/page.tsx`, edite o array `tiles`:

```typescript
const tiles: TileConfig[] = [
  {
    id: 'meu-tile',
    title: 'Título',
    subtitle: 'Subtítulo',
    size: 'medium', // ou 'small', 'wide', 'large'
    color: METRO_COLORS.blue, // ou cyan, red, green, purple, orange
    href: '/minha-rota',
  },
  // ... mais tiles
];
```

## Layout Atual

```
┌─────────┬─────────┐
│ Costas  │ Ombros  │
│ (1x1)   │ (1x1)   │
├─────────┴─────────┤
│ Peito (2x1 wide)  │
├─────────┬─────────┤
│ Pernas  │         │
│ (1x1)   │         │
└─────────┴─────────┘
```

## Exemplo de Layout Alternativo

```typescript
const tiles: TileConfig[] = [
  { id: 'destaque', title: 'Dashboard', subtitle: 'Principal', size: 'large', color: METRO_COLORS.blue, href: '/dashboard' },
  { id: 'treino-a', title: 'Costas', subtitle: 'A', size: 'medium', color: METRO_COLORS.cyan, href: '/treino-a' },
  { id: 'treino-b', title: 'Ombros', subtitle: 'B', size: 'medium', color: METRO_COLORS.red, href: '/treino-b' },
  { id: 'stats', title: 'Estatísticas', subtitle: 'Ver mais', size: 'wide', color: METRO_COLORS.green, href: '/stats' },
  { id: 'config', title: 'Config', subtitle: '', size: 'small', color: METRO_COLORS.purple, href: '/config' },
];
```

Resultaria em:

```
┌─────────────┬─────┬─────┐
│             │     │     │
│  Dashboard  │ A   │ B   │
│   (2x2)     │     │     │
│             ├─────┴─────┤
│             │ Stats 2x1 │
├─────────────┼───────────┤
│ Config      │           │
│ (1x1)       │           │
└─────────────┴───────────┘
```

## Cores Disponíveis

- `METRO_COLORS.blue` - #0078D7
- `METRO_COLORS.cyan` - #00B7C3
- `METRO_COLORS.red` - #E81123
- `METRO_COLORS.green` - #107C10
- `METRO_COLORS.purple` - #8E3EA1
- `METRO_COLORS.orange` - #FF8C00
- `METRO_COLORS.darkBlue` - #0063B1
- `METRO_COLORS.darkCyan` - #008272

## Grid Responsivo

- **Mobile**: `grid-cols-2` (2 colunas)
- **Desktop**: `md:grid-cols-4` (4 colunas)

Altura mínima dos tiles: `140px`
