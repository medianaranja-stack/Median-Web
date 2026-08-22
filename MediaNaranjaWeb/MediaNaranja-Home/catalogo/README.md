# Catálogo Media Naranja Home (medianaranja.store)

Scrapeado de la tienda **Tiendanube** `medianaranja.store` (línea blanquería/home).
Datos extraídos de `LS.variants` (JSON de Tiendanube) + galería de cada ficha.
**20 productos** en **8 categorías** (secciones: Baño, Cocina, Dormitorio). **72 fotos** en alta.

> A diferencia de `medianaranja.com.ar`, esta tienda **sí tiene precios, variantes (talle/color), stock y SKU por variante.**

## Estructura

```
catalogo/
├── catalogo.json          # índice global (todos los productos)
├── catalogo.csv           # tabla resumen (ideal para importar)
├── README.md
└── <categoria>/
    ├── _categoria.json
    └── <producto>/
        ├── producto.json  # ficha completa
        └── img_1.webp ... # fotos en 1024px
```

## Campos de `producto.json`

| Campo | Descripción |
|-------|-------------|
| `nombre`, `handle`, `url` | identificación |
| `seccion` / `categoria` | Baño·Cocina·Dormitorio / subcategoría |
| `descripcion` + `descripcion_html` | texto e HTML original |
| `precio`, `precio_lista`, `precio_transferencia` | precio vigente, tachado y con descuento por transferencia |
| `talles`, `colores` | opciones disponibles |
| `variantes[]` | por variante: `sku`, `talle`, `color`, `precio`, `precio_lista`, `stock`, `disponible`, `image_url` |
| `imagenes[]` | fotos descargadas (`img_N.webp`) + URL original |

## Categorías

| Sección | Categoría | Productos |
|---------|-----------|-----------|
| Baño | Toallas (toallas + toallones) | 9 |
| Baño | Alfombras | 2 |
| Dormitorio | Acolchados | 2 |
| Dormitorio | Cubrecama | 2 |
| Dormitorio | Sábanas | 2 |
| Dormitorio | Frazadas | 1 |
| Dormitorio | Mantas | 1 |
| Cocina | Repasadores | 1 |

## Notas

- **Imágenes:** se bajaron los derivados servibles del CDN (`-1024-1024.webp`). Los originales crudos
  (`/tmp/...jpg`) devuelven **403** por hotlinking; el derivado a 1024px es la máxima resolución pública.
- **4 productos tienen 1 sola foto** (Toalla/Toallón Infinite y Galaxy) — es lo que hay cargado en la tienda,
  no un fallo de scraping.
- Precios y stock son un **snapshot** del momento del scrapeo.
