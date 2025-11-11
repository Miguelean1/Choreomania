# Sistema de Sorteo Reutilizable

## 📋 Descripción

El archivo `raffle.js` contiene un sistema modular de sorteo que puede ser utilizado en múltiples vistas del proyecto. Proporciona animaciones visuales y selección aleatoria de elementos.

## 🚀 Uso Rápido

### 1. Incluir el módulo en tu HTML

```html
<!-- Cargar el módulo antes de tu script -->
<script src="raffle.js"></script>
<script src="tu-script.js"></script>
```

### 2. Inicializar en tu JavaScript

```javascript
// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Crear instancia del sistema de sorteo
    const miSorteo = new RaffleSystem({
        playerBoxSelector: '.character-image',  // Selector CSS
        totalPlayers: 16,                       // Total de elementos
        winnersCount: 8,                        // Cantidad a seleccionar
        animationDuration: 2000,                // Duración (ms)
        selectedClass: 'selected',              // Clase CSS para seleccionados
        glowColor: 'gold'                       // Color del brillo
    });
    
    // Inicializar (carga los elementos del DOM)
    miSorteo.init();
    
    // Vincular a un botón o evento
    document.getElementById('btnSorteo').addEventListener('click', () => {
        miSorteo.start();
    });
});
```

## ⚙️ Configuración

| Opción | Tipo | Por defecto | Descripción |
|--------|------|-------------|-------------|
| `playerBoxSelector` | string | `'.character-image'` | Selector CSS de los elementos a sortear |
| `totalPlayers` | number | `16` | Total de elementos disponibles |
| `winnersCount` | number | `8` | Cantidad de elementos a seleccionar |
| `animationDuration` | number | `2000` | Duración de la animación en ms |
| `selectedClass` | string | `'selected'` | Clase CSS aplicada a los seleccionados |
| `glowColor` | string | `'gold'` | Color del brillo para seleccionados |
| `shadowColors` | array | `[...]` | Array de colores para la animación |
| `blinkInterval` | number | `150` | Intervalo entre cambios de color (ms) |

## 📝 Ejemplos de Uso

### Ejemplo 1: Vista Simple

```html
<!DOCTYPE html>
<html>
<head>
    <title>Mi Sorteo</title>
    <style>
        .player { 
            width: 100px; 
            height: 100px; 
            border: 2px solid black; 
        }
        .selected { 
            border-color: gold; 
        }
    </style>
</head>
<body>
    <!-- Elementos a sortear -->
    <div class="player" id="playerBox1">1</div>
    <div class="player" id="playerBox2">2</div>
    <div class="player" id="playerBox3">3</div>
    <div class="player" id="playerBox4">4</div>
    
    <button id="btnSorteo">Iniciar Sorteo</button>
    
    <script src="raffle.js"></script>
    <script>
        const sorteo = new RaffleSystem({
            totalPlayers: 4,
            winnersCount: 2
        });
        sorteo.init();
        
        document.getElementById('btnSorteo').addEventListener('click', () => {
            sorteo.start();
        });
    </script>
</body>
</html>
```

### Ejemplo 2: Con Callback

```javascript
const sorteo = new RaffleSystem();
sorteo.init();

// Ejecutar sorteo con callback al finalizar
sorteo.start((selectedIndices) => {
    console.log('Ganadores:', selectedIndices);
    alert(`Los ganadores son: ${selectedIndices.join(', ')}`);
});
```

### Ejemplo 3: Usando Promesas

```javascript
const sorteo = new RaffleSystem();
sorteo.init();

async function realizarSorteo() {
    try {
        const ganadores = await sorteo.start();
        console.log('Sorteo completado:', ganadores);
        
        // Hacer algo con los ganadores
        mostrarGanadores(ganadores);
    } catch (error) {
        console.error('Error en sorteo:', error);
    }
}

document.getElementById('btn').addEventListener('click', realizarSorteo);
```

### Ejemplo 4: Resetear y Volver a Sortear

```javascript
const sorteo = new RaffleSystem();
sorteo.init();

document.getElementById('btnSortear').addEventListener('click', () => {
    sorteo.start();
});

document.getElementById('btnReset').addEventListener('click', () => {
    sorteo.reset(); // Limpia todos los efectos visuales
});
```

### Ejemplo 5: Obtener Elementos Seleccionados

```javascript
const sorteo = new RaffleSystem();
sorteo.init();

sorteo.start().then(() => {
    // Obtener los elementos DOM seleccionados
    const elementos = sorteo.getSelectedElements();
    console.log('Elementos seleccionados:', elementos);
    
    // Obtener solo los índices
    const indices = sorteo.getSelectedIndices();
    console.log('Índices:', indices);
});
```

## 🎨 Personalización de Colores

```javascript
const sorteo = new RaffleSystem({
    shadowColors: [
        "rgba(255, 0, 0, 0.7)",    // Rojo
        "rgba(0, 255, 0, 0.7)",    // Verde
        "rgba(0, 0, 255, 0.7)",    // Azul
        "rgba(255, 255, 0, 0.7)",  // Amarillo
    ],
    glowColor: '#ff0000' // Rojo para los seleccionados
});
```

## 🔧 Métodos Disponibles

| Método | Descripción | Retorno |
|--------|-------------|---------|
| `init()` | Carga los elementos del DOM | `this` (chainable) |
| `start(callback)` | Inicia el sorteo | `Promise<Array>` |
| `reset()` | Limpia todos los efectos visuales | `void` |
| `getSelectedElements()` | Obtiene elementos DOM seleccionados | `Array<Element>` |
| `getSelectedIndices()` | Obtiene índices seleccionados | `Array<number>` |

## 💡 Consejos

1. **Siempre llama a `init()`** después de crear la instancia
2. **Usa selectores específicos** para evitar conflictos con otros elementos
3. **Personaliza los colores** para que coincidan con tu diseño
4. **Maneja el callback** si necesitas ejecutar acciones después del sorteo
5. **Usa `reset()`** si quieres permitir múltiples sorteos

## 🐛 Troubleshooting

**Problema:** No funciona el sorteo
- ✅ Verifica que `raffle.js` esté cargado antes de tu script
- ✅ Asegúrate de llamar a `init()` después de crear la instancia
- ✅ Confirma que los elementos existan en el DOM antes de inicializar

**Problema:** No se encuentran los elementos
- ✅ Revisa que el selector CSS sea correcto
- ✅ Si usas IDs, asegúrate de que sigan el formato `playerBox1`, `playerBox2`, etc.
- ✅ Verifica que `totalPlayers` coincida con la cantidad de elementos

**Problema:** La animación no se ve bien
- ✅ Ajusta `animationDuration` y `blinkInterval`
- ✅ Personaliza los `shadowColors` según tu diseño
- ✅ Asegúrate de que los elementos tengan suficiente espacio para mostrar el brillo

## 📦 Integración en Otras Vistas

Para usar el sistema en una nueva vista:

1. Copia `raffle.js` a la carpeta de tu nueva vista (o usa una ruta relativa)
2. Incluye el script en tu HTML
3. Crea una nueva instancia con tu configuración específica
4. ¡Listo!

```html
<!-- Nueva vista -->
<script src="../raffle.js"></script>
<script src="mi-vista.js"></script>
```

```javascript
// mi-vista.js
const miSorteo = new RaffleSystem({
    playerBoxSelector: '.mi-clase-personalizada',
    winnersCount: 5
});
miSorteo.init();
```
