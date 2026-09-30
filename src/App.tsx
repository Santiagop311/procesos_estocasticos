import { useEffect, useMemo, useState } from 'react'
import './App.css'

type TopicId = 'clasificacion' | 'variables' | 'adicion' | 'multiplicacion' | 'condicional' | 'total' | 'bayes'

type Topic = {
  id: TopicId
  title: string
  short: string
  devUse: string
  formula: string
}

type SolverKind = 'clasificacion' | 'variables' | 'bayes' | 'total' | 'adicion' | 'multiplicacion' | 'condicional'

const topics: Topic[] = [
  {
    id: 'clasificacion',
    title: 'Eventos deterministas y estocásticos',
    short: 'Detecta si hay certeza total o si aparece incertidumbre.',
    devUse: 'Sirve para diferenciar reglas exactas del sistema y escenarios con riesgo, tráfico, errores o usuarios reales.',
    formula: 'Certeza vs. azar',
  },
  {
    id: 'variables',
    title: 'Variables aleatorias',
    short: 'Convierte un fenómeno aleatorio en un valor que se puede contar o medir.',
    devUse: 'Modela defectos, llamadas, tiempos de espera, respuestas correctas y métricas de operación.',
    formula: 'Discreta = contar | Continua = medir',
  },
  {
    id: 'adicion',
    title: 'Regla de la adición',
    short: 'Calcula la probabilidad de que ocurra A o B.',
    devUse: 'Ayuda a estimar errores, alertas o preferencias cuando varios eventos pueden activar un caso.',
    formula: 'P(A ∪ B) = P(A) + P(B) - P(A ∩ B)',
  },
  {
    id: 'multiplicacion',
    title: 'Multiplicación e independencia',
    short: 'Calcula la probabilidad de que ocurran A y B a la vez.',
    devUse: 'Ideal para pruebas independientes, servicios que fallan juntos o respuestas correctas consecutivas.',
    formula: 'P(A ∩ B) = P(A) × P(B)',
  },
  {
    id: 'condicional',
    title: 'Probabilidad condicional',
    short: 'Recalcula la probabilidad sabiendo que algo ya ocurrió.',
    devUse: 'Permite responder preguntas tipo: dado que hubo cambio urgente, ¿qué tan probable es un error?',
    formula: 'P(A|B) = P(A ∩ B) / P(B)',
  },
  {
    id: 'total',
    title: 'Probabilidad total',
    short: 'Suma caminos posibles para obtener una probabilidad global.',
    devUse: 'Une fuentes, módulos, máquinas o jornadas para estimar un resultado general.',
    formula: 'P(B) = Σ P(Ai) · P(B|Ai)',
  },
  {
    id: 'bayes',
    title: 'Teorema de Bayes',
    short: 'Invierte el camino: del efecto observado a la causa más probable.',
    devUse: 'Muy útil para diagnóstico, defectos, spam, pruebas médicas y análisis de causa raíz.',
    formula: 'P(Ai|B) = P(Ai) · P(B|Ai) / P(B)',
  },
]

const classificationCases = [
  { text: 'El agua hierve a 100 °C al nivel del mar', answer: 'Determinista', reason: 'Bajo esas condiciones físicas el resultado esperado se conoce antes.' },
  { text: 'Obtener un número mayor a 4 al lanzar un dado', answer: 'Estocástico', reason: 'El resultado depende del azar; solo sabemos que la probabilidad es 2/6.' },
  { text: 'Clientes que entran a la cafetería entre 10 y 11 a.m.', answer: 'Estocástico', reason: 'No se puede conocer el número exacto antes de observarlo.' },
  { text: 'Recorrer 120 km a 60 km/h durante 2 horas', answer: 'Determinista', reason: 'La distancia se calcula con una relación fija: velocidad por tiempo.' },
]

const variableCases = [
  { label: 'Computadores defectuosos en 20 equipos', type: 'Discreta', range: '0, 1, 2, ... 20', reason: 'Se cuenta una cantidad entera.' },
  { label: 'Estatura exacta de un estudiante', type: 'Continua', range: 'Un intervalo de metros', reason: 'Se mide y puede tener decimales.' },
  { label: 'Llamadas recibidas en una hora', type: 'Discreta', range: '0, 1, 2, 3...', reason: 'Se cuentan llamadas.' },
  { label: 'Tiempo de espera del bus', type: 'Continua', range: 'Minutos con decimales', reason: 'Se mide una duración.' },
]

