# Anyta Lingerie - Marketplace Premium

## 🌟 Descripción

Marketplace profesional de lencería premium con sistema de administración completo y gestión dinámica de categorías. Diseñado específicamente para la marca "Anyta Lingerie" con todas las funcionalidades necesarias para un e-commerce moderno.

## ✨ Características Principales

### Para Clientes:
- **Catálogo de productos** con imágenes de alta calidad
- **Sistema de búsqueda** avanzado por nombre, descripción y categoría
- **Filtros dinámicos** por categoría y rango de precios
- **Carrito de compras** interactivo con gestión de cantidades
- **Sistema de tallas personalizable** con opciones predefinidas y manuales
- **Diseño responsive** optimizado para móviles y desktop
- **Interfaz elegante** con gradientes y animaciones suaves
- **Categorías dinámicas** que se actualizan automáticamente

### Para Administradores:
- **Panel de administración** completo y seguro
- **Gestión de productos** (crear, editar, eliminar) con sistema de precios avanzado
- **Gestión dinámica de categorías** (añadir, editar, eliminar)
- **Sistema de precios personalizable** con precio de compra, margen y precio final automático
- **Gestión de tallas customizable** con presets y opciones manuales
- **Control de inventario** y stock en tiempo real
- **Estadísticas** de ventas y productos
- **Sistema de autenticación** robusto
- **Validaciones inteligentes** para prevenir errores de datos

## 🔐 Credenciales de Administrador

- **Usuario:** `Celeste`
- **Contraseña:** `Interact2`

## 📁 Estructura del Proyecto

```
anyta-lingerie-store/
├── index.html          # Página principal del marketplace
├── script.js           # Lógica de la aplicación y panel admin
├── styles.css          # Estilos y diseño responsive
├── README.md           # Documentación del proyecto
├── .gitignore          # Archivos a ignorar en Git
├── logo.svg            # Logo de la marca
├── hero-image.jpg      # Imagen principal del hero
├── hero-background.svg # Fondo del hero section
├── demo-product.svg    # Imagen de demostración
└── placeholder.svg     # Imagen placeholder para productos
```

## 🚀 Subir a GitHub

