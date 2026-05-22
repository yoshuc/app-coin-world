// Market items with unit unlock requirements
// unlocksAtUnit: 0 = always visible, 1-4 = unlocked when that unit is complete
export const ITEMS = [
  // Unit 0 — always available
  { id: 'toy',      es: 'Carrito',      en: 'Toy car',        cost: 8,  color: '#EF4444', unlocksAtUnit: 0 },
  { id: 'book',     es: 'Libro',        en: 'Book',           cost: 6,  color: '#3B82F6', unlocksAtUnit: 0 },
  { id: 'icecream', es: 'Helado',       en: 'Ice cream',      cost: 4,  color: '#F472B6', unlocksAtUnit: 0 },
  { id: 'ball',     es: 'Pelota',       en: 'Ball',           cost: 5,  color: '#22C55E', unlocksAtUnit: 0 },
  { id: 'puzzle',   es: 'Rompecabezas', en: 'Puzzle',         cost: 10, color: '#A855F7', unlocksAtUnit: 0 },
  { id: 'stickers', es: 'Calcomanías',  en: 'Stickers',       cost: 3,  color: '#F97316', unlocksAtUnit: 0 },
  // Unit 2 — unlock after lessons 6-10
  { id: 'flowers',  es: 'Jardín Floral', en: 'Flower Garden', cost: 30, color: '#EC4899', unlocksAtUnit: 2 },
  { id: 'butterfly',es: 'Arbusto Mariposa', en: 'Butterfly Bush', cost: 25, color: '#8B5CF6', unlocksAtUnit: 2 },
  { id: 'banner',   es: 'Bandera del Pueblo', en: 'Town Banner', cost: 40, color: '#F59E0B', unlocksAtUnit: 2 },
  // Unit 3 — unlock after lessons 11-15
  { id: 'carousel', es: 'Carrusel',     en: 'Carousel',       cost: 60, color: '#06B6D4', unlocksAtUnit: 3 },
  { id: 'fountain', es: 'Fuente',       en: 'Fountain',       cost: 55, color: '#3B82F6', unlocksAtUnit: 3 },
  { id: 'lamp',     es: 'Lámpara de Calle', en: 'Street Lamp', cost: 35, color: '#FBBF24', unlocksAtUnit: 3 },
  // Unit 4 — unlock after all 20 lessons
  { id: 'trophy',   es: 'Trofeo de Victoria', en: 'Victory Trophy', cost: 100, color: '#F59E0B', unlocksAtUnit: 4 },
  { id: 'fireworks',es: 'Fuegos Artificiales', en: 'Fireworks Display', cost: 80, color: '#EF4444', unlocksAtUnit: 4 },
  { id: 'goldstar', es: 'Estrella Dorada', en: 'Golden Star',  cost: 120, color: '#FBBF24', unlocksAtUnit: 4 },
]