const exerciseBank = [
  {
    kind: 'bayes' as const,
    topicLabel: 'Tema 7 · Teorema de Bayes',
    title: 'Origen probable de un defecto de software',
    statement: 'Una empresa desarrolla el 70% de sus módulos mediante el equipo A y el 30% mediante el equipo B. La probabilidad de que un módulo del equipo A contenga un defecto es 0.04, y para el equipo B es 0.10. Si se selecciona un módulo y se descubre que tiene un defecto, determine la probabilidad de que haya sido desarrollado por el equipo B.',
    params: { a: 0.7, b: 0.3, givenA: 0.04, givenB: 0.1, target: 'B', event: 'defecto' },
  },
  {
    kind: 'bayes' as const,
    topicLabel: 'Tema 7 · Teorema de Bayes',
    title: 'Producto defectuoso de Máquina 2',
    statement: 'Usando los datos del Ejercicio 6.1: Máquina 1 produce el 60% con 2% defectuosos; Máquina 2 produce el 40% con 5% defectuosos; Probabilidad total de defectuoso = 3.2%. Se inspecciona un producto al azar y resulta estar DEFECTUOSO. ¿Cuál es la probabilidad de que haya sido fabricado por la MÁQUINA 2?',
    params: { a: 0.6, b: 0.4, givenA: 0.02, givenB: 0.05, target: 'B', event: 'defectuoso' },
  },
  {
    kind: 'bayes' as const,
    topicLabel: 'Tema 7 · Teorema de Bayes',
    title: 'Prueba médica positiva',
    statement: 'El 1% de la población padece la enfermedad. Si una persona tiene la enfermedad, la prueba da positiva el 95% de las veces. Si NO tiene la enfermedad, la prueba da positiva sólo el 2% de las veces. Si a un paciente la prueba le da POSITIVA, ¿cuál es la probabilidad real de que esté ENFERMO?',
    params: { a: 0.01, b: 0.99, givenA: 0.95, givenB: 0.02, target: 'A', event: 'positivo' },
  },
  {
    kind: 'bayes' as const,
    topicLabel: 'Tema 7 · Teorema de Bayes',
    title: 'Correo con palabra oferta',
    statement: 'Un filtro de correo clasifica el email en Spam (20% del total) y Deseado (80%). El 90% de los correos Spam contienen la palabra Oferta, mientras que solo el 5% de los correos deseados contiene esa palabra. Si llega un correo que contiene la palabra Oferta, ¿cuál es la probabilidad de que sea SPAM?',
    params: { a: 0.2, b: 0.8, givenA: 0.9, givenB: 0.05, target: 'A', event: 'oferta' },
  },
  {
    kind: 'bayes' as const,
    topicLabel: 'Tema 7 · Teorema de Bayes',
    title: 'Trabaja y pertenece a jornada diurna',
    statement: 'En el Ejercicio 6.2: 70% Nocturna con 80% empleados; 30% Diurna con 20% empleados; P(Trabaja Total) = 62%. Si se selecciona un estudiante al azar y resulta que TRABAJA, ¿cuál es la probabilidad de que pertenezca a la JORNADA DIURNA?',
    params: { a: 0.7, b: 0.3, givenA: 0.8, givenB: 0.2, target: 'B', event: 'trabaja' },
  },
  {
    kind: 'bayes' as const,
    topicLabel: 'Tema 7 · Teorema de Bayes',
    title: 'Técnico de campo y Zona Norte',
    statement: 'En una central telefónica, el 60% de los reportes provienen de la Zona Norte y el 40% de la Zona Sur. La probabilidad de que una falla requiera técnico en campo es del 10% para la Zona Norte y del 30% para la Zona Sur. Se recibe un reporte que SÍ requiere técnico en campo. ¿Cuál es la probabilidad de que provenga de la ZONA NORTE?',
    params: { a: 0.6, b: 0.4, givenA: 0.1, givenB: 0.3, target: 'A', event: 'tecnico' },
  },
  {
    kind: 'total' as const,
    topicLabel: 'Tema 6 · Probabilidad total',
    title: 'Defecto según tipo de módulo',
    statement: 'El 60% de los módulos es frontend y el 40% es backend. La probabilidad de defecto en frontend es 0.07 y en backend es 0.12. Determine la probabilidad total de seleccionar un módulo con defecto.',
    params: { a: 0.6, b: 0.4, givenA: 0.07, givenB: 0.12, event: 'defecto' },
  },
  {
    kind: 'adicion' as const,
    topicLabel: 'Tema 3 · Adición excluyente',
    title: 'Selección de tipo de error',
    statement: 'En una revisión de código, un sistema registra que un error crítico puede clasificarse únicamente como error de sintaxis o como error de ejecución. La probabilidad de seleccionar al azar un error de sintaxis es 0.28 y la de seleccionar un error de ejecución es 0.17. Como un mismo error no puede pertenecer simultáneamente a ambas categorías, determine la probabilidad de que sea de sintaxis o de ejecución.',
    params: { a: 0.28, b: 0.17, intersection: 0 },
  },
  {
    kind: 'adicion' as const,
    topicLabel: 'Tema 3 · Adición no excluyente',
    title: 'Incidentes de seguridad',
    statement: 'La probabilidad de alerta de acceso no autorizado es 0.18, la probabilidad de alerta de malware es 0.14 y la probabilidad de presentar ambas alertas es 0.06. Calcule la probabilidad de al menos una alerta.',
    params: { a: 0.18, b: 0.14, intersection: 0.06 },
  },
  {
    kind: 'multiplicacion' as const,
    topicLabel: 'Tema 4 · Multiplicación',
    title: 'Pruebas automáticas independientes',
    statement: 'La probabilidad de que una prueba unitaria se ejecute correctamente es 0.95 y la probabilidad de que una prueba de integración independiente también se ejecute correctamente es 0.90. Determine la probabilidad de que ambas se ejecuten correctamente.',
    params: { a: 0.95, b: 0.9 },
  },
  {
    kind: 'condicional' as const,
    topicLabel: 'Tema 5 · Probabilidad condicional',
    title: 'Error dado cambio urgente',
    statement: 'El 20% de los despliegues contiene cambios urgentes. El 8% de todos los despliegues contiene simultáneamente un cambio urgente y genera un error en producción. Calcule la probabilidad de que genere error dado que contiene cambio urgente.',
    params: { base: 0.2, intersection: 0.08 },
  },
]

