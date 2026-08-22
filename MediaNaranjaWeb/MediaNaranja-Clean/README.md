# Catálogo Media Naranja

Scrapeado de `medianaranja.com.ar` vía la Store API de WooCommerce (datos limpios, no HTML parseado).
**36 productos** en **10 categorías**. Listo para migrar a la nueva web.

## Estructura

```
catalogo/
├── catalogo.json          # índice global con TODOS los productos
├── catalogo.csv           # mismo dato en tabla (ideal para importar)
├── README.md
└── <categoria>/
    ├── _categoria.json     # productos de esa categoría
    └── <producto>/
        ├── producto.json   # ficha completa del producto
        └── img_1.jpg ...   # imágenes descargadas
```

## Campos de cada `producto.json`

| Campo | Descripción |
|-------|-------------|
| `id` | ID interno WooCommerce |
| `nombre`, `slug`, `categoria` | identificación |
| `sku` / `specs.CODIGO` | código de producto |
| `descripcion` | copy comercial (tagline + beneficios) |
| `specs` | CODIGO, MEDIDAS, EAN13, DUN14, EMPAQUE, COMPOSICION |
| `imagenes` | imagen principal descargada + URL original + alt |
| `fichas_tecnicas` | gráficas/fichas descargables (`ficha_N.jpg`) bajadas localmente |
| `imagenes_embebidas` | URLs crudas embebidas en la descripción original |
| `permalink` | URL del producto en el sitio viejo |
| `descripcion_html_original` | HTML crudo por si se necesita reprocesar |

## Categorías

| Categoría | Productos |
|-----------|-----------|
| Trapos de piso | 14 |
| Microfibras | 7 |
| Rejillas | 4 |
| Paños amarillos | 3 |
| Mopas | 2 |
| Secadores | 2 |
| Baldes | 1 |
| Cabos | 1 |
| Franelas | 1 |
| Repasadores | 1 |

## Notas

- Los **precios vienen en 0** (el sitio actual es catálogo institucional, no tienda con precios).
- Se descargó la imagen principal de cada producto + **56 fichas técnicas/gráficas** (`ficha_N.jpg`).
  Total: **93 archivos, ~66 MB**.
- **3 fichas dieron 404** (links rotos en el sitio viejo, irrecuperables desde ahí):
  `mopas/algodon-blanca`, `paños-amarillos/pisos`, `repasadores/microfibra` — perdieron 1 ficha extra cada uno.
  `mopas/blanca-microfibra` no tenía fichas adicionales.
