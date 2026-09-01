-- Seed opcional: los 36 productos de la linea Limpieza. Ejecutar DESPUES de setup.sql.
-- Las imagenes apuntan a /productos/... , o sea archivos del repo, NO a Storage.
-- Despues de correr este seed, entra al panel > Productos y usa el boton
-- "Migrar fotos a Supabase": sube las 93 fotos al bucket y reescribe estas filas.
-- Recien ahi se pueden reemplazar las fotos desde el panel.
insert into public.productos (linea,categoria,categoria_label,nombre,slug,descripcion,specs,imagenes,comprar_url,orden) values
('limpieza','baldes','Baldes','Balde escurridor','balde-escurridor','BALDE CON ESCURRIDOR
Súper resistente · Práctico y cómodo
Con escurridor de mopas
Limpiá sin necesidad de agacharte ni ensuciarte las manos.
CAPACIDAD 16 litros
EAN 7790927819054','{"CODIGO": "81905-406", "DUN14": "17790927819051", "EMPAQUE": "6 unidades"}'::jsonb,'["/productos/limpieza/baldes/balde-escurridor/01.jpg", "/productos/limpieza/baldes/balde-escurridor/02.jpg"]'::jsonb,'https://www.medianaranja.store',0),
('limpieza','cabos','Cabos','Cabo','cabo','CABO METÁLICO RECUBIERTO
Ideal para sujetar mopas y secadores
Práctico gancho de colgar
Posee rosca standard inferior
EAN 7790927815025','{"CODIGO": "81502-412", "MEDIDAS": "120 cm (Standard)", "DUN14": "17790927815029", "EMPAQUE": "12 unidades"}'::jsonb,'["/productos/limpieza/cabos/cabo/01.jpg", "/productos/limpieza/cabos/cabo/02.jpg"]'::jsonb,'https://www.medianaranja.store',1),
('limpieza','franelas','Franelas','Triple Frisado','triple-frisado','FRANELAS
TRIPLE FRISADO
Atrapa mejor la suciedad.
Recomendado para darle brillo a muebles y objetos de cuero.','{"CODIGO": "81324", "MEDIDAS": "45X50cm", "EAN13": "7790927813243", "DUN14": "17790927813240", "EMPAQUE": "Fardos de 50 unidades", "COMPOSICION": "98.5% algodón + 1.5% poliéster"}'::jsonb,'["/productos/limpieza/franelas/triple-frisado/01.jpg", "/productos/limpieza/franelas/triple-frisado/02.jpg"]'::jsonb,'https://www.medianaranja.store',2),
('limpieza','microfibras','Microfibras','1000USOS','1000usos','MICROFIBRAS
1000USOS
Un paño para cada ambiente • Máxima suavidad.
La misma calidad de siempre en un pack económico que contiene 3 microfibras, brindan la capacidad de limpiar sólo con agua y sin dejar pelusa.','{"CODIGO": "81423", "MEDIDAS": "30X30cm (c/u)", "EAN13": "7790927814233", "DUN14": "17790927814230", "EMPAQUE": "Presentación en bolsa de 10 packs.", "COMPOSICION": "80% poliéster + 20% algodón"}'::jsonb,'["/productos/limpieza/microfibras/1000usos/01.jpg", "/productos/limpieza/microfibras/1000usos/02.jpg", "/productos/limpieza/microfibras/1000usos/03.jpg"]'::jsonb,'https://www.medianaranja.store',3),
('limpieza','microfibras','Microfibras','Lava Autos','lava-autos','MICROFIBRAS
LAVA AUTOS
Super absorbente • Ultra resistente • No raya • No deja vetas
Ideal para el lavado y secado de la carrocería de tu auto. Gracias a su exclusiva composición remueve la suciedad y absorbe, dejando tu auto limpio con menos esfuerzo y sin dejar marcas.','{"CODIGO": "81422", "MEDIDAS": "50X60cm", "EAN13": "7790927814226", "DUN14": "17790927814223", "EMPAQUE": "Cajas de 10 unidades", "COMPOSICION": "80% poliéster + 20% poliamida"}'::jsonb,'["/productos/limpieza/microfibras/lava-autos/01.jpg", "/productos/limpieza/microfibras/lava-autos/02.jpg"]'::jsonb,'https://www.medianaranja.store',4),
('limpieza','microfibras','Microfibras','Lustradora','lustradora','MICROFIBRAS
LUSTRADORA
No raya • No deja vetas
Deja tus superficies de madera más brillantes sin esfuerzo. La microfibra atrapa las partículas de una sola pasada, haciendo la limpieza más fácil.','{"CODIGO": "914060", "MEDIDAS": "40X40cm", "EAN13": "7798136921438", "DUN14": "37798136921439", "EMPAQUE": "Cajas de 10 unidades", "COMPOSICION": "80% poliéster + 20% poliamida"}'::jsonb,'["/productos/limpieza/microfibras/lustradora/01.jpg", "/productos/limpieza/microfibras/lustradora/02.jpg"]'::jsonb,'https://www.medianaranja.store',5),
('limpieza','microfibras','Microfibras','Multiuso','multiuso','MICROFIBRAS
MULTIUSO
Super absorbente •  No acumula olores •  Ultra resistente.
Imprescindible para tener siempre a mano tanto en la cocina como en el baño. Remueve la suciedad sólo con agua y es super absorbente.','{"CODIGO": "81417", "MEDIDAS": "35X40cm", "EAN13": "7790927814172", "DUN14": "17790927814179", "EMPAQUE": "Cajas de 10 unidades", "COMPOSICION": "80% poliéster + 20% poliamida"}'::jsonb,'["/productos/limpieza/microfibras/multiuso/01.jpg", "/productos/limpieza/microfibras/multiuso/02.jpg", "/productos/limpieza/microfibras/multiuso/03.jpg"]'::jsonb,'https://www.medianaranja.store',6),
('limpieza','microfibras','Microfibras','Pisos','pisos','MICROFIBRAS
PISOS
No deja rastros • No acumula olores • Ultra resistente
Todas las virtudes de la microfibra en un tamaño ideal para limpiar el piso. Absorbe el agua de una sola pasada y remueve las manchas fácilmente.','{"CODIGO": "81421", "MEDIDAS": "48X60cm", "EAN13": "7790927814219", "DUN14": "17790927814216", "EMPAQUE": "Cajas de 5 unidades", "COMPOSICION": "80% poliéster + 20% poliamida."}'::jsonb,'["/productos/limpieza/microfibras/pisos/01.jpg", "/productos/limpieza/microfibras/pisos/02.jpg"]'::jsonb,'https://www.medianaranja.store',7),
('limpieza','microfibras','Microfibras','Tecnológica','tecnologica','MICROFIBRAS
TECNOLÓGICA
Mayor cuidado • No raya • Ultra resistente
Ideal para la limpieza en seco de todo tipo de productos tecnológicos. La microfibra atrae las partículas por estática, sin rayar ni dejar vetas en las superficies..','{"CODIGO": "81419", "MEDIDAS": "25X35cm", "EAN13": "7790927814196", "DUN14": "17790927814193", "EMPAQUE": "Cajas de 10 unidades", "COMPOSICION": "80% poliéster + 20% poliamida"}'::jsonb,'["/productos/limpieza/microfibras/tecnologica/01.jpg", "/productos/limpieza/microfibras/tecnologica/02.jpg", "/productos/limpieza/microfibras/tecnologica/03.jpg"]'::jsonb,'https://www.medianaranja.store',8),
('limpieza','microfibras','Microfibras','Vidrios','vidrios','MICROFIBRAS
VIDRIOS
Ultra resistente • Sin Vetas • Sin esfuerzos • No raya
Ideal para la limpieza de vidrios y superficies espejadas. La microfibra atrapa las partículas sin rayar ni dejar vetas.','{"CODIGO": "81416", "MEDIDAS": "40X40cm", "EAN13": "7790927814165", "DUN14": "17790927814162", "EMPAQUE": "Cajas de 10 unidades", "COMPOSICION": "80% poliéster + 20% poliamida"}'::jsonb,'["/productos/limpieza/microfibras/vidrios/01.jpg", "/productos/limpieza/microfibras/vidrios/02.jpg"]'::jsonb,'https://www.medianaranja.store',9),
('limpieza','mopas','Mopas','Algodón Blanca','algodon-blanca','MOPAS
ALGODÓN BLANCO
Fácil de usar • Ultra resistente •  Puro algodón
Limpia hasta los rincones más difíciles sin la necesidad de agacharte ni ensuciarte las manos.','{"CODIGO": "381902-212", "MEDIDAS": "23cm", "EAN13": "7798136921476", "DUN14": "37798136921477", "EMPAQUE": "12 unidades", "COMPOSICION": "100 % algodón"}'::jsonb,'["/productos/limpieza/mopas/algodon-blanca/01.jpg", "/productos/limpieza/mopas/algodon-blanca/02.jpg", "/productos/limpieza/mopas/algodon-blanca/03.jpg"]'::jsonb,'https://www.medianaranja.store',10),
('limpieza','mopas','Mopas','Blanca Microfibra','blanca-microfibra','MOPAS
MICROFIBRA
Fácil de usar • Ultra resistente
Limpia sin esfuerzos hasta los rincones más difíciles sin la necesidad de agacharte ni ensuciarte las manos.','{"CODIGO": "381903-212", "MEDIDAS": "23cm", "EAN13": "7798136921377", "DUN14": "17798136921374", "EMPAQUE": "12 unidades", "COMPOSICION": "Microfibra blanca"}'::jsonb,'["/productos/limpieza/mopas/blanca-microfibra/01.jpg"]'::jsonb,'https://www.medianaranja.store',11),
('limpieza','panos-amarillos','Paños Amarillos','Pisos','pisos','PAÑOS AMARILLOS
PISOS
Super absorbente • Resistente • No deja pelusa.
Ideal para pisos y grandes superficies. Lavable en el lavarropas.','{"CODIGO": "81714", "MEDIDAS": "50X57cm", "EAN13": "7790927817142", "DUN14": "1779092787149", "EMPAQUE": "Caja de 18 unidades", "COMPOSICION": "70% viscosa + 20% polipropileno + 10% poliéster"}'::jsonb,'["/productos/limpieza/panos-amarillos/pisos/01.jpg", "/productos/limpieza/panos-amarillos/pisos/02.jpg"]'::jsonb,'https://www.medianaranja.store',12),
('limpieza','panos-amarillos','Paños Amarillos','x1','x1','PAÑOS AMARILLOS
PAÑO x1
Resistente • Abosbente • No deja pelusa.
Ideal para la cocina y ambientes donde se utiliza mucha agua. Lavable en lavarropas.','{"CODIGO": "81712", "MEDIDAS": "38X40cm", "EAN13": "7790927817128", "DUN14": "17790927817125", "EMPAQUE": "Cajas de 30 unidades", "COMPOSICION": "70% viscosa + 20% prolipropileno + 10% poliéster"}'::jsonb,'["/productos/limpieza/panos-amarillos/x1/01.jpg", "/productos/limpieza/panos-amarillos/x1/02.jpg", "/productos/limpieza/panos-amarillos/x1/03.jpg"]'::jsonb,'https://www.medianaranja.store',13),
('limpieza','panos-amarillos','Paños Amarillos','x3','x3','PAÑOS AMARILLOS
PAÑOS x3
Resistente • Absorbente • No deja pelusa
Ideal para cocina y ambientes donde se utiliza mucha agua. Lavable en lavarropas.','{"CODIGO": "81713", "MEDIDAS": "38X40cm", "EAN13": "7790927817135", "DUN14": "717790927817132", "EMPAQUE": "Cajas de 12 unidades", "COMPOSICION": "70% viscosa + 20% polipropileno + 10% poliéster"}'::jsonb,'["/productos/limpieza/panos-amarillos/x3/01.jpg", "/productos/limpieza/panos-amarillos/x3/02.jpg", "/productos/limpieza/panos-amarillos/x3/03.jpg"]'::jsonb,'https://www.medianaranja.store',14),
('limpieza','rejillas','Rejillas','Americana','americana','REJILLAS
AMERICANA
Tejido liviano.
Fácil de secar y escurrir. Ideal para superficies pequeñas y rincones difíciles.','{"CODIGO": "81116", "MEDIDAS": "40X40cm", "EAN13": "7790927811164", "DUN14": "17790927811161", "EMPAQUE": "Fardos de 50 unidades", "COMPOSICION": "100% algodón"}'::jsonb,'["/productos/limpieza/rejillas/americana/01.jpg", "/productos/limpieza/rejillas/americana/02.jpg", "/productos/limpieza/rejillas/americana/03.jpg"]'::jsonb,'https://www.medianaranja.store',15),
('limpieza','rejillas','Rejillas','Doble Reforzada','doble-reforzada','REJILLAS
DOBLE REFORZADA
Ultra resistente
Dura más porque tiene sus bordes y centros reforzados. Ideal para uso diario.','{"CODIGO": "81114", "MEDIDAS": "40X45cm", "EAN13": "7790927811140", "DUN14": "17790927811147", "EMPAQUE": "Fardos de 50 unidades", "COMPOSICION": "100% algodón"}'::jsonb,'["/productos/limpieza/rejillas/doble-reforzada/01.jpg", "/productos/limpieza/rejillas/doble-reforzada/02.jpg", "/productos/limpieza/rejillas/doble-reforzada/03.jpg"]'::jsonb,'https://www.medianaranja.store',16),
('limpieza','rejillas','Rejillas','Lavacoche','lavacoche','REJILLAS
LAVACOCHE
Especial autos • Extra suave.
Absorbe más y seca sin dejar rayas.','{"CODIGO": "81603", "MEDIDAS": "42X58cm", "EAN13": "7790927816039", "DUN14": "17790927816036", "EMPAQUE": "Fardos de 50 unidades", "COMPOSICION": "100% algodón"}'::jsonb,'["/productos/limpieza/rejillas/lavacoche/01.jpg", "/productos/limpieza/rejillas/lavacoche/02.jpg", "/productos/limpieza/rejillas/lavacoche/03.jpg"]'::jsonb,'https://www.medianaranja.store',17),
('limpieza','rejillas','Rejillas','Multiuso','multiuso','REJILLAS
MULTIUSO
Super absorbente • Resistente a la lavandina.
Ideal para todo tipo de ambientes.','{"CODIGO": "81100", "MEDIDAS": "40X45cm", "EAN13": "7790927811003", "DUN14": "17790927811000", "EMPAQUE": "Fardos de 50 unidades", "COMPOSICION": "100% algodón"}'::jsonb,'["/productos/limpieza/rejillas/multiuso/01.jpg", "/productos/limpieza/rejillas/multiuso/02.jpg", "/productos/limpieza/rejillas/multiuso/03.jpg"]'::jsonb,'https://www.medianaranja.store',18),
('limpieza','repasadores','Repasadores','Microfibra','microfibra','REPASADORES
MICROFIBRA
Super absorbente • Ultra resistente • Liviano • No deja vetas
Diseñado especialmente para el cuidado de tu cocina.','{"CODIGO": "81409", "MEDIDAS": "37X60cm", "EAN13": "7790927814097", "DUN14": "17790927814094", "EMPAQUE": "Cajas de 30 unidades en 2 colores", "COMPOSICION": "80% poliéster + 20% poliamida"}'::jsonb,'["/productos/limpieza/repasadores/microfibra/01.jpg", "/productos/limpieza/repasadores/microfibra/02.jpg"]'::jsonb,'https://www.medianaranja.store',19),
('limpieza','secadores','Secadores','Doble Goma Grande','doble-goma-grande','SECADORES DE PISO
DOBLE GOMA GRANDE
Mayor calidad  • Facilidad de uso.
Su doble goma y detalle lateral hace que necesites menos pasadas para realizar la limpieza.','{"CODIGO": "81501-412", "MEDIDAS": "41cm", "EAN13": "7790927815018", "DUN14": "17790927815015", "EMPAQUE": "Cajas de 12 unidades (3 colores surtidos)", "COMPOSICION": "Doble goma"}'::jsonb,'["/productos/limpieza/secadores/doble-goma-grande/01.jpg", "/productos/limpieza/secadores/doble-goma-grande/02.jpg"]'::jsonb,'https://www.medianaranja.store',20),
('limpieza','secadores','Secadores','Doble Goma Mediano','doble-goma-mediano','SECADORES DE PISO
DOBLE GOMA MEDIANO
Mayor calidad  • Facilidad de uso.
Su doble goma y detalle lateral hace que necesites menos pasadas para realizar la limpieza.','{"CODIGO": "81500-412", "MEDIDAS": "35cm", "EAN13": "7790927815001", "DUN14": "17790927815008", "EMPAQUE": "Cajas de 12 unidades (3 colores surtidos)", "COMPOSICION": "Doble goma"}'::jsonb,'["/productos/limpieza/secadores/doble-goma-mediano/01.jpg", "/productos/limpieza/secadores/doble-goma-mediano/02.jpg"]'::jsonb,'https://www.medianaranja.store',21),
('limpieza','trapos-de-piso','Trapos de Piso','Compacto blanco Grande','compacto-blanco-grande','TRAPOS DE PISO
COMPACTO BLANCO GRANDE
Super absorbente • Liviano
Se escurre sin esfuerzo.','{"CODIGO": "382602-250", "MEDIDAS": "58X60cm", "EAN13": "7798136921766", "DUN14": "57798136921761", "EMPAQUE": "Fardos de 50 unidades.", "COMPOSICION": "100% algodón"}'::jsonb,'["/productos/limpieza/trapos-de-piso/compacto-blanco-grande/01.jpg", "/productos/limpieza/trapos-de-piso/compacto-blanco-grande/02.jpg"]'::jsonb,'https://www.medianaranja.store',22),
('limpieza','trapos-de-piso','Trapos de Piso','Compacto blanco Mediano','compacto-blanco-mediano','TRAPOS DE PISO
COMPACTO BLANCO MEDIANO
Super absorbente • Liviano
Se escurre sin esfuerzo.','{"CODIGO": "382601-250", "MEDIDAS": "50X60cm", "EAN13": "7798136921759", "DUN14": "57798136921754", "EMPAQUE": "Fardos de 50 unidades.", "COMPOSICION": "100% algodón"}'::jsonb,'["/productos/limpieza/trapos-de-piso/compacto-blanco-mediano/01.jpg", "/productos/limpieza/trapos-de-piso/compacto-blanco-mediano/02.jpg", "/productos/limpieza/trapos-de-piso/compacto-blanco-mediano/03.jpg"]'::jsonb,'https://www.medianaranja.store',23),
('limpieza','trapos-de-piso','Trapos de Piso','Compacto Gris Grande','compacto-gris-grande','TRAPOS DE PISO
COMPACTO GRIS GRANDE
Super absorbente • Liviano
Se escurre sin esfuerzo.','{"CODIGO": "382602-150", "MEDIDAS": "58X60cm", "EAN13": "7798136921742", "DUN14": "57798136921747", "EMPAQUE": "Fardos de 50 unidades.", "COMPOSICION": "100% algodón"}'::jsonb,'["/productos/limpieza/trapos-de-piso/compacto-gris-grande/01.jpg", "/productos/limpieza/trapos-de-piso/compacto-gris-grande/02.jpg"]'::jsonb,'https://www.medianaranja.store',24),
('limpieza','trapos-de-piso','Trapos de Piso','Compacto Gris Mediano','compacto-gris-mediano','TRAPOS DE PISO
COMPACTO GRIS MEDIANO
Super absorbente • Liviano
Se escurre sin esfuerzo.','{"CODIGO": "382601-150", "MEDIDAS": "50X60cm", "EAN13": "7798136921735", "DUN14": "57798136921730", "EMPAQUE": "Fardos de 50 unidades.", "COMPOSICION": "100% algodón"}'::jsonb,'["/productos/limpieza/trapos-de-piso/compacto-gris-mediano/01.jpg", "/productos/limpieza/trapos-de-piso/compacto-gris-mediano/02.jpg", "/productos/limpieza/trapos-de-piso/compacto-gris-mediano/03.jpg"]'::jsonb,'https://www.medianaranja.store',25),
('limpieza','trapos-de-piso','Trapos de Piso','Doble Reforzado Bicolor Grande','doble-reforzado-bicolor-grande','TRAPOS DE PISO
DOBLE REFORZADO BICOLOR GRANDE
Super absorbente • Ultra resistente
Dura más porque trae un exclusivo refuerzo central en la zona más expuesta al desgaste.','{"CODIGO": "81297", "MEDIDAS": "58X60cm (Profesional)", "EAN13": "7790927812970", "DUN14": "17790927812977", "EMPAQUE": "Fardos de 50 unidades", "COMPOSICION": "97,4% algodón + 2,6% poliéster"}'::jsonb,'["/productos/limpieza/trapos-de-piso/doble-reforzado-bicolor-grande/01.jpg", "/productos/limpieza/trapos-de-piso/doble-reforzado-bicolor-grande/02.jpg", "/productos/limpieza/trapos-de-piso/doble-reforzado-bicolor-grande/03.jpg"]'::jsonb,'https://www.medianaranja.store',26),
('limpieza','trapos-de-piso','Trapos de Piso','Doble Reforzado Bicolor Mediano','doble-reforzado-bicolor-mediano','TRAPOS DE PISO
DOBLE REFORZADO BICOLOR MEDIANO
Super absorbente • Ultra resistente
Dura más porque trae un exclusivo refuerzo central en la zona más expuesta al desgaste.','{"CODIGO": "81296", "MEDIDAS": "48X60cm (Clásico)", "EAN13": "7790927812963", "DUN14": "17790927812960", "EMPAQUE": "Fardos de 50 unidades", "COMPOSICION": "97,4% algodón + 2,6% poliéster"}'::jsonb,'["/productos/limpieza/trapos-de-piso/doble-reforzado-bicolor-mediano/01.jpg", "/productos/limpieza/trapos-de-piso/doble-reforzado-bicolor-mediano/02.jpg", "/productos/limpieza/trapos-de-piso/doble-reforzado-bicolor-mediano/03.jpg"]'::jsonb,'https://www.medianaranja.store',27),
('limpieza','trapos-de-piso','Trapos de Piso','Doble Reforzado Blanco Extra Grande','doble-reforzado-blanco-extra-grande','TRAPOS DE PISO
DOBLE REFORZADO BLANCO EXTRA GRANDE
Super absorbente • Livano • Se escurre sin esfuerzo.
El más grande del mercado. Dura más porque trae un exclusivo refuerzo central en la zona más expuesta al desgaste.','{"CODIGO": "81295", "MEDIDAS": "60X80cm (Consorcio)", "EAN13": "7790927812956", "DUN14": "17790927812953", "EMPAQUE": "Fardos de 50 unidades", "COMPOSICION": "97,4% algodón + 2,6% poliéster"}'::jsonb,'["/productos/limpieza/trapos-de-piso/doble-reforzado-blanco-extra-grande/01.jpg", "/productos/limpieza/trapos-de-piso/doble-reforzado-blanco-extra-grande/02.jpg", "/productos/limpieza/trapos-de-piso/doble-reforzado-blanco-extra-grande/03.jpg"]'::jsonb,'https://www.medianaranja.store',28),
('limpieza','trapos-de-piso','Trapos de Piso','Doble Reforzado Blanco Grande','doble-reforzado-blanco-grande','TRAPOS DE PISO
DOBLE REFORZADO BLANCO GRANDE
Super absorbente • Livano • Se escurre sin esfuerzo.
Dura más porque trae un exclusivo refuerzo central en la zona más expuesta al desgaste.','{"CODIGO": "81295", "MEDIDAS": "58X60cm (Profesional)", "EAN13": "7790927812949", "DUN14": "17790927812946", "EMPAQUE": "Fardos de 50 unidades", "COMPOSICION": "97,4% algodón + 2,6% poliéster"}'::jsonb,'["/productos/limpieza/trapos-de-piso/doble-reforzado-blanco-grande/01.jpg", "/productos/limpieza/trapos-de-piso/doble-reforzado-blanco-grande/02.jpg", "/productos/limpieza/trapos-de-piso/doble-reforzado-blanco-grande/03.jpg"]'::jsonb,'https://www.medianaranja.store',29),
('limpieza','trapos-de-piso','Trapos de Piso','Doble Reforzado Blanco Mediano','doble-reforzado-blanco-mediano','TRAPOS DE PISO
DOBLE REFORZADO BLANCO MEDIANO
Super absorbente • Livano • Se escurre sin esfuerzo.
Dura más porque trae un exclusivo refuerzo central en la zona más expuesta al desgaste.','{"CODIGO": "81293", "MEDIDAS": "48X60cm (Clásico)", "EAN13": "7790927812932", "DUN14": "17790927812939", "EMPAQUE": "Fardos de 50 unidades", "COMPOSICION": "97,4% algodón + 2,6 % poliéster"}'::jsonb,'["/productos/limpieza/trapos-de-piso/doble-reforzado-blanco-mediano/01.jpg", "/productos/limpieza/trapos-de-piso/doble-reforzado-blanco-mediano/02.jpg", "/productos/limpieza/trapos-de-piso/doble-reforzado-blanco-mediano/03.jpg"]'::jsonb,'https://www.medianaranja.store',30),
('limpieza','trapos-de-piso','Trapos de Piso','Doble Reforzado Gris Extra Grande','doble-reforzado-gris-extra-grande','TRAPOS DE PISO
DOBLE REFORZADO GRIS EXTRA GRANDE
Super absorbente • Ultra resistente.
El más grande del mercado. Dura más porque trae un exclusivo refuerzo central en la zona más expuesta al desgaste.','{"CODIGO": "81292", "MEDIDAS": "60X80cm (Consorcio)", "EAN13": "7790927812925", "DUN14": "17790927812922", "EMPAQUE": "Fardos de 50 unidades", "COMPOSICION": "97,4% algodón + 2,6% poliéster"}'::jsonb,'["/productos/limpieza/trapos-de-piso/doble-reforzado-gris-extra-grande/01.jpg", "/productos/limpieza/trapos-de-piso/doble-reforzado-gris-extra-grande/02.jpg", "/productos/limpieza/trapos-de-piso/doble-reforzado-gris-extra-grande/03.jpg"]'::jsonb,'https://www.medianaranja.store',31),
('limpieza','trapos-de-piso','Trapos de Piso','Doble Reforzado Gris Grande','doble-reforzado-gris-grande','TRAPOS DE PISO
DOBLE REFORZADO GRIS GRANDE
Super absorbente • Ultra resistente
Dura más porque trae un exclusivo refuerzo central en la zona más expuesta al desgaste.','{"CODIGO": "81291", "MEDIDAS": "58X60cm (Profesional)", "EAN13": "7790927812918", "DUN14": "17790927812915", "EMPAQUE": "Fardos de 50 unidades", "COMPOSICION": "97,4% algodón + 2,6% poliéster"}'::jsonb,'["/productos/limpieza/trapos-de-piso/doble-reforzado-gris-grande/01.jpg", "/productos/limpieza/trapos-de-piso/doble-reforzado-gris-grande/02.jpg", "/productos/limpieza/trapos-de-piso/doble-reforzado-gris-grande/03.jpg"]'::jsonb,'https://www.medianaranja.store',32),
('limpieza','trapos-de-piso','Trapos de Piso','Doble Reforzado Gris Mediano','doble-reforzado-gris-mediano','TRAPOS DE PISO
DOBLE REFORZADO GRIS MEDIANO
Super absorbente • Ultra resistente
Dura más porque trae un exclusivo refuerzo central en la zona más expuesta al desgaste.','{"CODIGO": "81290", "MEDIDAS": "48X60cm (Clásico)", "EAN13": "7790927812901", "DUN14": "17790927812908", "EMPAQUE": "Fardos de 50 unidades", "COMPOSICION": "97,4% algodón + 2,6% poliéster"}'::jsonb,'["/productos/limpieza/trapos-de-piso/doble-reforzado-gris-mediano/01.jpg", "/productos/limpieza/trapos-de-piso/doble-reforzado-gris-mediano/02.jpg", "/productos/limpieza/trapos-de-piso/doble-reforzado-gris-mediano/03.jpg"]'::jsonb,'https://www.medianaranja.store',33),
('limpieza','trapos-de-piso','Trapos de Piso','Doble Reforzado Multicolor Grande','doble-reforzado-multicolor-grande','TRAPOS DE PISO
DOBLE REFORZADO MULTICOLOR GRANDE
Super absorbente • Ultra resistente
Dura más porque trae un exclusivo refuerzo central en la zona más expuesta al desgaste.','{"CODIGO": "81299", "MEDIDAS": "58X60cm (Profesional)", "EAN13": "7790927812994", "DUN14": "17790927812991", "EMPAQUE": "Fardos de 50 unidades", "COMPOSICION": "97,4% algodón + 2,6% poliéster"}'::jsonb,'["/productos/limpieza/trapos-de-piso/doble-reforzado-multicolor-grande/01.jpg", "/productos/limpieza/trapos-de-piso/doble-reforzado-multicolor-grande/02.jpg", "/productos/limpieza/trapos-de-piso/doble-reforzado-multicolor-grande/03.jpg"]'::jsonb,'https://www.medianaranja.store',34),
('limpieza','trapos-de-piso','Trapos de Piso','Doble Reforzado Multicolor Mediano','doble-reforzado-multicolor-mediano','TRAPOS DE PISO
DOBLE REFORZADO MULTICOLOR MEDIANO
Super absorbente • Ultra resistente
Dura más porque trae un exclusivo refuerzo central en la zona más expuesta al desgaste.','{"CODIGO": "81298", "MEDIDAS": "48X60cm (Clásico)", "EAN13": "7790927812987", "DUN14": "17790927812984", "EMPAQUE": "Fardos de 50 unidades", "COMPOSICION": "97,4% algodón + 2,6% poliéster"}'::jsonb,'["/productos/limpieza/trapos-de-piso/doble-reforzado-multicolor-mediano/01.jpg", "/productos/limpieza/trapos-de-piso/doble-reforzado-multicolor-mediano/02.jpg", "/productos/limpieza/trapos-de-piso/doble-reforzado-multicolor-mediano/03.jpg"]'::jsonb,'https://www.medianaranja.store',35)
on conflict do nothing;