const solverTopics = [
  {
    kind: 'clasificacion' as const,
    topicLabel: 'Tema 1 · Eventos',
    title: 'Eventos',
    helper: 'Deterministas y estocásticos',
    statement: 'Un docente lanza un dado corriente de 6 caras sobre el escritorio. Identifique si obtener un número mayor a 4 es un evento determinista o estocástico.',
  },
  {
    kind: 'variables' as const,
    topicLabel: 'Tema 2 · Variables aleatorias',
    title: 'Variables',
    helper: 'Discretas y continuas',
    statement: "Defina la variable X como el número de computadores defectuosos en un lote de 20 equipos en el laboratorio. Identifique el tipo de variable aleatoria y sus posibles valores.",
  },
  {
    kind: 'adicion' as const,
    topicLabel: 'Tema 3 · Regla de adición',
    title: 'Adición',
    helper: 'Eventos excluyentes y no excluyentes',
    statement: 'La probabilidad de alerta de acceso no autorizado es 0.18, la probabilidad de alerta de malware es 0.14 y la probabilidad de presentar ambas alertas es 0.06. Calcule la probabilidad de al menos una alerta.',
  },
  {
    kind: 'multiplicacion' as const,
    topicLabel: 'Tema 4 · Multiplicación',
    title: 'Multiplicación',
    helper: 'Eventos independientes que ocurren juntos',
    statement: 'La probabilidad de que una prueba unitaria se ejecute correctamente es 0.95 y la probabilidad de que una prueba de integración independiente también se ejecute correctamente es 0.90. Determine la probabilidad de que ambas se ejecuten correctamente.',
  },
  {
    kind: 'condicional' as const,
    topicLabel: 'Tema 5 · Probabilidad condicional',
    title: 'Condicional',
    helper: 'Probabilidad de A sabiendo que B ocurrió',
    statement: 'El 20% de los despliegues contiene cambios urgentes. El 8% de todos los despliegues contiene simultáneamente un cambio urgente y genera un error en producción. Calcule la probabilidad de que genere error dado que contiene cambio urgente.',
  },
  {
    kind: 'total' as const,
    topicLabel: 'Tema 6 · Probabilidad total',
    title: 'Probabilidad total',
    helper: 'Suma de caminos o particiones',
    statement: 'El 60% de los módulos es frontend y el 40% es backend. La probabilidad de defecto en frontend es 0.07 y en backend es 0.12. Determine la probabilidad total de seleccionar un módulo con defecto.',
  },
  {
    kind: 'bayes' as const,
    topicLabel: 'Tema 7 · Teorema de Bayes',
    title: 'Bayes',
    helper: 'Causa más probable dado un evento observado',
    statement: 'En una central telefónica, el 60% de los reportes provienen de la Zona Norte y el 40% de la Zona Sur. La probabilidad de que una falla requiera técnico en campo es del 10% para la Zona Norte y del 30% para la Zona Sur. Se recibe un reporte que SÍ requiere técnico en campo. ¿Cuál es la probabilidad de que provenga de la ZONA NORTE?',
  },
]

function pct(value: number) {
  if (!Number.isFinite(value)) return '0%'
  return `${(value * 100).toFixed(value * 100 < 10 ? 2 : 1)}%`
}

function clampProbability(value: number) {
  if (Number.isNaN(value)) return 0
  return Math.min(Math.max(value, 0), 1)
}

function extractNumbers(text: string) {
  const matches = text.match(/\d+(?:[.,]\d+)?\s*%?|\b0[.,]\d+\b/g) ?? []
  return matches.flatMap((raw) => {
    const clean = raw.replace(',', '.').trim()
    const numeric = Number.parseFloat(clean)
    if (raw.includes('%')) return [numeric / 100]
    if (clean.startsWith('0.')) return [numeric]
    return []
  })
}

function extractCountNumbers(text: string) {
  const matches = text.match(/\d+(?:[.,]\d+)?\s*%?/g) ?? []
  return matches.flatMap((raw) => {
    if (raw.includes('%')) return []
    if (raw.includes('.') || raw.includes(',')) return []
    return [Number.parseInt(raw, 10)]
  })
}

function detectKind(text: string): SolverKind {
  const lower = text.toLowerCase()
  if (lower.includes('variable') || lower.includes('clasifíquela') || lower.includes('clasifiquela') || lower.includes('tipo de variable')) return 'variables'
  if (!lower.includes('probabilidad') && (lower.includes('determinista') || lower.includes('estocástico') || lower.includes('estocastico') || lower.includes('identifique si') || lower.includes('determinar si') || lower.includes('clientes que ingresarán') || lower.includes('clientes que ingresaran') || lower.includes('cafetería') || lower.includes('cafeteria'))) return 'clasificacion'
  if (lower.includes('falso positivo') || lower.includes('prueba positiva') || lower.includes('prueba da positiva')) return 'bayes'
  if (lower.includes('spam') || lower.includes('oferta') || lower.includes('zona norte') || lower.includes('zona sur') || lower.includes('técnico') || lower.includes('tecnico')) return 'bayes'
  if (lower.includes('bayes') || lower.includes('provenga') || lower.includes('haya sido') || lower.includes('pertenezca')) return 'bayes'
  if (lower.includes('defecto') && lower.includes('desarrollado') && lower.includes('si se')) return 'bayes'
  if (lower.includes('al menos una') || lower.includes(' al menos uno') || lower.includes(' o ') || lower.includes(' o\n') || lower.includes('o matemáticas') || lower.includes('o matematicas') || lower.includes('simultáneamente a ambas categorías')) return 'adicion'
  if (lower.includes('dado que') || lower.includes('si se sabe') || lower.includes('sabiendo')) return 'condicional'
  if (lower.includes('probabilidad total') || lower.includes('global') || lower.includes('general')) return 'total'
  if (lower.includes('ambas') || lower.includes('ambos') || lower.includes('independiente') || lower.includes('simultáneamente') || lower.includes('simultaneamente') || lower.includes(' y ')) return 'multiplicacion'
  return 'adicion'
}

