import { Prioridad } from "./types";

export type ItemCatalogo = {
  nombre: string;
  categoria: string;
  prioridad: Prioridad;
  unidad: string;
};

/**
 * Lista de artículos de primera necesidad para centros de acopio tras un
 * desastre. Se carga con un clic desde la página de Artículos. Puedes editar
 * cantidades, centro y prioridad después; o agregar más con el formulario.
 *
 * La sección "Crítico" refleja los pedidos de máxima prioridad de la
 * situación actual (Barquisimeto).
 */
export const CATALOGO_BASICO: ItemCatalogo[] = [
  // 🚨 Crítico — máxima prioridad ahora mismo
  { nombre: "Insumos médicos (todo tipo)", categoria: "Medicamentos", prioridad: "critica", unidad: "unidades" },
  { nombre: "Agua embotellada", categoria: "Agua", prioridad: "critica", unidad: "litros" },
  { nombre: "Alimentos no perecederos (variados)", categoria: "Alimentos no perecederos", prioridad: "critica", unidad: "kg" },
  { nombre: "Leche en polvo", categoria: "Alimentos no perecederos", prioridad: "critica", unidad: "kg" },
  { nombre: "Fórmula infantil", categoria: "Bebés y niños", prioridad: "critica", unidad: "latas" },
  { nombre: "Teteros / biberones", categoria: "Bebés y niños", prioridad: "critica", unidad: "unidades" },
  { nombre: "Pañales para bebé", categoria: "Bebés y niños", prioridad: "critica", unidad: "paquetes" },
  { nombre: "Ropa de niños", categoria: "Ropa y abrigo", prioridad: "critica", unidad: "piezas" },
  { nombre: "Ropa limpia en buen estado", categoria: "Ropa y abrigo", prioridad: "critica", unidad: "piezas" },
  { nombre: "Zapatos cerrados", categoria: "Ropa y abrigo", prioridad: "critica", unidad: "pares" },
  { nombre: "Cobijas / mantas", categoria: "Ropa y abrigo", prioridad: "critica", unidad: "unidades" },
  { nombre: "Colchones", categoria: "Refugio y descanso", prioridad: "critica", unidad: "unidades" },
  { nombre: "Carpas", categoria: "Refugio y descanso", prioridad: "critica", unidad: "unidades" },
  { nombre: "Linternas", categoria: "Refugio y herramientas", prioridad: "critica", unidad: "unidades" },
  { nombre: "Herramientas", categoria: "Refugio y herramientas", prioridad: "critica", unidad: "unidades" },
  { nombre: "Artículos de higiene personal (kit)", categoria: "Higiene personal", prioridad: "critica", unidad: "kits" },

  // 💧 Agua y purificación
  { nombre: "Pastillas/cloro purificador de agua", categoria: "Agua", prioridad: "alta", unidad: "paquetes" },
  { nombre: "Bidones / garrafas vacías", categoria: "Agua", prioridad: "alta", unidad: "unidades" },

  // 🥫 Alimentos no perecederos
  { nombre: "Atún / sardinas enlatadas", categoria: "Alimentos no perecederos", prioridad: "alta", unidad: "latas" },
  { nombre: "Arroz", categoria: "Alimentos no perecederos", prioridad: "alta", unidad: "kg" },
  { nombre: "Frijoles / legumbres secas", categoria: "Alimentos no perecederos", prioridad: "alta", unidad: "kg" },
  { nombre: "Pasta", categoria: "Alimentos no perecederos", prioridad: "alta", unidad: "kg" },
  { nombre: "Aceite vegetal", categoria: "Alimentos no perecederos", prioridad: "media", unidad: "litros" },
  { nombre: "Azúcar", categoria: "Alimentos no perecederos", prioridad: "media", unidad: "kg" },
  { nombre: "Sal", categoria: "Alimentos no perecederos", prioridad: "media", unidad: "kg" },
  { nombre: "Galletas / barras energéticas", categoria: "Alimentos no perecederos", prioridad: "media", unidad: "paquetes" },
  { nombre: "Cereal / avena", categoria: "Alimentos no perecederos", prioridad: "media", unidad: "kg" },
  { nombre: "Café / chocolate en polvo", categoria: "Alimentos no perecederos", prioridad: "baja", unidad: "paquetes" },

  // 💊 Medicamentos
  { nombre: "Paracetamol", categoria: "Medicamentos", prioridad: "alta", unidad: "cajas" },
  { nombre: "Ibuprofeno", categoria: "Medicamentos", prioridad: "alta", unidad: "cajas" },
  { nombre: "Suero oral / sales de rehidratación", categoria: "Medicamentos", prioridad: "alta", unidad: "sobres" },
  { nombre: "Antidiarreicos", categoria: "Medicamentos", prioridad: "alta", unidad: "cajas" },
  { nombre: "Antibióticos de uso común", categoria: "Medicamentos", prioridad: "alta", unidad: "cajas" },
  { nombre: "Antialérgicos", categoria: "Medicamentos", prioridad: "alta", unidad: "cajas" },
  { nombre: "Medicamentos crónicos (hipertensión, diabetes)", categoria: "Medicamentos", prioridad: "alta", unidad: "cajas" },

  // 🩹 Insumos médicos / primeros auxilios — todo prioridad alta
  { nombre: "Jeringas y agujas estériles", categoria: "Primeros auxilios", prioridad: "alta", unidad: "unidades" },
  { nombre: "Suero fisiológico / solución salina", categoria: "Primeros auxilios", prioridad: "alta", unidad: "unidades" },
  { nombre: "Mascarillas / cubrebocas", categoria: "Primeros auxilios", prioridad: "alta", unidad: "cajas" },
  { nombre: "Vendas elásticas", categoria: "Primeros auxilios", prioridad: "alta", unidad: "unidades" },
  { nombre: "Gasas estériles", categoria: "Primeros auxilios", prioridad: "alta", unidad: "paquetes" },
  { nombre: "Curitas / banditas adhesivas", categoria: "Primeros auxilios", prioridad: "alta", unidad: "cajas" },
  { nombre: "Alcohol / antiséptico", categoria: "Primeros auxilios", prioridad: "alta", unidad: "litros" },
  { nombre: "Agua oxigenada", categoria: "Primeros auxilios", prioridad: "alta", unidad: "litros" },
  { nombre: "Algodón", categoria: "Primeros auxilios", prioridad: "alta", unidad: "paquetes" },
  { nombre: "Guantes de látex desechables", categoria: "Primeros auxilios", prioridad: "alta", unidad: "cajas" },
  { nombre: "Cinta adhesiva médica (micropore)", categoria: "Primeros auxilios", prioridad: "alta", unidad: "rollos" },
  { nombre: "Termómetro", categoria: "Primeros auxilios", prioridad: "alta", unidad: "unidades" },
  { nombre: "Tijeras / pinzas", categoria: "Primeros auxilios", prioridad: "alta", unidad: "unidades" },

  // 🧴 Higiene personal
  { nombre: "Jabón de baño", categoria: "Higiene personal", prioridad: "alta", unidad: "unidades" },
  { nombre: "Papel higiénico", categoria: "Higiene personal", prioridad: "alta", unidad: "rollos" },
  { nombre: "Cepillo y pasta dental", categoria: "Higiene personal", prioridad: "media", unidad: "unidades" },
  { nombre: "Toallas sanitarias / femeninas", categoria: "Higiene personal", prioridad: "alta", unidad: "paquetes" },
  { nombre: "Gel antibacterial", categoria: "Higiene personal", prioridad: "media", unidad: "litros" },
  { nombre: "Toallas húmedas", categoria: "Higiene personal", prioridad: "media", unidad: "paquetes" },
  { nombre: "Shampoo", categoria: "Higiene personal", prioridad: "baja", unidad: "litros" },

  // 👶 Bebés y niños
  { nombre: "Comida para bebé (papillas)", categoria: "Bebés y niños", prioridad: "alta", unidad: "frascos" },

  // 🧓 Adultos mayores
  { nombre: "Pañales para adulto", categoria: "Adultos mayores", prioridad: "alta", unidad: "paquetes" },

  // 🧥 Ropa y abrigo
  { nombre: "Calcetines y ropa interior (nuevos)", categoria: "Ropa y abrigo", prioridad: "media", unidad: "paquetes" },

  // 🔦 Refugio y herramientas
  { nombre: "Pilas / baterías", categoria: "Refugio y herramientas", prioridad: "alta", unidad: "paquetes" },
  { nombre: "Velas y cerillos/encendedores", categoria: "Refugio y herramientas", prioridad: "media", unidad: "paquetes" },
  { nombre: "Lonas / plásticos impermeables", categoria: "Refugio y herramientas", prioridad: "media", unidad: "unidades" },
  { nombre: "Bolsas de basura", categoria: "Refugio y herramientas", prioridad: "media", unidad: "paquetes" },
  { nombre: "Cuerda / cinta adhesiva", categoria: "Refugio y herramientas", prioridad: "baja", unidad: "rollos" },
];
