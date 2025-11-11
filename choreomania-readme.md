# CHOREOMANIA: The Last Ascent

Proyecto de "Wheel of Doom" gamificado con temática distópica de ciencia ficción.

## 📁 Estructura de carpetas

```
choreomania/
├── main/
│   ├── intro.html
│   ├── register.html
│   ├── round.html
│   └── reveal.html
├── estilos/
│   ├── styles.css (estilos globales)
│   ├── intro.css
│   ├── register.css
│   ├── round.css
│   └── reveal.css
├── scripts/
│   ├── data.js (definición de sprites)
│   ├── gameState.js (gestor de estado)
│   ├── intro.js
│   ├── register.js
│   ├── round.js
│   └── reveal.js
└── sprites/ (carpeta para las imágenes)
    ├── red-full.png
    ├── red-icon.png
    ├── blue-full.png
    ├── blue-icon.png
    └── ... (16 colores x 2 versiones = 32 imágenes)
```

## 🎮 Flujo del juego

1. **intro.html** → Pantalla de introducción con narrativa
2. **register.html** → Registro de 16 participantes
3. **round.html** → Rondas de selección (se reutiliza para las 4 rondas)
4. **reveal.html** → Reveal del ganador + plot twist

## 🚀 Cómo usar

### 1. Configurar estructura
Crea las carpetas según la estructura anterior.

### 2. Copiar archivos
- Coloca todos los `.html` en la carpeta `main/`
- Coloca todos los `.css` en la carpeta `estilos/`
- Coloca todos los `.js` en la carpeta `scripts/`

### 3. Sprites (importante)
Como los sprites están predefinidos pero aún no existen, tienes 2 opciones:

**Opción A: Usar imágenes reales**
- Crea 16 sprites en versión fullbody y icon
- Nombra los archivos según `data.js`: `red-full.png`, `red-icon.png`, etc.
- Colócalos en la carpeta `sprites/`

**Opción B: Usar placeholders temporales (más rápido para testing)**
- Los avatares ya están diseñados para mostrar la inicial del nombre con color de fondo
- Las rutas de imágenes están en `data.js` pero no se usan actualmente
- Puedes dejar las rutas y añadir las imágenes después

### 4. Abrir el proyecto
Simplemente abre `main/intro.html` en tu navegador.

**⚠️ IMPORTANTE:** Debido a que usamos módulos ES6 (`import/export`), necesitas:
- Un servidor local (no abrir el HTML directamente desde el sistema de archivos)
- Opciones:
  - **Live Server** (extensión de VS Code) → Click derecho en `intro.html` → "Open with Live Server"
  - **Python**: `python -m http.server 8000` en la carpeta del proyecto
  - **Node.js**: `npx serve` en la carpeta del proyecto

## 🎨 Personalización

### Cambiar colores de sprites
Edita el array `availableSprites` en `scripts/data.js`:

```javascript
export const availableSprites = [
  { 
    id: 1, 
    color: '#TU_COLOR_AQUI',
    name: 'NombreColor',
    fullbody: './sprites/color-full.png', 
    icon: './sprites/color-icon.png' 
  },
  // ...
];
```

### Cambiar cantidad de participantes
Actualmente está fijo en 16. Para cambiar:
1. Modifica los checks en `register.js` (línea donde dice `>= 16`)
2. Ajusta el array de sprites en `data.js` (añadir/quitar colores)
3. Modifica `roundConfig` en `round.js` para ajustar las rondas

### Cambiar texto de intro
Edita el array `introText` en `scripts/intro.js`

### Cambiar texto del reveal
Edita el HTML en `reveal.html` o el contenido en `reveal.js`

## 🔧 Características técnicas

- **Sin dependencias externas**: JavaScript vanilla + CSS
- **Módulos ES6**: Organización limpia con import/export
- **LocalStorage**: Persistencia de datos entre páginas
- **Animaciones CSS**: Transiciones suaves y efectos visuales
- **Responsive**: Funciona en desktop, tablet y móvil
- **State management**: Sistema centralizado de gestión de estado

## 🎯 Testing rápido

1. Abre `intro.html` con Live Server
2. Click en "BEGIN CEREMONY"
3. Añade 16 nombres (puedes usar nombres cortos para ir rápido)
4. Click en "START CEREMONY"
5. Click en "INITIATE SELECTION"
6. Observa la animación de selección
7. Click en "NEXT ROUND"
8. Repite para las 4 rondas
9. Disfruta del reveal final

## 🐛 Solución de problemas

### "Cannot use import statement outside a module"
- Asegúrate de que todos los `<script>` tengan `type="module"`
- Usa un servidor local, no abras el HTML directamente

### "gameState is not defined"
- Verifica que las rutas de import sean correctas
- Asegúrate de que `gameState.js` esté en `scripts/`

### Los sprites no aparecen
- Las imágenes son opcionales (los avatares usan colores + iniciales)
- Si quieres imágenes, asegúrate de que las rutas sean correctas

### LocalStorage no funciona
- Algunos navegadores bloquean localStorage en modo file://
- Usa un servidor local

## 📝 Notas para desarrollo

- Los contestants son **objetos completos** que se guardan en `gameState`
- Cada vista **carga** el estado al inicio y lo **guarda** cuando cambia
- Las animaciones se manejan con **clases CSS** que se añaden/quitan con JS
- El estado `'active'`, `'saved'`, `'eliminated'` controla qué contestants aparecen en cada zona

## 🎬 Próximas mejoras sugeridas

- [ ] Añadir sonidos/música
- [ ] Mejorar animaciones (partículas, efectos especiales)
- [ ] Añadir modo "espectador" (reproducir ceremonia anterior)
- [ ] Sistema de perfiles más complejo (edad, ocupación, etc.)
- [ ] Estadísticas finales (% de supervivencia por ronda)
- [ ] Modo "The Benefactor" (personalizar el reveal)

## 👥 Créditos

Proyecto desarrollado para clase de desarrollo web.
Concepto inspirado en Los Simpson, Los Juegos del Hambre y Black Mirror.