function inferAdditionValues(text: string, values: number[]) {
  if (values.length > 0) return values

  const lower = text.toLowerCase()
  const counts = extractCountNumbers(text)

  if (lower.includes('dado') && lower.includes('caras')) {
    const total = counts.find((value) => value >= 4) ?? 6
    const outcomes = counts.filter((value) => value > 0 && value <= total && value !== total)
    const uniqueOutcomes = new Set(outcomes)
    const favorable = uniqueOutcomes.size || 1
    if (favorable === 2) return [1 / total, 1 / total, 0]
    return [favorable / total, 0, 0]
  }

  if (lower.includes('balota') && lower.includes('par') && lower.includes('mayor que')) {
    const total = counts[0] ?? 10
    const threshold = counts[counts.length - 1] ?? 7
    const universe = Array.from({ length: total }, (_, index) => index + 1)
    const even = universe.filter((value) => value % 2 === 0)
    const greater = universe.filter((value) => value > threshold)
    const intersection = even.filter((value) => value > threshold)
    return [even.length / total, greater.length / total, intersection.length / total]
  }

  if (lower.includes('baraja') && lower.includes('oros') && lower.includes('copas')) {
    const total = counts.find((value) => value >= 40) ?? 40
    const suitProbability = (total / 4) / total
    return [suitProbability, suitProbability, 0]
  }

  if (lower.includes('estudiantes') && lower.includes('ambas')) {
    const [total = 1, first = 0, second = 0, both = 0] = counts
    return [first / total, second / total, both / total]
  }

  if (lower.includes('grupo') && lower.includes('estudian')) {
    const [total = 1, first = 0, second = 0, both = 0] = counts
    return [first / total, second / total, both / total]
  }

  if (lower.includes('usuarios') || lower.includes('biblioteca')) {
    const [total = 1, first = 0, second = 0] = counts
    const intersection = lower.includes('ningún') || lower.includes('ningun') ? 0 : counts[3] ?? 0
    return [first / total, second / total, intersection / total]
  }

  return values
}

function inferMultiplicationValues(text: string, values: number[]) {
  if (values.length > 0) return values

  const lower = text.toLowerCase()
  const counts = extractCountNumbers(text)

  if (lower.includes('moneda') && lower.includes('dado')) {
    const diceFaces = counts.find((value) => value >= 4) ?? 6
    return [1 / 2, 1 / diceFaces]
  }

  if (lower.includes('preguntas') && lower.includes('opciones')) {
    const optionMatch = lower.match(/(\d+)\s+opciones/)
    const options = optionMatch ? Number.parseInt(optionMatch[1], 10) : Math.max(...counts, 4)
    return [1 / options, 1 / options]
  }

  if (lower.includes('urna') && lower.includes('rojas') && lower.includes('reemplazo')) {
    const red = counts[0] ?? 0
    const blue = counts[1] ?? 0
    const total = red + blue || 1
    return [red / total, red / total]
  }

  return values
}

function getSolverValues(kind: SolverKind, text: string) {
  const values = extractNumbers(text)
  if (kind === 'adicion') return inferAdditionValues(text, values)
  if (kind === 'multiplicacion') return inferMultiplicationValues(text, values)
  return values
}

function inferEventClassification(text: string) {
  const lower = text.toLowerCase()
  const deterministicSignals = ['100 °c', '100°c', 'nivel del mar', 'perfectas condiciones', 'conectado a la energía', 'conectado a la energia', 'velocidad constante', 'exactamente', 'distancia que recorre']
  const stochasticSignals = ['dado', 'azar', 'clientes', 'ingresarán', 'ingresaran', 'número de clientes', 'numero de clientes', 'al azar']
  const deterministic = deterministicSignals.some((signal) => lower.includes(signal))
  const stochastic = stochasticSignals.some((signal) => lower.includes(signal))

  if (deterministic && !stochastic) {
    return {
      label: 'Determinista',
      steps: [
        'Se revisa si el resultado se conoce antes de ejecutar el fenómeno.',
        'El enunciado usa condiciones fijas o controladas.',
        'No depende del azar, por eso se clasifica como determinista.',
      ],
    }
  }

  return {
    label: 'Estocástico',
    steps: [
      'Se revisa si hay incertidumbre sobre el resultado exacto.',
      'El enunciado depende de azar, conteo futuro o comportamiento no controlado.',
      'No se puede saber el resultado exacto antes de observarlo, por eso es estocástico.',
    ],
  }
}

function inferVariableClassification(text: string) {
  const lower = text.toLowerCase()
  const counts = extractCountNumbers(text)
  const continuousSignals = ['estatura', 'exacta', 'metros', 'tiempo', 'espera', 'minutos', 'medir']
  const discreteSignals = ['número', 'numero', 'cantidad', 'computadores defectuosos', 'llamadas', 'respuestas correctas', 'preguntas', 'contar']
  const isContinuous = continuousSignals.some((signal) => lower.includes(signal)) && !lower.includes('respuestas correctas')
  const maxValue = counts.find((value) => value > 1)
  const range = isContinuous ? 'Valores dentro de un intervalo continuo' : maxValue ? `0, 1, 2, ... ${maxValue}` : '0, 1, 2, 3...'
  const label = isContinuous ? 'Continua' : discreteSignals.some((signal) => lower.includes(signal)) ? 'Discreta' : 'Discreta'

  return {
    label,
    steps: [
      'Se identifica si la variable se obtiene contando o midiendo.',
      label === 'Continua' ? 'El enunciado describe una medición que puede tomar decimales.' : 'El enunciado describe una cantidad que se cuenta en valores enteros.',
      `Clasificación: variable aleatoria ${label.toLowerCase()}. Posibles valores: ${range}.`,
    ],
  }
}

