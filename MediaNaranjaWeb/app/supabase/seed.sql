-- Seed opcional: los 56 productos scrapeados. Ejecutar DESPUES de schema.sql.
-- Las imagenes apuntan a /productos/... (assets incluidos en el deploy de Netlify).
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
Dura más porque trae un exclusivo refuerzo central en la zona más expuesta al desgaste.','{"CODIGO": "81298", "MEDIDAS": "48X60cm (Clásico)", "EAN13": "7790927812987", "DUN14": "17790927812984", "EMPAQUE": "Fardos de 50 unidades", "COMPOSICION": "97,4% algodón + 2,6% poliéster"}'::jsonb,'["/productos/limpieza/trapos-de-piso/doble-reforzado-multicolor-mediano/01.jpg", "/productos/limpieza/trapos-de-piso/doble-reforzado-multicolor-mediano/02.jpg", "/productos/limpieza/trapos-de-piso/doble-reforzado-multicolor-mediano/03.jpg"]'::jsonb,'https://www.medianaranja.store',35),
('hogar','alfombras','Alfombras','Alfombra Band (50x90cm) - Línea Essentials','alfombra-band-50x90cm-linea-essentials','Alfombra Band
línea Essentials
Alfombra de baño. Renová tu hogar con nuestra alfombra Lines confeccionada 100% en microfibra, de alta calidad. Su diseño mullido y base antideslizante la convierten en el complemento ideal para el confort y seguridad de tu baño.
→ Textil súper absorbente
→ Base antideslizante
→ Suave, mullida y resistente
Una alfombra que merece ser tu Media Naranja ?
- Fotos illustrativas -','{"talles": "Único: 50x90cm", "colores": "Blanco, Gris, Visón"}'::jsonb,'["/productos/hogar/alfombras/alfombra-band-50x90cm-linea-essentials/01.webp", "/productos/hogar/alfombras/alfombra-band-50x90cm-linea-essentials/02.webp", "/productos/hogar/alfombras/alfombra-band-50x90cm-linea-essentials/03.webp", "/productos/hogar/alfombras/alfombra-band-50x90cm-linea-essentials/04.webp"]'::jsonb,'https://www.medianaranja.store/productos/alfombra-band-50x90cm-linea-essentials/',36),
('hogar','alfombras','Alfombras','Alfombra Lines (40x60cm) - Línea Essentials','alfombra-lines-40x60cm-linea-essentials','Alfombra Lines
línea Essentials
Alfombra de baño rayada. Renová tu hogar con nuestra alfombra Lines confeccionada en chenille, de estilo bicolor. Su diseño mullido y base antideslizante la convierten en el complemento ideal para el confort y seguridad de tu baño.
→ Textil absorbente
→ Base antideslizante
→ Suave, mullida y resistente
Una alfombra que merece ser tu Media Naranja ?
- Fotos illustrativas -','{"talles": "Único: 40x60cm", "colores": "Gris claro, Gris oscuro, Lila"}'::jsonb,'["/productos/hogar/alfombras/alfombra-lines-40x60cm-linea-essentials/01.webp", "/productos/hogar/alfombras/alfombra-lines-40x60cm-linea-essentials/02.webp", "/productos/hogar/alfombras/alfombra-lines-40x60cm-linea-essentials/03.webp", "/productos/hogar/alfombras/alfombra-lines-40x60cm-linea-essentials/04.webp"]'::jsonb,'https://www.medianaranja.store/productos/alfombra-lines-40x60cm-linea-essentials/',37),
('hogar','toallas','Toallas y Toallones','Toallón Infinite 500 gr/m²- Línea Excellence','toallon-infinite-500-gr-m-linea-excellence-q60ct','Toallón Infinite 500 gr/m²
línea Excellence
Los toallones de baño Infinite se destacan por su mayor cuerpo de absorbcion.
Confeccionados con 100% algodón y un gramaje de 500 GR/M2. Brindan un equilibrio ideal entre confort, suavidad y rendimiento.
Medida: 70 x 140cm.
¡Complementalo con la Toalla Infinite!
→ Mas cuerpo, mas confort.
→ Confección de 500 gr/m² - 100% algodón.
→ Suavidad extra en cada contacto.
Un toallón que merece ser tu Media Naranja ?
- Fotos illustrativas -
Hilado Ringspun: calidad asegurada (proceso especial de hilar Algodón)
- Mayor resistencia: duran más y se desgastan menos.
- Textura extra suave: delicadeza al tacto, sin imperfecciones.
- Absorción superior: fibras más compactas que retienen mejor la humedad.
Algodón 100% Real: lujo auténtico
- Absorción máxima: captura y retiene la humedad con eficacia.
- Suavidad absoluta: confort asegurado en cada contacto.
- Durabilidad superior: más firmeza y resistencia para acompañarte por años.','{"talles": "Toallón: 70 x 140cm", "colores": "Azul, Blanco, Bordó, Tormenta"}'::jsonb,'["/productos/hogar/toallas/toallon-infinite-500-gr-m-linea-excellence-q60ct/01.webp"]'::jsonb,'https://www.medianaranja.store/productos/toallon-infinite-500-gr-m-linea-excellence-q60ct/',38),
('hogar','toallas','Toallas y Toallones','Toalla Infinite 500 gr/m² - Línea Excellence','toalla-infinite-500-gr-m-linea-excellence-ih8r4','Toalla Infinite 500 gr/m²
línea Excellence
Las Toallas de rostro Infinite están confeccionadas con 100% algodón, con un gramaje de 500 GR/M2.
Ofrecen una textura más suave y envolvente, con excelente capacidad de absorción para una experiencia superior en cada uso.
Medida: 45 x 80 cm
¡Complementalo con la Toallón Infinite!
→ Mas cuerpo, mas confort.
→ Confección de 500 gr/m² - 100% algodón.
→ Suavidad extra en cada contacto.
Una toalla que merece ser tu Media Naranja ?
- Fotos illustrativas -
Hilado Ringspun: calidad asegurada (proceso especial de hilar Algodón)
- Mayor resistencia: duran más y se desgastan menos.
- Textura extra suave: delicadeza al tacto, sin imperfecciones.
- Absorción superior: fibras más compactas que retienen mejor la humedad.
Algodón 100% Real: lujo auténtico
- Absorción máxima: captura y retiene la humedad con eficacia.
- Suavidad absoluta: confort asegurado en cada contacto.
- Durabilidad superior: más firmeza y resistencia para acompañarte por años.','{"talles": "Toalla: 45 x 80cm", "colores": "Azul, Blanco, Bordó, Tormenta"}'::jsonb,'["/productos/hogar/toallas/toalla-infinite-500-gr-m-linea-excellence-ih8r4/01.webp"]'::jsonb,'https://www.medianaranja.store/productos/toalla-infinite-500-gr-m-linea-excellence-ih8r4/',39),
('hogar','toallas','Toallas y Toallones','Toalla Hotelera Deluxe 630 gr/m² - Línea Excellence','toalla-hotelera-deluxe-630-gr-m-linea-excellence','Toalla Hotelera Deluxe 630 gr/m²
línea Excellence
Toalla de rostro hotelera luxury. Disfrutá la suavidad y absorción real de nuestra Toalla Deluxe. Confeccionada con hilado Ringspun + 100% Algodón Real ofrece: mayor resistencia, suavidad y extra absorción superior.
Su gramaje de 630 GSM (gramos por metro cuadrado) aporta una densidad luxury propia de la hotelería de lujo: toalla más gruesa, suave y altamente absorbente, que transforma cada uso en una experiencia de spa auténtica.
¡Complementala con el Toallón Deluxe!
→ Calidad hotelera luxury
→ Confección de 630 gr/m² - 100% algodón
→ Absorbente, suave y duradera
Una toalla que merece ser tu Media Naranja ?
- Fotos illustrativas -
Hilado Ringspun: calidad asegurada (proceso especial de hilar Algodón)
- Mayor resistencia: duran más y se desgastan menos.
- Textura extra suave: delicadeza al tacto, sin imperfecciones.
- Absorción superior: fibras más compactas que retienen mejor la humedad.
Algodón 100% Real: lujo auténtico
- Absorción máxima: captura y retiene la humedad con eficacia.
- Suavidad absoluta: confort asegurado en cada contacto.
- Durabilidad superior: más firmeza y resistencia para acompañarte por años.','{"talles": "Toalla: 50x90cm", "colores": "Blanco, Negro, Tormenta, Visón"}'::jsonb,'["/productos/hogar/toallas/toalla-hotelera-deluxe-630-gr-m-linea-excellence/01.webp", "/productos/hogar/toallas/toalla-hotelera-deluxe-630-gr-m-linea-excellence/02.webp", "/productos/hogar/toallas/toalla-hotelera-deluxe-630-gr-m-linea-excellence/03.webp", "/productos/hogar/toallas/toalla-hotelera-deluxe-630-gr-m-linea-excellence/04.webp", "/productos/hogar/toallas/toalla-hotelera-deluxe-630-gr-m-linea-excellence/05.webp"]'::jsonb,'https://www.medianaranja.store/productos/toalla-hotelera-deluxe-630-gr-m-linea-excellence/',40),
('hogar','toallas','Toallas y Toallones','Toallón Galaxy 400 gr/m² - Línea Essentials','toallon-galaxy-400-gr-m-linea-essentials-9r9dc','Toallón Galaxy 400 gr/m²
línea Essentials
Los Toallones de baño Galaxy son ligeros y absorbentes. Con 100% algodón y un gramaje de 400 GR/M2.
Brindan un balance entre tamaño práctico y absorción eficiente, pensados para el día a día.
Medida 70 x 140cm
¡Complementalo con la Toalla Galaxy!
→ Calidad premium de uso diario
→ Confección de 400 gr/m² - 100% algodón
→ Práctico, absorbente y duradero
Un toallón que merece ser tu Media Naranja ?
- Fotos illustrativas -
Hilado: calidad asegurada.
- Mayor resistencia: duran más y se desgastan menos.
- Textura extra suave: delicadeza al tacto, sin imperfecciones.
- Absorción superior: fibras más compactas que retienen mejor la humedad.
Algodón 100% Real: lujo auténtico
- Absorción máxima: captura y retiene la humedad con eficacia.
- Suavidad absoluta: confort asegurado en cada contacto.
- Durabilidad superior: más firmeza y resistencia para acompañarte por años.','{"talles": "Toallón: 70 x 140cm", "colores": "Azulino, Blanco, Rosa, Tormenta, Verde"}'::jsonb,'["/productos/hogar/toallas/toallon-galaxy-400-gr-m-linea-essentials-9r9dc/01.webp"]'::jsonb,'https://www.medianaranja.store/productos/toallon-galaxy-400-gr-m-linea-essentials-9r9dc/',41),
('hogar','toallas','Toallas y Toallones','Toalla Premium Royale 600 gr/m² - Línea Essentials','toalla-premium-royale-600-gr-m-linea-essentials','Toalla Premium Royale 600 gr/m²
línea Essentials
Toalla de rostro premium. Disfrutá la practicidad, suavidad y absorción de nuestra Toalla Royale. Confeccionada con hilado Ringspun + 100% Algodón Real asegura: resistencia, suavidad y absorción superior.
Su gramaje de 600 GSM (gramos por metro cuadrado) aporta una densidad premium propia para el uso diario: toalla duradera, suave y altamente absorbente, que transforma cada uso en una experiencia de Lujo Real.
¡Complementala con el Toallón Royale!
→ Calidad premium de uso diario
→ Confección de 600 gr/m² - 100% algodón
→ Práctica, absorbente y duradera
Una toalla que merece ser tu Media Naranja ?
- Fotos illustrativas -
Hilado Ringspun: calidad asegurada (proceso especial de hilar Algodón)
- Mayor resistencia: duran más y se desgastan menos.
- Textura extra suave: delicadeza al tacto, sin imperfecciones.
- Absorción superior: fibras más compactas que retienen mejor la humedad.
Algodón 100% Real: lujo auténtico
- Absorción máxima: captura y retiene la humedad con eficacia.
- Suavidad absoluta: confort asegurado en cada contacto.
- Durabilidad superior: más firmeza y resistencia para acompañarte por años.','{"talles": "Toalla: 50x80cm", "colores": "Blanco, Negro, Tormenta, Visón"}'::jsonb,'["/productos/hogar/toallas/toalla-premium-royale-600-gr-m-linea-essentials/01.webp", "/productos/hogar/toallas/toalla-premium-royale-600-gr-m-linea-essentials/02.webp", "/productos/hogar/toallas/toalla-premium-royale-600-gr-m-linea-essentials/03.webp", "/productos/hogar/toallas/toalla-premium-royale-600-gr-m-linea-essentials/04.webp", "/productos/hogar/toallas/toalla-premium-royale-600-gr-m-linea-essentials/05.webp"]'::jsonb,'https://www.medianaranja.store/productos/toalla-premium-royale-600-gr-m-linea-essentials/',42),
('hogar','toallas','Toallas y Toallones','Toallón Premium Royale 600 gr/m² - Línea Essentials','toallon-premium-royale-600-gr-m-linea-essentials','Toallón Premium Royale 600 gr/m²
línea Essentials
Toallón de baño premium. Disfrutá la practicidad, suavidad y absorción de nuestro Toallón Royale. Confeccionado con hilado Ringspun + 100% Algodón Real asegura: resistencia, suavidad y absorción superior.
Su gramaje de 600 GSM (gramos por metro cuadrado) aporta una densidad premium propia para el uso diario: toallón duradero, suave y altamente absorbente, que transforma cada uso en una experiencia de Lujo Real.
¡Complementalo con la Toalla Royale!
→ Calidad premium de uso diario
→ Confección de 600 gr/m² - 100% algodón
→ Práctico, absorbente y duradero
Un toallón que merece ser tu Media Naranja ?
- Fotos illustrativas -
Hilado Ringspun: calidad asegurada (proceso especial de hilar Algodón)
- Mayor resistencia: duran más y se desgastan menos.
- Textura extra suave: delicadeza al tacto, sin imperfecciones.
- Absorción superior: fibras más compactas que retienen mejor la humedad.
Algodón 100% Real: lujo auténtico
- Absorción máxima: captura y retiene la humedad con eficacia.
- Suavidad absoluta: confort asegurado en cada contacto.
- Durabilidad superior: más firmeza y resistencia para acompañarte por años.','{"talles": "Toallón: 78x140cm", "colores": "Blanco, Negro, Tormenta, Visón"}'::jsonb,'["/productos/hogar/toallas/toallon-premium-royale-600-gr-m-linea-essentials/01.webp", "/productos/hogar/toallas/toallon-premium-royale-600-gr-m-linea-essentials/02.webp", "/productos/hogar/toallas/toallon-premium-royale-600-gr-m-linea-essentials/03.webp", "/productos/hogar/toallas/toallon-premium-royale-600-gr-m-linea-essentials/04.webp", "/productos/hogar/toallas/toallon-premium-royale-600-gr-m-linea-essentials/05.webp"]'::jsonb,'https://www.medianaranja.store/productos/toallon-premium-royale-600-gr-m-linea-essentials/',43),
('hogar','toallas','Toallas y Toallones','Toalla Galaxy 400 gr/m² - Línea Essentials','toalla-galaxy-400-gr-m-linea-essentials-jammk','Toalla Galaxy 400 gr/m²
línea Essentials
Las Toallas de rostro Galaxy están confeccionadas con 100% algodón, con un gramaje de 400 GR/M2.
Son livianas, suaves y absorbentes, ideales para el uso diario y una rutina práctica y confortable.
Medida 45 x 80cm
¡Complementalo con la Toallón Galaxy!
→ Calidad premium de uso diario
→ Confección de 400 gr/m² - 100% algodón
→ Práctico, absorbente y duradero
Una toalla que merece ser tu Media Naranja ?
- Fotos illustrativas -
Hilado: calidad asegurada.
- Mayor resistencia: duran más y se desgastan menos.
- Textura extra suave: delicadeza al tacto, sin imperfecciones.
- Absorción superior: fibras más compactas que retienen mejor la humedad.
Algodón 100% Real: lujo auténtico
- Absorción máxima: captura y retiene la humedad con eficacia.
- Suavidad absoluta: confort asegurado en cada contacto.
- Durabilidad superior: más firmeza y resistencia para acompañarte por años.','{"talles": "Toalla: 45 x 80cm", "colores": "Azulino, Blanco, Rosa, Tormenta, Verde"}'::jsonb,'["/productos/hogar/toallas/toalla-galaxy-400-gr-m-linea-essentials-jammk/01.webp"]'::jsonb,'https://www.medianaranja.store/productos/toalla-galaxy-400-gr-m-linea-essentials-jammk/',44),
('hogar','toallas','Toallas y Toallones','Toallón Hotelero Deluxe 630 gr/m²- Línea Excellence','toallon-hotelero-deluxe-630-gr-m-linea-excellence','Toallón Hotelero Deluxe 630 gr/m²
línea Excellence
Toallón de baño hotelero luxury. Disfrutá la suavidad y absorción real de nuestro Toallón Deluxe. Confeccionado con hilado Ringspun + 100% Algodón Real ofrece: mayor resistencia, suavidad y extra absorción superior.
Su gramaje de 630 GSM (gramos por metro cuadrado) aporta una densidad luxury propia de la hotelería de lujo: toallón más grueso, suave y altamente absorbente, que transforma cada uso en una experiencia de spa auténtica.
¡Complementalo con la Toalla Deluxe!
→ Calidad hotelera luxury
→ Confección de 630 gr/m² - 100% algodón
→ Absorbente, suave y duradero
Un toallón que merece ser tu Media Naranja ?
- Fotos illustrativas -
Hilado Ringspun: calidad asegurada (proceso especial de hilar Algodón)
- Mayor resistencia: duran más y se desgastan menos.
- Textura extra suave: delicadeza al tacto, sin imperfecciones.
- Absorción superior: fibras más compactas que retienen mejor la humedad.
Algodón 100% Real: lujo auténtico
- Absorción máxima: captura y retiene la humedad con eficacia.
- Suavidad absoluta: confort asegurado en cada contacto.
- Durabilidad superior: más firmeza y resistencia para acompañarte por años.','{"talles": "Toallón: 85x165cm", "colores": "Blanco, Negro, Tormenta, Visón"}'::jsonb,'["/productos/hogar/toallas/toallon-hotelero-deluxe-630-gr-m-linea-excellence/01.webp", "/productos/hogar/toallas/toallon-hotelero-deluxe-630-gr-m-linea-excellence/02.webp", "/productos/hogar/toallas/toallon-hotelero-deluxe-630-gr-m-linea-excellence/03.webp", "/productos/hogar/toallas/toallon-hotelero-deluxe-630-gr-m-linea-excellence/04.webp", "/productos/hogar/toallas/toallon-hotelero-deluxe-630-gr-m-linea-excellence/05.webp"]'::jsonb,'https://www.medianaranja.store/productos/toallon-hotelero-deluxe-630-gr-m-linea-excellence/',45),
('hogar','toallas','Toallas y Toallones','Toallón Dryfit Secado Rápido - Línea Essentials','toallon-dryfit-secado-rapido-linea-essentials','Toallón Dryfit Secado Rápido
línea Essentials
Toallón de microfibra premium. Revolucioná tu rutina de secado con nuestro toallón Dryfit confeccionado 100% en microfibra de alta calidad. Su diseño de secado rápido, liviano y resistente lo convierte en el complemento ideal para entrenamientos físicos, viajes y/o días de playa.
→ Secado rápido de alta absorción
→ Textura suave, ideal para piel delicada
→ Liviano, compacto y duradero
Un toallón que merece ser tu Media Naranja ?
- Fotos illustrativas -','{"talles": "Único: 70x150cm", "colores": "Gris"}'::jsonb,'["/productos/hogar/toallas/toallon-dryfit-secado-rapido-linea-essentials/01.webp", "/productos/hogar/toallas/toallon-dryfit-secado-rapido-linea-essentials/02.webp"]'::jsonb,'https://www.medianaranja.store/productos/toallon-dryfit-secado-rapido-linea-essentials/',46),
('hogar','repasadores','Repasadores','Repasador Stelar - Línea Essentials','repasador-stelar-linea-essentials','Repasador Stelar
línea Essentials
Repasador de cocina. Renová tu hogar con nuestro repasador Stelar confeccionado 88% algodón y 12% poliéster. Su diseño liviano y absorbente lo convierten en el complemento ideal para la practicidad del día a día.
→ Costuras reforzadas
→ Calidad súper resistente y absorbente
→ Práctico, liviano y funcional
Un repasador que merece ser tu Media Naranja ?
- Fotos illustrativas -','{"talles": "Único: 44x65cm", "colores": "Blanco, Chocolate, Gris, Negro"}'::jsonb,'["/productos/hogar/repasadores/repasador-stelar-linea-essentials/01.webp", "/productos/hogar/repasadores/repasador-stelar-linea-essentials/02.webp", "/productos/hogar/repasadores/repasador-stelar-linea-essentials/03.webp", "/productos/hogar/repasadores/repasador-stelar-linea-essentials/04.webp", "/productos/hogar/repasadores/repasador-stelar-linea-essentials/05.webp"]'::jsonb,'https://www.medianaranja.store/productos/repasador-stelar-linea-essentials/',47),
('hogar','acolchados','Acolchados','Acolchado Comfort - Línea Excellence','acolchado-comfort-linea-excellence','Acolchado Comfort
línea Excellence
Set de acolchado con fundas premium. Sumergite en la comodidad diaria con nuestro acolchado Comfort de microfibra prelavada. Su textura súper mullida y extra suave lo convierte en la opción ideal para un descanso reparador todos los días.
→ Calidad premium
→ Textura súper suave y mullida
→ Relleno de fibra sintética
Un acolchado que merece ser tu Media Naranja ?
- Fotos illustrativas -','{"talles": "King: 280x250cm, Queen: 240x240cm, Twin: 180x240cm", "colores": "Blanco, Cemento, Gris, Visón"}'::jsonb,'["/productos/hogar/acolchados/acolchado-comfort-linea-excellence/01.webp", "/productos/hogar/acolchados/acolchado-comfort-linea-excellence/02.webp", "/productos/hogar/acolchados/acolchado-comfort-linea-excellence/03.webp", "/productos/hogar/acolchados/acolchado-comfort-linea-excellence/04.webp", "/productos/hogar/acolchados/acolchado-comfort-linea-excellence/05.webp"]'::jsonb,'https://www.medianaranja.store/productos/acolchado-comfort-linea-excellence/',48),
('hogar','acolchados','Acolchados','Acolchado Double - Línea Essentials','acolchado-double-linea-essentials','Acolchado Double
línea Essentials
Set de acolchado bitono reversible. Disfrutá el confort diario con nuestro acolchado Double de microfibra super soft. Su textura suave, peso liviano y diseño bicolor lo convierte en la opción ideal para renovar el descanso de cada día.
→ Color bitono reversible
→ Suave, abrigado y liviano
→ Relleno de microfibra
Un acolchado que merece ser tu Media Naranja ?
- Fotos illustrativas -','{"talles": "King: 280x250cm, Queen: 220x240cm, Twin: 160x240cm", "colores": "Azul, Blanco, Gris, Lila"}'::jsonb,'["/productos/hogar/acolchados/acolchado-double-linea-essentials/01.webp", "/productos/hogar/acolchados/acolchado-double-linea-essentials/02.webp", "/productos/hogar/acolchados/acolchado-double-linea-essentials/03.webp", "/productos/hogar/acolchados/acolchado-double-linea-essentials/04.webp", "/productos/hogar/acolchados/acolchado-double-linea-essentials/05.webp"]'::jsonb,'https://www.medianaranja.store/productos/acolchado-double-linea-essentials/',49),
('hogar','cubrecama','Cubrecamas','Cubrecama Cloud - Línea Essentials','cubrecama-cloud-linea-essentials','Cubrecama Cloud
línea Essentials
Set de cubrecama con fundas. Renová tu descanso con nuestro cover Cloud confeccionado en microfibra soft. Su diseño de secado rápido, liviano y resistente lo convierte en el complemento ideal para la practicidad del día a día.
→ Secado rápido antiarrugas
→ Suave y resistente
→ Microfibra soft
Un cover que merece ser tu Media Naranja ?
- Fotos illustrativas -','{"talles": "King: 280x250cm, Queen: 240x240cm, Twin: 170x240", "colores": "Blanco, Gris, Lila"}'::jsonb,'["/productos/hogar/cubrecama/cubrecama-cloud-linea-essentials/01.webp", "/productos/hogar/cubrecama/cubrecama-cloud-linea-essentials/02.webp", "/productos/hogar/cubrecama/cubrecama-cloud-linea-essentials/03.webp", "/productos/hogar/cubrecama/cubrecama-cloud-linea-essentials/04.webp"]'::jsonb,'https://www.medianaranja.store/productos/cubrecama-cloud-linea-essentials/',50),
('hogar','cubrecama','Cubrecamas','Cubrecama Cozy - Línea Excellence','cubrecama-cozy-linea-excellence','Cubrecama Cozy
línea Excellence
Set de cubrecama con fundas premium. Cuidá el descanso con la calidez de nuestro cover Cozy de microfibra prelavada súper soft. Su diseño liviano y extra suave lo convierte en el complemento ideal para el descanso de todos los días.
→ Calidad premium
→ Suave y liviano
→ Microfibra super soft
Un cover que merece ser tu Media Naranja ?
- Fotos illustrativas -','{"talles": "King: 280x250cm, Queen: 240x240cm, Twin: 170x240cm", "colores": "Blanco, Gris, Visón"}'::jsonb,'["/productos/hogar/cubrecama/cubrecama-cozy-linea-excellence/01.webp", "/productos/hogar/cubrecama/cubrecama-cozy-linea-excellence/02.webp", "/productos/hogar/cubrecama/cubrecama-cozy-linea-excellence/03.webp", "/productos/hogar/cubrecama/cubrecama-cozy-linea-excellence/04.webp"]'::jsonb,'https://www.medianaranja.store/productos/cubrecama-cozy-linea-excellence/',51),
('hogar','frazadas','Frazadas','Frazada Corderito Square - Línea Essentials','frazada-corderito-square-linea-essentials','Frazada Square
línea Essentials
Frazada de invierno. Cuidá el descanso con la calidez de nuestra frazada Square confeccionada 100% en corderito, con interior tipo sherpa y exterior con textura jacquard. Su diseño suave, cálido y mullido lo convierte en el complemento ideal para el descanso invernal.
→ Calidez y abrigo asegurado
→ Confección 100% corderito
→ Suave, liviano y mullido
Una frazada que merece ser tu Media Naranja ?
- Fotos illustrativas -','{"talles": "King: 240x270cm, Queen: 220x240cm, Twin: 160x240cm", "colores": "Gris, Natural, Visón"}'::jsonb,'["/productos/hogar/frazadas/frazada-corderito-square-linea-essentials/01.webp", "/productos/hogar/frazadas/frazada-corderito-square-linea-essentials/02.webp", "/productos/hogar/frazadas/frazada-corderito-square-linea-essentials/03.webp", "/productos/hogar/frazadas/frazada-corderito-square-linea-essentials/04.webp"]'::jsonb,'https://www.medianaranja.store/productos/frazada-corderito-square-linea-essentials/',52),
('hogar','mantas','Mantas','Manta Tejida Acrílica Dots - Línea Excellence','manta-tejida-acrilica-dots-linea-excellence','Manta Dots
línea Excellence
Manta premium. Decorá tu hogar con nuestra manta Dots confeccionada en tejido 100% acrílico de alta calidad. Su diseño premium y versátil la convierten en el complemento ideal para cada rincón de la casa.
→ Ideal para pie de cama y sillones
→ Confección 100% tejido acrílico
→ Suave, cálido y resistente
Una manta que merece ser tu Media Naranja ?
- Fotos illustrativas -','{"talles": "Natural, Visón", "colores": ""}'::jsonb,'["/productos/hogar/mantas/manta-tejida-acrilica-dots-linea-excellence/01.webp", "/productos/hogar/mantas/manta-tejida-acrilica-dots-linea-excellence/02.webp", "/productos/hogar/mantas/manta-tejida-acrilica-dots-linea-excellence/03.webp"]'::jsonb,'https://www.medianaranja.store/productos/manta-tejida-acrilica-dots-linea-excellence/',53),
('hogar','sabanas','Sábanas','Sábanas Percal 200 Hilos 100% Algodón - Línea Essentials','sabanas-percal-200-hilos-100-algodon-linea-essentials','Sábanas Percal 200 Hilos 100% Algodón
línea Essentials
Set de sábanas con fundas. Disfrutá el descanso que mereces con nuestras Sábanas Percal de 200 Hilos confeccionadas 100% en algodón. Su textura suave y calidad duradera las convierten en la opción ideal para un descanso reparador del día a día.
→ Calidad premium
→ Confección de 200 Hilos - 100% algodón
→ Frescas y resistentes
Unas sábanas que merecen ser tu Media Naranja ?
- Fotos illustrativas -','{"talles": "King, Queen, Twin", "colores": "Blanco, Gris, Lila"}'::jsonb,'["/productos/hogar/sabanas/sabanas-percal-200-hilos-100-algodon-linea-essentials/01.webp", "/productos/hogar/sabanas/sabanas-percal-200-hilos-100-algodon-linea-essentials/02.webp", "/productos/hogar/sabanas/sabanas-percal-200-hilos-100-algodon-linea-essentials/03.webp", "/productos/hogar/sabanas/sabanas-percal-200-hilos-100-algodon-linea-essentials/04.webp"]'::jsonb,'https://www.medianaranja.store/productos/sabanas-percal-200-hilos-100-algodon-linea-essentials/',54),
('hogar','sabanas','Sábanas','Sábanas Satén 600 Hilos 100% Algodón - Línea Excellence','sabanas-saten-600-hilos-100-algodon-linea-excellence','Sábanas Satén 600 Hilos 100% Algodón
línea Excellence
Set de sábanas con fundas luxury. Disfrutá el descanso que mereces con nuestras Sábanas Satén de 600 Hilos confeccionadas 100% en algodón de calidad única hotelera. Su textura sedosa, confección liviana y calidad premium las convierten en la opción ideal para un descanso de excelencia.
→ Calidad luxury
→ Confección de 600 Hilos - 100% algodón
→ Suaves y duraderas
Unas sábanas que merecen ser tu Media Naranja ?
- Fotos illustrativas -','{"talles": "King, Queen, Twin", "colores": "Blanco, Gris, Visón"}'::jsonb,'["/productos/hogar/sabanas/sabanas-saten-600-hilos-100-algodon-linea-excellence/01.webp", "/productos/hogar/sabanas/sabanas-saten-600-hilos-100-algodon-linea-excellence/02.webp", "/productos/hogar/sabanas/sabanas-saten-600-hilos-100-algodon-linea-excellence/03.webp", "/productos/hogar/sabanas/sabanas-saten-600-hilos-100-algodon-linea-excellence/04.webp"]'::jsonb,'https://www.medianaranja.store/productos/sabanas-saten-600-hilos-100-algodon-linea-excellence/',55)
on conflict do nothing;
