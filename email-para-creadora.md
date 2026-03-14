# Email para la creadora de la ruta

---

**Para:** [nombre de ella]
**Asunto:** Lo que necesito de ti para la app de la ruta ✦

---

¡Hola! Estoy muy emocionado/a con este proyecto — creo que va a quedar increíble. Ya tengo la app funcionando con el mapa, los puntos de interés y el audio, así que ahora solo falta lo más importante: tu ruta y tu contenido.

Te explico todo lo que necesito, paso a paso. No tienes que saber nada de tecnología — solo me mandas los archivos y yo me encargo del resto.

---

## 1. La ruta GPX

Necesito el trazado de la ruta en formato **GPX** (es el estándar para rutas de senderismo). Hay dos formas de exportarlo:

- **Desde Wikiloc:** Abre tu ruta, ve a la opción de descargar y elige el formato GPX. Eso es todo.
- **Desde QGIS:** Exporta la capa de la ruta como GPX desde el menú *Capa → Exportar → Guardar objetos como…*, eligiendo el formato GPX.

### Opcional pero genial: el mapa personalizado

Si tienes el mapa de la ruta trabajado en QGIS con tu propio estilo (colores, capas, etc.), puedes exportarlo para que la app lo use en lugar del mapa topográfico estándar del USGS. Para hacerlo:

1. En QGIS, ve a **Procesos → Caja de herramientas de procesos → Generate XYZ Tiles (Directory)**
2. Configura la salida así:
   - **Carpeta de salida:** una carpeta nueva, por ejemplo `tiles/`
   - **Niveles de zoom:** mínimo 12, máximo 16
   - **Formato:** PNG
3. Comprime la carpeta resultante en un ZIP y me la mandas

Si esto te parece complicado, no te preocupes — la app funciona perfectamente con el mapa del USGS. Es solo un extra si quieres ese toque personal.

---

## 2. Los puntos de interés (POIs)

Esta es la parte más importante del contenido. Para cada punto de interés necesito lo siguiente:

### Por cada POI:

- **Nombre del lugar** — el nombre como quieras que aparezca en la app. Puede ser poético, descriptivo, o simplemente el nombre oficial.

- **Coordenadas GPS (latitud y longitud)** — dos formas fáciles de obtenerlas:
  - *Google Maps:* Abre el mapa, haz clic derecho sobre el punto exacto en el mapa, y en el menú que aparece verás las coordenadas directamente (algo como `44.1234, -72.5678`). Un clic las copia.
  - *Wikiloc:* Si ya tienes el punto marcado en Wikiloc, las coordenadas aparecen en la ficha del waypoint.

- **Descripción** — 2 a 5 frases sobre ese lugar. Puede ser lo que hace especial ese sitio: qué se ve, qué pasó ahí, por qué vale la pena detenerse. Si me lo escribes en español, yo me encargo de traducirlo al inglés (o al revés, como prefieras).

- **Fotos** — entre 1 y 3 fotos del lugar.
  - Formato JPG o PNG
  - Orientación horizontal preferida (apaisada), aunque vertical también funciona
  - Las fotos del móvil están perfectas, no necesitas cámara profesional

- **Audio (opcional pero muy recomendado)** — una grabación de voz de hasta unos 3 minutos, como si le estuvieras contando a una amiga algo sobre ese lugar mientras están caminando juntas. Es lo que más vida le da a la app.
  - Formato MP3 si puedes, pero cualquier formato de audio sirve
  - Graba en un sitio tranquilo, si es posible en interior o al abrigo del viento
  - El viento arruina las grabaciones al aire libre — si grabas afuera, tapa el micrófono con la mano o acércatelo a la boca
  - No hace falta que sea perfecto, solo que suene natural y con cariño

---

## 3. ¿Cuántos POIs?

Para una ruta de día completo, lo ideal son entre **5 y 12 puntos de interés**. Más de eso puede resultar abrumador; menos puede dejar la ruta un poco vacía.

A la hora de elegir los puntos, piensa en lugares que tengan alguna de estas cualidades:

- **Visualmente llamativos** — una cima, una cascada, una panorámica espectacular
- **Históricamente interesantes** — un muro de piedra antiguo, ruinas de una granja, un árbol con historia
- **Ecológicamente notables** — un bosque de hayas maduras, una zona de humedal, fauna habitual del lugar
- **Prácticamente útiles** — una fuente de agua, una zona de sombra en verano, un cruce importante donde la gente podría perderse

---

## 4. Dos cosas que quiero preguntarte

Antes de terminar, necesito tu opinión sobre un par de cosas:

- **Nombre de la app** — ahora mismo se llama *Ruta Interactiva*, pero puedes elegir el nombre que quieras. ¿Tiene la ruta un nombre propio? ¿Quieres que la app tenga su propio nombre?

- **Idiomas** — la app puede funcionar en español, en inglés, o en ambos (con un botón para cambiar). ¿Qué prefieres? ¿Tienes en mente un público concreto?

---

## Resumen: lo que me tienes que mandar

Para que sea fácil, aquí va la lista completa:

- [ ] Archivo GPX de la ruta
- [ ] (Opcional) Carpeta ZIP con los tiles del mapa de QGIS
- [ ] Para cada POI (entre 5 y 12):
  - [ ] Nombre del lugar
  - [ ] Coordenadas GPS (lat, lon)
  - [ ] Descripción en español y/o inglés
  - [ ] 1–3 fotos en JPG o PNG
  - [ ] (Opcional) Grabación de audio en MP3
- [ ] El nombre que quieres para la app
- [ ] Los idiomas que quieres activar

Puedes mandármelo todo junto o por partes según lo vayas teniendo — no hay prisa, y si tienes alguna duda sobre cualquier cosa, me preguntas sin problema.

¡Muchas gracias! Estoy deseando ver cómo queda esto.

Un abrazo,
[Tu nombre]