function inferBayesTarget(text: string) {
  const lower = text.toLowerCase()
  const chooseByLastMention = (first: string[], second: string[]) => {
    const firstIndex = Math.max(...first.map((word) => lower.lastIndexOf(word)))
    const secondIndex = Math.max(...second.map((word) => lower.lastIndexOf(word)))
    if (firstIndex === -1 && secondIndex === -1) return undefined
    return firstIndex > secondIndex ? 'A' : 'B'
  }

  const machineTarget = chooseByLastMention(['máquina 1', 'maquina 1'], ['máquina 2', 'maquina 2'])
  if (machineTarget) return machineTarget

  const teamTarget = chooseByLastMention(['equipo a'], ['equipo b'])
  if (teamTarget) return teamTarget

  const zoneTarget = chooseByLastMention(['zona norte'], ['zona sur'])
  if (zoneTarget) return zoneTarget

  const scheduleTarget = chooseByLastMention(['jornada nocturna', ' nocturna'], ['jornada diurna', ' diurna'])
  if (scheduleTarget) return scheduleTarget

  const mailTarget = chooseByLastMention(['spam'], ['deseado', 'deseados'])
  if (mailTarget) return mailTarget

  if (lower.includes('enfermo') || lower.includes('enfermedad')) return 'A'
  return 'B'
}

function getBranchValues(values: number[], text = '') {
  const target = inferBayesTarget(text)

  if (values.length === 3) {
    return {
      a: values[0],
      b: 1 - values[0],
      givenA: values[1],
      givenB: values[2],
      knownTotal: undefined,
      target: target === 'B' && !text.toLowerCase().includes('enfermo') ? 'B' : 'A',
    }
  }

  if (values.length >= 4 && Math.abs(values[0] + values[2] - 1) < 0.02) {
    return {
      a: values[0],
      b: values[2],
      givenA: values[1],
      givenB: values[3],
      knownTotal: values[4],
      target,
    }
  }

  return {
    a: values[0] ?? 0,
    b: values[1] ?? 0,
    givenA: values[2] ?? 0,
    givenB: values[3] ?? 0,
    knownTotal: values[4],
    target,
  }
}

function solve(kind: SolverKind, values: number[], text = '') {
  if (kind === 'clasificacion') {
    const classification = inferEventClassification(text)
    return {
      result: 0,
      resultLabel: classification.label,
      steps: classification.steps,
    }
  }

  if (kind === 'variables') {
    const classification = inferVariableClassification(text)
    return {
      result: 0,
      resultLabel: classification.label,
      steps: classification.steps,
    }
  }

  if (kind === 'adicion') {
    const [a = 0, b = 0, intersection = 0] = values
    const result = clampProbability(a + b - intersection)
    return {
      result,
      steps: [`P(A) = ${pct(a)}`, `P(B) = ${pct(b)}`, `P(A ∩ B) = ${pct(intersection)}`, `P(A ∪ B) = ${pct(a)} + ${pct(b)} - ${pct(intersection)} = ${pct(result)}`],
    }
  }
  if (kind === 'multiplicacion') {
    const [a = 0, b = 0] = values
    const result = clampProbability(a * b)
    return {
      result,
      steps: [`P(A) = ${pct(a)}`, `P(B) = ${pct(b)}`, `P(A ∩ B) = ${pct(a)} × ${pct(b)} = ${pct(result)}`],
    }
  }
  if (kind === 'condicional') {
    const [base = 0, intersection = 0] = values
    const result = base === 0 ? 0 : clampProbability(intersection / base)
    return {
      result,
      steps: [`P(B) = ${pct(base)}`, `P(A ∩ B) = ${pct(intersection)}`, `P(A|B) = ${pct(intersection)} / ${pct(base)} = ${pct(result)}`],
    }
  }
  const { a, b, givenA, givenB, knownTotal, target } = getBranchValues(values, text)
  const calculatedTotal = clampProbability(a * givenA + b * givenB)
  const total = knownTotal ?? calculatedTotal
  if (kind === 'total') {
    return {
      result: calculatedTotal,
      steps: [`Camino 1 = ${pct(a)} × ${pct(givenA)} = ${pct(a * givenA)}`, `Camino 2 = ${pct(b)} × ${pct(givenB)} = ${pct(b * givenB)}`, `P(evento) = ${pct(a * givenA)} + ${pct(b * givenB)} = ${pct(calculatedTotal)}`],
    }
  }
  const numerator = target === 'A' ? a * givenA : b * givenB
  const result = total === 0 ? 0 : clampProbability(numerator / total)
  return {
    result,
    steps: [
      `P(causa 1) = ${pct(a)} y P(causa 2) = ${pct(b)}`,
      `P(evento) = ${knownTotal ? pct(knownTotal) : `${pct(a * givenA)} + ${pct(b * givenB)} = ${pct(total)}`}`,
      `P(${target === 'A' ? 'causa 1' : 'causa 2'} | evento) = ${pct(numerator)} / ${pct(total)}`,
      `Resultado = ${pct(result)}`,
    ],
  }
}

