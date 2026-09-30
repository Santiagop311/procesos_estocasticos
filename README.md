# Laboratorio Interactivo de Procesos Estocásticos

Aplicación web desarrollada con React, TypeScript y Vite para estudiar, visualizar y resolver ejercicios de procesos estocásticos aplicados a ingeniería de software.

El proyecto no es una página informativa tradicional. Es un laboratorio interactivo que permite:

- Estudiar los temas del taller mediante explicaciones visuales.
- Pegar enunciados de ejercicios y obtener una solución guiada.
- Detectar el tipo de problema según el texto ingresado.
- Extraer datos numéricos o interpretar ejercicios por conteo.
- Mostrar el paso a paso de forma dinámica.
- Visualizar diagramas de Venn, árboles de probabilidad, barras y simulaciones.
- Ejecutar una simulación Monte Carlo para observar la diferencia entre probabilidad teórica y experimental.

## Tecnologías

- React 19
- TypeScript
- Vite
- CSS moderno
- SVG para visualizaciones matemáticas
- JavaScript para simulación y análisis de enunciados
- Oxlint para revisión de calidad

## Requisitos

Antes de ejecutar el proyecto se debe tener instalado:

- Node.js 20 o superior
- npm 9 o superior
- Un navegador moderno

Verificar instalación:

```bash
node -v
npm -v
```

## Instalación del proyecto

Clonar o ubicar el proyecto en la carpeta correspondiente. En este caso:

```bash
cd /home/parra/Documentos/Procesos_estocasticos
```

Instalar todas las dependencias del proyecto:

```bash
npm install
```

Este comando instala las dependencias declaradas en `package.json`, incluyendo React, React DOM, Vite, TypeScript y Oxlint.

## Ejecutar en desarrollo

Iniciar el servidor local:

```bash
npm run dev
```

Abrir en el navegador:

```txt
http://localhost:5173/
```

Si se desea abrir la aplicación desde otro dispositivo conectado a la misma red:

```bash
npm run dev -- --host 0.0.0.0
```

## Compilar para producción

Generar la versión final optimizada:

```bash
npm run build
```

La salida se genera en la carpeta:

```txt
dist/
```

## Previsualizar la versión compilada

Después de ejecutar `npm run build`, se puede probar la versión de producción con:

```bash
npm run preview
```

## Revisar calidad del código

Ejecutar el linter:

```bash
npm run lint
```

## Scripts disponibles

```json
{
  "dev": "vite",
  "build": "tsc -b && vite build",
  "lint": "oxlint",
  "preview": "vite preview"
}
```

## Estructura principal

```txt
src/
  App.tsx       Componentes, lógica de resolución, simulación y visualizaciones
  App.css       Estilos principales de la interfaz
  index.css     Variables globales, tipografía y estilos base

public/
  favicon.svg
  icons.svg

dist/
  Carpeta generada al compilar el proyecto
```

## Funcionamiento general

La aplicación tiene tres bloques principales:

1. **Modo estudio**
   Presenta cada tema con una explicación corta y una visualización.

2. **Modo resolver**
   Permite seleccionar un tema y pegar un ejercicio del taller. La app detecta el modelo, extrae datos y muestra la solución paso a paso.

3. **Modo simulación**
   Ejecuta una simulación Monte Carlo para comparar una probabilidad teórica con resultados experimentales.

## Temas implementados

## Tema 1: Eventos deterministas y estocásticos

Un evento determinista es aquel cuyo resultado se conoce con certeza antes de realizarlo.

Un evento estocástico es aquel donde interviene azar o incertidumbre, por lo que no se puede conocer el resultado exacto antes de observarlo.

### Cómo lo resuelve la app

La aplicación analiza palabras y contexto del enunciado:

- Si el enunciado tiene condiciones fijas, físicas o completamente controladas, lo clasifica como determinista.
- Si el enunciado depende de azar, conteos futuros o comportamiento de personas, lo clasifica como estocástico.

### Ejemplo determinista

Enunciado:

```txt
Calcular la distancia que recorre un vehículo que avanza a una velocidad constante de 60 km/h durante exactamente 2 horas.
```

Resolución:

```txt
El resultado depende de una fórmula fija.
Distancia = velocidad x tiempo.
No hay azar.
Resultado: Determinista.
```