### Opción 1: Crear repositorio desde GitHub.com
1. Ve a [GitHub.com](https://github.com) e inicia sesión
2. Haz clic en el botón "New" o "+" para crear un nuevo repositorio
3. Nombra el repositorio: `anyta-lingerie-store`
4. Añade la descripción: "E-commerce marketplace para lencería con panel de administración y gestión dinámica de categorías"
5. Marca como público (o privado si prefieres)
6. **NO** inicialices con README (ya tienes uno)
7. Haz clic en "Create repository"

### Opción 2: Comandos Git para subir el proyecto
Ejecuta estos comandos en la terminal desde la carpeta del proyecto:

```bash
# Inicializar repositorio Git
git init

# Añadir todos los archivos
git add .

# Hacer el primer commit
git commit -m "Initial commit: Anyta Lingerie Marketplace with dynamic categories and custom pricing"

# Conectar con tu repositorio de GitHub (reemplaza TU_USUARIO)
git remote add origin https://github.com/TU_USUARIO/anyta-lingerie-store.git

# Subir los archivos
git branch -M main
git push -u origin main
```

### Opción 3: GitHub Desktop
1. Descarga [GitHub Desktop](https://desktop.github.com/)
2. Abre GitHub Desktop e inicia sesión
3. Haz clic en "Add an Existing Repository from your Hard Drive"
4. Selecciona la carpeta del proyecto
5. Haz clic en "Publish repository" y sigue las instrucciones

## 🚀 Cómo Usar

### Instalación
1. Descarga todos los archivos en una carpeta
2. Abre `index.html` en tu navegador web
3. ¡Listo! El marketplace está funcionando

### Para Clientes
1. **Navegar productos:** Explora el catálogo en la sección "Productos"
2. **Buscar:** Usa la barra de búsqueda en el header
3. **Filtrar:** Utiliza los filtros por categoría y precio
4. **Añadir al carrito:** Selecciona una talla y haz clic en "Añadir al Carrito"
5. **Ver carrito:** Haz clic en el ícono del carrito para revisar tu pedido
6. **Finalizar compra:** Usa el botón "Finalizar Compra" en el carrito

### Para Administradores
1. **Acceder:** Haz clic en "Admin" en el header
2. **Iniciar sesión:** Usa las credenciales proporcionadas
3. **Gestionar productos:**
   - Ver todos los productos en la pestaña "Productos"
   - Añadir nuevos productos con el botón "Añadir Producto"
   - Configurar precios con sistema automático (precio compra + margen = precio final)
   - Gestionar tallas con opciones predefinidas o personalizadas
4. **Gestionar categorías:**
   - Acceder a la pestaña "Categorías"
   - Añadir nuevas categorías con nombre, descripción e imagen
   - Editar categorías existentes
   - Eliminar categorías (con protección si tienen productos asociados)
   - Auto-generación de slugs para URLs amigables
5. **Ver estadísticas:**
   - Acceder a métricas de productos y ventas
   - Monitorear el inventario
   - Editar productos existentes con el botón "Editar"
   - Eliminar productos con el botón "Eliminar"
4. **Ver estadísticas:** Revisa las métricas en la pestaña "Estadísticas"

## 📁 Estructura de Archivos

```
pagina lenceria/
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── script.js           # Funcionalidad JavaScript
├── logo.svg            # Logo de la marca
├── hero-image.jpg      # Imagen principal
└── README.md           # Este archivo
```

## 🎨 Categorías de Productos

1. **Conjuntos** - Sets completos de lencería
2. **Bodys** - Piezas únicas tipo body
3. **Lencería Nocturna** - Camisones y batas
4. **Accesorios** - Medias, ligueros y complementos

## 💾 Almacenamiento de Datos

El marketplace utiliza `localStorage` del navegador para:
- Guardar productos añadidos por el administrador
- Mantener el carrito de compras entre sesiones
- Persistir configuraciones del usuario

## 🛠️ Tecnologías Utilizadas

- **HTML5** - Estructura semántica y accesible
- **CSS3** - Estilos modernos con gradientes, animaciones y Grid/Flexbox
- **JavaScript ES6+** - Lógica de aplicación con módulos y funciones avanzadas
- **LocalStorage** - Persistencia de datos del lado del cliente
- **Responsive Design** - Compatible con todos los dispositivos
- **SVG** - Iconos y gráficos vectoriales escalables
- **Progressive Enhancement** - Funcionalidad básica sin JavaScript
- **Font Awesome** - Iconografía
- **Google Fonts** - Tipografía Poppins
- **Unsplash** - Imágenes de ejemplo

## 🔧 Características Técnicas Avanzadas

### Sistema de Gestión de Categorías
- **Auto-generación de slugs** para URLs amigables
- **Validación de unicidad** de nombres y slugs
- **Conteo automático** de productos por categoría
- **Protección contra eliminación** de categorías con productos
- **Sincronización automática** de selectores y filtros

### Sistema de Precios Inteligente
- **Cálculo automático** de precio final (precio compra + margen)
- **Validación de márgenes** y precios mínimos
- **Formateo automático** de moneda
- **Actualización en tiempo real** de precios

### Gestión de Tallas Personalizable
- **Presets predefinidos** (XS, S, M, L, XL, XXL)
- **Tallas personalizadas** con validación
- **Gestión dinámica** de opciones disponibles
- **Interfaz intuitiva** para selección múltiple

### Validaciones y Seguridad
- **Validación de formularios** en tiempo real
- **Sanitización de datos** de entrada
- **Prevención de duplicados** en categorías y productos
- **Manejo de errores** robusto
- **Autenticación segura** para panel admin

## 📱 Compatibilidad

- ✅ Chrome (recomendado)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Dispositivos móviles

## 🎯 Funcionalidades Destacadas

### Sistema de Carrito Inteligente
- Agrupa productos por ID y talla
- Actualización en tiempo real
- Cálculo automático de totales
- Persistencia entre sesiones

### Panel de Administración Avanzado
- Interfaz intuitiva con pestañas
- Formularios validados
- Gestión completa de productos
- Estadísticas en tiempo real

### Diseño Responsive
- Adaptación automática a diferentes pantallas
- Navegación optimizada para móviles
- Imágenes responsivas
- Tipografía escalable

## 🔧 Personalización

### Cambiar Colores
Edita las variables CSS en `styles.css`:
```css
:root {
  --primary-color: #ff6b9d;
  --secondary-color: #c44569;
  --accent-color: #ff4757;
}
```

### Añadir Nuevas Categorías
1. Actualiza el array de categorías en `script.js`
2. Añade las opciones en los selectores HTML
3. Crea las tarjetas de categoría correspondientes

### Modificar Productos de Ejemplo
Edita el array `sampleProducts` en `script.js` con tus propios productos.

## 📞 Soporte

Para soporte técnico o consultas sobre el marketplace:
- Email: info@celestelenceria.com
- Teléfono: +1 234 567 8900

## 📄 Licencia

© 2024 Anyta Lingerie. Todos los derechos reservados.

---

**¡Gracias por elegir Anyta Lingerie!** ✨

*Elegancia y sensualidad en cada prenda*