function BayesTree({ a, b, givenA, givenB, target = 'B' }: { a: number; b: number; givenA: number; givenB: number; target?: string }) {
  const pathA = a * givenA
  const pathB = b * givenB
  const total = pathA + pathB
  const posterior = total === 0 ? 0 : target === 'A' ? pathA / total : pathB / total

  return (
    <div className="tree-panel">
      <svg viewBox="0 0 760 320" role="img" aria-label="Árbol de probabilidad de Bayes">
        <line x1="70" y1="160" x2="250" y2="75" />
        <line x1="70" y1="160" x2="250" y2="245" />
        <line x1="250" y1="75" x2="520" y2="55" />
        <line x1="250" y1="75" x2="520" y2="115" />
        <line x1="250" y1="245" x2="520" y2="205" />
        <line x1="250" y1="245" x2="520" y2="265" />
        <circle cx="70" cy="160" r="22" className="node root" />
        <circle cx="250" cy="75" r="32" className="node cause-a" />
        <circle cx="250" cy="245" r="32" className="node cause-b" />
        <circle cx="520" cy="55" r="34" className="node evidence" />
        <circle cx="520" cy="205" r="34" className="node evidence target" />
        <circle cx="520" cy="115" r="30" className="node muted" />
        <circle cx="520" cy="265" r="30" className="node muted" />
        <text x="58" y="166">Inicio</text>
        <text x="225" y="80">A</text>
        <text x="225" y="250">B</text>
        <text x="493" y="60">Evento</text>
        <text x="493" y="210">Evento</text>
        <text x="490" y="120">No</text>
        <text x="490" y="270">No</text>
        <text x="145" y="93" className="edge-label">{pct(a)}</text>
        <text x="145" y="238" className="edge-label">{pct(b)}</text>
        <text x="365" y="50" className="edge-label">{pct(givenA)}</text>
        <text x="365" y="205" className="edge-label">{pct(givenB)}</text>
        <text x="590" y="63" className="result-label">camino A: {pct(pathA)}</text>
        <text x="590" y="213" className="result-label strong">camino B: {pct(pathB)}</text>
      </svg>
      <div className="answer-strip">
        <span>Total observado: {pct(total)}</span>
        <strong>Probabilidad posterior: {pct(posterior)}</strong>
      </div>
    </div>
  )
}

function VennDiagram({ a, b, intersection }: { a: number; b: number; intersection: number }) {
  const union = clampProbability(a + b - intersection)
  return (
    <div className="venn">
      <svg viewBox="0 0 560 280" role="img" aria-label="Diagrama de Venn">
        <circle cx="230" cy="140" r="105" className="venn-a" />
        <circle cx="330" cy="140" r="105" className="venn-b" />
        <text x="165" y="142">A</text>
        <text x="377" y="142">B</text>
        <text x="272" y="145" className="inside">{pct(intersection)}</text>
        <text x="76" y="256">P(A) {pct(a)}</text>
        <text x="360" y="256">P(B) {pct(b)}</text>
      </svg>
      <div className="answer-strip">
        <span>Unión</span>
        <strong>{pct(union)}</strong>
      </div>
    </div>
  )
}

function ProbabilityBars({ values }: { values: { label: string; value: number }[] }) {
  return (
    <div className="bars">
      {values.map((item) => (
        <div className="bar-row" key={item.label}>
          <span>{item.label}</span>
          <div className="bar-track">
            <div className="bar-fill" style={{ width: `${clampProbability(item.value) * 100}%` }} />
          </div>
          <strong>{pct(item.value)}</strong>
        </div>
      ))}
    </div>
  )
}

function ClassificationVisual({ kind, label }: { kind: SolverKind; label?: string }) {
  const items = kind === 'variables'
    ? [
        { title: 'Discreta', text: 'Se obtiene al contar valores enteros.' },
        { title: 'Continua', text: 'Se obtiene al medir valores en un intervalo.' },
      ]
    : [
        { title: 'Determinista', text: 'El resultado se conoce con certeza.' },
        { title: 'Estocástico', text: 'El resultado depende del azar o incertidumbre.' },
      ]

  return (
    <div className="classification-visual">
      {items.map((item) => (
        <article className={label === item.title ? 'selected' : ''} key={item.title}>
          <strong>{item.title}</strong>
          <p>{item.text}</p>
        </article>
      ))}
    </div>
  )
}

function MonteCarloLab() {
  const [probability, setProbability] = useState(0.62)
  const [trials, setTrials] = useState(500)
  const [results, setResults] = useState<number[]>([])
  const scenarioButtons = [
    { label: 'Prueba médica', probability: 0.32, trials: 500 },
    { label: 'Falla de sistema', probability: 0.1, trials: 1000 },
    { label: 'Venta digital', probability: 0.2, trials: 750 },
  ]

  function runSimulation() {
    const samples = Array.from({ length: trials }, () => (Math.random() < probability ? 1 : 0))
    setResults(samples)
  }

  const successes = results.reduce((total, value) => total + value, 0)
  const experimental = results.length === 0 ? 0 : successes / results.length
  const error = Math.abs(probability - experimental)
  const preview = results.slice(0, 90)
  const convergence = results.reduce<number[]>((points, value, index) => {
    const runningSuccesses = (points[index - 1] ?? 0) * index + value
    points.push(runningSuccesses / (index + 1))
    return points
  }, [])
  const sampleEvery = Math.max(1, Math.ceil(convergence.length / 46))
  const sampledConvergence = convergence.filter((_, index) => index % sampleEvery === 0)
  const convergencePoints = sampledConvergence
    .map((value, index) => {
      const x = sampledConvergence.length <= 1 ? 0 : (index / (sampledConvergence.length - 1)) * 100
      const y = 100 - clampProbability(value) * 100
      return `${x},${y}`
    })
    .join(' ')
  const theoreticalY = 100 - probability * 100

  return (
    <section className="simulation-shell">
      <div className="section-heading">
        <p className="eyebrow">Modo simulación</p>
        <h2>Monte Carlo: cuando el azar se convierte en datos</h2>
        <p>
          Define una probabilidad real, ejecuta muchos intentos y compara la teoría con el resultado experimental.
        </p>
      </div>

      <div className="simulation-grid">
        <div className="sim-controls">
          <div className="monte-explain">
            <strong>¿Por qué Monte Carlo?</strong>
            <p>El nombre viene de Monte Carlo, famoso por sus casinos. La técnica usa azar repetido para aproximar resultados difíciles de predecir directamente.</p>
          </div>

          <label>
            Probabilidad del evento
            <input
              max="0.99"
              min="0.01"
              step="0.01"
              type="range"
              value={probability}
              onChange={(event) => setProbability(Number(event.target.value))}
            />
            <strong>{pct(probability)}</strong>
          </label>

          <label>
            Número de intentos
            <input
              max="5000"
              min="50"
              step="50"
              type="range"
              value={trials}
              onChange={(event) => setTrials(Number(event.target.value))}
            />
            <strong>{trials.toLocaleString('es-CO')}</strong>
          </label>

          <div className="scenario-buttons" aria-label="Escenarios de simulación">
            {scenarioButtons.map((scenario) => (
              <button
                key={scenario.label}
                onClick={() => {
                  setProbability(scenario.probability)
                  setTrials(scenario.trials)
                  setResults([])
                }}
                type="button"
              >
                {scenario.label}
              </button>
            ))}
          </div>

          <button className="primary-action" onClick={runSimulation} type="button">
            Ejecutar simulación
          </button>
        </div>

        <div className="sim-results">
          <ProbabilityBars
            values={[
              { label: 'Probabilidad teórica', value: probability },
              { label: 'Probabilidad simulada', value: experimental },
              { label: 'Diferencia', value: error },
            ]}
          />
          <div className="sim-dots" aria-label="Resultados simulados">
            {preview.map((value, index) => (
              <span className={value === 1 ? 'success' : 'failure'} key={`${index}-${value}`} title={value === 1 ? 'ocurrió' : 'no ocurrió'} />
            ))}
          </div>
          <div className="convergence-panel">
            <div>
              <strong>Curva de convergencia</strong>
              <span>Entre más intentos, más tiende a estabilizarse.</span>
            </div>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label="Curva de convergencia Monte Carlo">
              <line x1="0" x2="100" y1={theoreticalY} y2={theoreticalY} className="target-line" />
              {convergencePoints && <polyline points={convergencePoints} />}
            </svg>
          </div>
          <div className="answer-strip">
            <span>Eventos exitosos: {successes.toLocaleString('es-CO')} de {results.length.toLocaleString('es-CO')}</span>
            <strong>{results.length === 0 ? 'Ejecuta para medir' : pct(experimental)}</strong>
          </div>
        </div>
      </div>
    </section>
  )
}