### Ejemplo estocástico

Enunciado:

```txt
Registrar el número de clientes que ingresarán a la cafetería de CIAF entre las 10:00 a.m. y las 11:00 a.m. un día martes.
```

Resolución:

```txt
El número de clientes depende del comportamiento futuro de las personas.
No se conoce el valor exacto antes de observarlo.
Resultado: Estocástico.
```

## Tema 2: Variables aleatorias

Una variable aleatoria asigna un valor numérico a un resultado de un fenómeno aleatorio.

Hay dos tipos principales:

- **Discreta:** se obtiene contando valores enteros.
- **Continua:** se obtiene midiendo valores dentro de un intervalo.

### Cómo lo resuelve la app

La app identifica si el enunciado habla de contar o medir.

Palabras asociadas a variable discreta:

- número
- cantidad
- computadores defectuosos
- llamadas
- respuestas correctas
- preguntas

Palabras asociadas a variable continua:

- estatura
- tiempo
- minutos
- metros
- exacta
- medir

### Ejemplo discreto

Enunciado:

```txt
Defina la variable X como el número de computadores defectuosos en un lote de 20 equipos.
```

Resolución:

```txt
La variable representa una cantidad contable.
Solo puede tomar valores enteros.
Posibles valores: 0, 1, 2, ..., 20.
Resultado: Variable aleatoria discreta.
```

### Ejemplo continuo

Enunciado:

```txt
Defina la variable Y como la estatura exacta en metros de un estudiante elegido al azar.
```

Resolución:

```txt
La variable representa una medición.
Puede tomar valores decimales dentro de un intervalo.
Resultado: Variable aleatoria continua.
```

## Tema 3: Regla de la adición

La regla de la adición calcula la probabilidad de que ocurra un evento A o un evento B.

### Eventos mutuamente excluyentes

No pueden ocurrir al mismo tiempo.

Fórmula:

```txt
P(A ∪ B) = P(A) + P(B)
```

### Eventos no excluyentes

Pueden ocurrir al mismo tiempo.

Fórmula:

```txt
P(A ∪ B) = P(A) + P(B) - P(A ∩ B)
```

### Cómo lo resuelve la app

La app soporta dos formas:

1. Probabilidades explícitas:

```txt
P(A) = 0.18
P(B) = 0.14
P(A ∩ B) = 0.06
```

2. Ejercicios por conteo, como dados, balotas, baraja o grupos de estudiantes.

### Ejemplo con probabilidades

Enunciado:

```txt
La probabilidad de alerta de acceso no autorizado es 0.18, la probabilidad de alerta de malware es 0.14 y la probabilidad de presentar ambas alertas es 0.06.
```

Resolución:

```txt
P(A) = 18%
P(B) = 14%
P(A ∩ B) = 6%
P(A ∪ B) = 18% + 14% - 6%
Resultado: 26%
```

### Ejemplo con dado

Enunciado:

```txt
Al lanzar un dado normal de 6 caras, ¿cuál es la probabilidad de obtener un 2 o un 5?
```

Resolución:

```txt
P(obtener 2) = 1/6
P(obtener 5) = 1/6
Los eventos son excluyentes porque no se puede obtener 2 y 5 al mismo tiempo.
P(2 o 5) = 1/6 + 1/6 = 2/6
Resultado: 33.33%
```

### Ejemplo con grupo de estudiantes

Enunciado:

```txt
En un grupo de 100 estudiantes, 60 estudian Programación, 40 estudian Matemáticas y 20 estudian ambas materias.
```

Resolución:

```txt
P(Programación) = 60/100 = 60%
P(Matemáticas) = 40/100 = 40%
P(Ambas) = 20/100 = 20%
P(Programación o Matemáticas) = 60% + 40% - 20%
Resultado: 80%
```

## Tema 4: Regla de la multiplicación e independencia

La regla de la multiplicación se usa cuando se desea calcular la probabilidad de que ocurran dos eventos al mismo tiempo.

Si los eventos son independientes:

```txt
P(A ∩ B) = P(A) x P(B)
```

### Cómo lo resuelve la app

La app detecta enunciados con expresiones como:

- ambos
- ambas
- independiente
- al mismo tiempo

Luego multiplica las probabilidades detectadas.

### Ejemplo

Enunciado:

```txt
La probabilidad de que una prueba unitaria se ejecute correctamente es 0.95 y la probabilidad de que una prueba de integración independiente también se ejecute correctamente es 0.90.
```

Resolución:

```txt
P(A) = 95%
P(B) = 90%
P(A ∩ B) = 95% x 90%
Resultado: 85.5%
```

## Tema 5: Probabilidad condicional

La probabilidad condicional calcula la probabilidad de que ocurra A sabiendo que B ya ocurrió.

Fórmula:

```txt
P(A|B) = P(A ∩ B) / P(B)
```

### Cómo lo resuelve la app

La app detecta expresiones como:

- dado que
- sabiendo que
- si se sabe

Luego toma:

```txt
P(B)
P(A ∩ B)
```

y calcula:

```txt
P(A|B)
```

### Ejemplo

Enunciado:

```txt
El 20% de los despliegues contiene cambios urgentes. El 8% de todos los despliegues contiene simultáneamente un cambio urgente y genera un error en producción.
```

Resolución:

```txt
P(Cambio urgente) = 20%
P(Cambio urgente ∩ Error) = 8%
P(Error | Cambio urgente) = 8% / 20%
Resultado: 40%
```

## Tema 6: Teorema de la probabilidad total

La probabilidad total permite calcular la probabilidad global de un evento sumando sus caminos posibles.

Fórmula:

```txt
P(B) = P(A1) x P(B|A1) + P(A2) x P(B|A2) + ...
```

### Cómo lo resuelve la app

La app interpreta los datos como ramas:

```txt
P(causa 1)
P(causa 2)
P(evento | causa 1)
P(evento | causa 2)
```

Luego calcula:

```txt
Camino 1 = P(causa 1) x P(evento | causa 1)
Camino 2 = P(causa 2) x P(evento | causa 2)
Total = Camino 1 + Camino 2
```

### Ejemplo

Enunciado:

```txt
El 60% de los módulos es frontend y el 40% es backend. La probabilidad de defecto en frontend es 0.07 y en backend es 0.12.
```

Resolución:

```txt
Camino frontend = 60% x 7% = 4.2%
Camino backend = 40% x 12% = 4.8%
P(defecto) = 4.2% + 4.8%
Resultado: 9%
```

## Tema 7: Teorema de Bayes

El Teorema de Bayes permite invertir una probabilidad condicional. Sirve para estimar la causa más probable dado que ya se observó un efecto.

Fórmula:

```txt
P(Ai|B) = [P(Ai) x P(B|Ai)] / P(B)
```

donde:

```txt
P(B) = probabilidad total del evento observado
```

### Cómo lo resuelve la app

La app reconoce ejercicios tipo:

- producto defectuoso y máquina origen
- prueba médica positiva
- filtro de spam
- jornada de estudiante dado que trabaja
- reporte con técnico en campo y zona origen
- defecto de software y equipo probable

La app identifica:

```txt
P(causa 1)
P(causa 2)
P(evento | causa 1)
P(evento | causa 2)
causa preguntada
```

Luego calcula:

```txt
P(evento) = P(causa 1) x P(evento | causa 1) + P(causa 2) x P(evento | causa 2)
P(causa preguntada | evento) = camino de la causa preguntada / P(evento)
```

### Ejemplo: prueba médica

Enunciado:

```txt
El 1% de la población padece la enfermedad. Si una persona tiene la enfermedad, la prueba da positiva el 95% de las veces. Si NO tiene la enfermedad, la prueba da positiva el 2% de las veces.
```

Resolución:

```txt
P(Enfermo) = 1%
P(No enfermo) = 99%
P(Positivo | Enfermo) = 95%
P(Positivo | No enfermo) = 2%

P(Positivo) = (1% x 95%) + (99% x 2%)
P(Positivo) = 0.95% + 1.98%
P(Positivo) = 2.93%

P(Enfermo | Positivo) = 0.95% / 2.93%
Resultado: 32.42%
```

### Ejemplo: Zona Norte

Enunciado:

```txt
El 60% de los reportes provienen de la Zona Norte y el 40% de la Zona Sur. La probabilidad de que una falla requiera técnico en campo es del 10% para la Zona Norte y del 30% para la Zona Sur.
```

Resolución:

```txt
P(Norte) = 60%
P(Sur) = 40%
P(Técnico | Norte) = 10%
P(Técnico | Sur) = 30%

P(Técnico) = (60% x 10%) + (40% x 30%)
P(Técnico) = 6% + 12%
P(Técnico) = 18%

P(Norte | Técnico) = 6% / 18%
Resultado: 33.33%
```

## Modo resolver

En el modo resolver se muestran siete tarjetas, una por tema:

```txt
Tema 1: Eventos
Tema 2: Variables
Tema 3: Adición
Tema 4: Multiplicación
Tema 5: Condicional
Tema 6: Probabilidad total
Tema 7: Bayes
```

El usuario selecciona el tema, pega el enunciado y la app realiza:

1. Detección del modelo.
2. Extracción de datos o criterios.
3. Construcción del procedimiento.
4. Visualización dinámica del paso a paso.
5. Presentación del resultado final.

## Paso a paso dinámico

El resultado no se muestra de golpe. La aplicación revela los pasos progresivamente:

```txt
Paso 1 de 4
Paso 2 de 4
Paso 3 de 4
Paso 4 de 4
Resultado final
```

También incluye un botón:

```txt
Reproducir explicación
```

Esto permite volver a ver la resolución como una explicación guiada.

## Visualizaciones

La aplicación usa distintas visualizaciones según el tema:

- Tema 1: tarjetas comparativas entre determinista y estocástico.
- Tema 2: tarjetas comparativas entre discreta y continua.
- Tema 3: diagrama de Venn.
- Tema 4: barras de probabilidad.
- Tema 5: barras de condición, intersección y resultado.
- Tema 6: árbol de caminos.
- Tema 7: árbol de Bayes.

## Simulación Monte Carlo

El modo simulación permite elegir:

- Probabilidad real del evento.
- Número de intentos.

Al ejecutar, la app genera intentos aleatorios y compara:

```txt
Probabilidad teórica
Probabilidad simulada
Diferencia
```

Ejemplo:

```txt
Probabilidad teórica: 53%
Intentos: 500
Resultado simulado: cercano a 53%, pero no necesariamente exacto
```

Esto demuestra que en procesos estocásticos los resultados individuales son inciertos, pero el comportamiento promedio puede aproximarse mediante simulación.

## Cómo presentar el proyecto

Una forma recomendada de presentarlo:

1. Explicar que el proyecto convierte el taller en una herramienta interactiva.
2. Mostrar el modo estudio para explicar visualmente los temas.
3. Ir al modo resolver y pegar ejercicios de distintos temas.
4. Mostrar que el sistema reconoce si el ejercicio es de clasificación, conteo, probabilidad total o Bayes.
5. Reproducir el paso a paso dinámico.
6. Mostrar el diagrama o gráfico generado.
7. Finalizar con Monte Carlo para demostrar simulación estocástica en código.

Frase útil para la exposición:

```txt
Este proyecto no solo muestra teoría; convierte los conceptos de procesos estocásticos en algoritmos, visualizaciones y simulaciones interactivas.
```

## Limitaciones actuales

El analizador de enunciados usa reglas, palabras clave y extracción de números. Está ajustado para ejercicios del taller y enunciados similares, pero no es un sistema de inteligencia artificial general.

Puede fallar si:

- El enunciado cambia demasiado la redacción.
- Los datos aparecen en un orden muy distinto.
- Se mezclan varios temas en un mismo texto.
- Se omiten datos necesarios para aplicar la fórmula.

## Mejoras futuras

Posibles mejoras:

- Agregar más patrones de reconocimiento.
- Permitir corrección manual de datos extraídos.
- Exportar la solución en PDF.
- Guardar historial de ejercicios resueltos.
- Agregar pruebas unitarias para cada tipo de ejercicio.
- Usar procesamiento de lenguaje natural para interpretar enunciados más complejos.

## Estado del proyecto

Comandos verificados:

```bash
npm run build
npm run lint
```

Ambos comandos deben ejecutarse correctamente antes de entregar o desplegar el proyecto.