function TopicExplorer({ selected }: { selected: Topic }) {
  if (selected.id === 'clasificacion') {
    return (
      <div className="module-grid">
        {classificationCases.map((item) => (
          <article className="case-card" key={item.text}>
            <span>{item.answer}</span>
            <h3>{item.text}</h3>
            <p>{item.reason}</p>
          </article>
        ))}
      </div>
    )
  }

  if (selected.id === 'variables') {
    return (
      <div className="module-grid">
        {variableCases.map((item) => (
          <article className="case-card" key={item.label}>
            <span>{item.type}</span>
            <h3>{item.label}</h3>
            <p>{item.reason}</p>
            <code>{item.range}</code>
          </article>
        ))}
      </div>
    )
  }

  if (selected.id === 'adicion') return <VennDiagram a={0.6} b={0.4} intersection={0.2} />
  if (selected.id === 'multiplicacion') return <ProbabilityBars values={[{ label: 'Prueba unitaria', value: 0.95 }, { label: 'Prueba integración', value: 0.9 }, { label: 'Ambas correctas', value: 0.855 }]} />
  if (selected.id === 'condicional') return <ProbabilityBars values={[{ label: 'Cambios urgentes', value: 0.2 }, { label: 'Urgente y error', value: 0.08 }, { label: 'Error dado urgente', value: 0.4 }]} />
  if (selected.id === 'total') return <BayesTree a={0.6} b={0.4} givenA={0.07} givenB={0.12} />
  return <BayesTree a={0.7} b={0.3} givenA={0.04} givenB={0.1} />
}

function App() {
  const [activeTopic, setActiveTopic] = useState<TopicId>('bayes')
  const [activeSolverTopic, setActiveSolverTopic] = useState(0)
  const [customText, setCustomText] = useState(solverTopics[0].statement)
  const [stepPlayback, setStepPlayback] = useState({ count: 0, key: '' })
  const [replayToken, setReplayToken] = useState(0)

  const selected = topics.find((topic) => topic.id === activeTopic) ?? topics[0]
  const solverTopic = solverTopics[activeSolverTopic]
  const detectedKind = useMemo(() => {
    if (solverTopic.kind === 'clasificacion' || solverTopic.kind === 'variables') return solverTopic.kind
    return detectKind(customText)
  }, [customText, solverTopic.kind])
  const extracted = useMemo(() => getSolverValues(detectedKind, customText), [customText, detectedKind])
  const parsedSolution = useMemo(() => solve(detectedKind, extracted, customText), [customText, detectedKind, extracted])
  const branchValues = useMemo(() => getBranchValues(extracted, customText), [customText, extracted])
  const supportedExerciseCount = exerciseBank.length
  const solutionKey = useMemo(
    () => `${detectedKind}-${extracted.join(',')}-${parsedSolution.steps.join('|')}-${parsedSolution.result}`,
    [detectedKind, extracted, parsedSolution],
  )
  const visibleStepCount = stepPlayback.key === solutionKey ? stepPlayback.count : 0
  const isExplanationComplete = visibleStepCount >= parsedSolution.steps.length

  function loadSolverTopic(index: number) {
    setActiveSolverTopic(index)
    setCustomText(solverTopics[index].statement)
  }

  useEffect(() => {
    if (parsedSolution.steps.length === 0) return undefined

    let nextStep = 0
    const timer = window.setInterval(() => {
      nextStep += 1
      setStepPlayback({ count: nextStep, key: solutionKey })

      if (nextStep >= parsedSolution.steps.length) {
        window.clearInterval(timer)
      }
    }, 620)

    return () => window.clearInterval(timer)
  }, [parsedSolution.steps.length, replayToken, solutionKey])

  const exerciseSolution = solve(solverTopic.kind, extractNumbers(solverTopic.statement), solverTopic.statement)

  return (
    <main>
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">Procesos estocásticos · Ingeniería de software</p>
          <h1>Laboratorio interactivo de probabilidad aplicada</h1>
          <p>
            Explora los temas del taller con simuladores, árboles, diagramas de Venn y resolución paso a paso de ejercicios.
          </p>
          <div className="hero-stats" aria-label="Resumen del laboratorio">
            <span><strong>7</strong> temas</span>
            <span><strong>{supportedExerciseCount}</strong> patrones</span>
            <span><strong>Monte Carlo</strong> simulación</span>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="prob-card large">P(B|A)</div>
          <div className="prob-card small">Σ caminos</div>
          <div className="prob-card medium">A ∪ B</div>
        </div>
      </section>

      <section className="topic-shell">
        <aside className="topic-nav" aria-label="Temas">
          {topics.map((topic) => (
            <button
              className={topic.id === activeTopic ? 'active' : ''}
              key={topic.id}
              onClick={() => setActiveTopic(topic.id)}
              type="button"
            >
              <span>{topic.title}</span>
              <small>{topic.formula}</small>
            </button>
          ))}
        </aside>

        <section className="topic-stage">
          <div className="topic-header">
            <div>
              <p className="eyebrow">Modo estudio</p>
              <h2>{selected.title}</h2>
            </div>
            <code>{selected.formula}</code>
          </div>
          <p className="lead">{selected.short}</p>
          <p className="dev-use">{selected.devUse}</p>
          <TopicExplorer selected={selected} />
        </section>
      </section>

      <section className="solver-shell">
        <div className="section-heading">
          <p className="eyebrow">Modo resolver</p>
          <h2>Ejercicios del taller convertidos en código</h2>
          <p>Selecciona un tema y pega cualquier ejercicio del taller de ese tipo. El motor reconoce patrones de {supportedExerciseCount} ejercicios base y muestra los pasos.</p>
        </div>

        <div className="solver-grid">
          <div className="exercise-list">
            {solverTopics.map((item, index) => (
              <button className={index === activeSolverTopic ? 'active' : ''} key={item.title} onClick={() => loadSolverTopic(index)} type="button">
                <span>{item.title}</span>
                <small className="topic-badge">{item.topicLabel}</small>
                <small>{item.helper}</small>
              </button>
            ))}
          </div>

          <div className="solver-card">
            <textarea value={customText} onChange={(event) => setCustomText(event.target.value)} aria-label="Enunciado del ejercicio" />
            <div className="solver-meta">
              <span>Modelo detectado: <strong>{detectedKind}</strong></span>
              <span>Datos encontrados: <strong>{extracted.map(pct).join(' · ') || 'criterios cualitativos'}</strong></span>
            </div>
            <div className="explanation-toolbar">
              <span>Paso {Math.min(visibleStepCount, parsedSolution.steps.length)} de {parsedSolution.steps.length}</span>
              <button type="button" onClick={() => setReplayToken((value) => value + 1)}>
                Reproducir explicación
              </button>
            </div>
            <div className="steps">
              {parsedSolution.steps.slice(0, visibleStepCount).map((step, index) => (
                <div className="step" key={step}>
                  <strong>{index + 1}</strong>
                  <span>{step}</span>
                </div>
              ))}
            </div>
            <div className={isExplanationComplete ? 'final-answer ready' : 'final-answer pending'}>
              <span>Resultado</span>
              <strong>{isExplanationComplete ? parsedSolution.resultLabel ?? pct(parsedSolution.result) : 'Analizando...'}</strong>
            </div>
          </div>

          <div className="visual-card">
            {(detectedKind === 'clasificacion' || detectedKind === 'variables') && <ClassificationVisual kind={detectedKind} label={parsedSolution.resultLabel} />}
            {detectedKind === 'adicion' && <VennDiagram a={extracted[0] ?? 0} b={extracted[1] ?? 0} intersection={extracted[2] ?? 0} />}
            {detectedKind === 'multiplicacion' && <ProbabilityBars values={[{ label: 'Evento A', value: extracted[0] ?? 0 }, { label: 'Evento B', value: extracted[1] ?? 0 }, { label: 'A y B', value: parsedSolution.result }]} />}
            {detectedKind === 'condicional' && <ProbabilityBars values={[{ label: 'Condición', value: extracted[0] ?? 0 }, { label: 'Intersección', value: extracted[1] ?? 0 }, { label: 'Resultado', value: parsedSolution.result }]} />}
            {(detectedKind === 'total' || detectedKind === 'bayes') && (
              <BayesTree a={branchValues.a} b={branchValues.b} givenA={branchValues.givenA} givenB={branchValues.givenB} target={branchValues.target} />
            )}
          </div>
        </div>
      </section>

      <MonteCarloLab />

      <section className="portfolio-band">
        <div>
          <p className="eyebrow">Enfoque de desarrollador</p>
          <h2>Lo que demuestra esta implementación</h2>
        </div>
        <div className="portfolio-grid">
          <article>
            <strong>Modelado matemático</strong>
            <p>Convierte fórmulas de probabilidad en funciones reutilizables.</p>
          </article>
          <article>
            <strong>Visualización</strong>
            <p>Usa árboles, barras y diagramas para explicar el razonamiento.</p>
          </article>
          <article>
            <strong>Interacción</strong>
            <p>Permite explorar, editar enunciados y ver resultados al instante.</p>
          </article>
        </div>
      </section>

      <div className="hidden-check" aria-hidden="true">{exerciseSolution.result}</div>
    </main>
  )
}

export default App
