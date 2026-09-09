/**
 * Русская микротипографика.
 *
 * Задача — убрать висячие предлоги: короткое служебное слово не должно
 * оставаться в конце строки в отрыве от того, к чему относится. Решается
 * неразрывным пробелом, который вставляется здесь, а не руками в текстах,
 * чтобы исходники оставались читаемыми и правились без невидимых символов.
 *
 * `typo` применяется к отдельной строке, `deepTypo` — ко всей структуре
 * данных (data.ts, cases.ts) разом, пропуская технические поля вроде путей.
 */

const NBSP = ' ';

/** предлоги, союзы и частицы, которые тянут за собой следующее слово */
const LEADING = [
  'а', 'и', 'к', 'о', 'с', 'у', 'в', 'я',
  'во', 'ко', 'со', 'об', 'но', 'на', 'за', 'по', 'до', 'из', 'от',
  'не', 'ни', 'то', 'их', 'её', 'мы', 'вы', 'он',
  'обо', 'для', 'как', 'что', 'при', 'над', 'под', 'про', 'без',
  'так', 'уже', 'ещё', 'или', 'его', 'нас', 'наш', 'все', 'этот', 'эта', 'это',
  'из-за', 'из-под',
];

/** частицы, которые липнут к предыдущему слову */
const TRAILING = ['же', 'бы', 'ли', 'ль'];

// просмотр назад, а не захват: иначе в цепочке «и доводим её до результата»
// первое совпадение съедает пробел, и следующему предлогу не с чем совпасть
const LEADING_RE = new RegExp(
  `(?<=^|[\\s(«"'>])(${LEADING.join('|')})\\s+`,
  'gi',
);
const TRAILING_RE = new RegExp(`\\s+(${TRAILING.join('|')})(?=[\\s.,!?;:)»]|$)`, 'gi');

/** число и следующее за ним слово или знак не разрываются */
const NUM_UNIT_RE = /(\d)\s+(?=[^\s]{1,12}(?:[\s.,!?;:)»]|$))/g;
/** разряды внутри числа: «21 280» */
const NUM_GROUP_RE = /(\d)\s+(?=\d{3}\b)/g;

/**
 * Прогоняет строку через набор правил. Идемпотентна: повторный вызов
 * ничего не меняет, потому что неразрывный пробел под `\s` не подпадает
 * в местах, где он уже проставлен.
 */
export function typo(s: string): string {
  if (!s || !/[а-яё]/i.test(s)) return s;

  let out = s;

  // предлог + слово
  out = out.replace(LEADING_RE, (_m, word: string) => `${word}${NBSP}`);

  // слово + частица
  out = out.replace(TRAILING_RE, (_m, word: string) => `${NBSP}${word}`);

  // числа
  out = out.replace(NUM_GROUP_RE, `$1${NBSP}`);
  out = out.replace(NUM_UNIT_RE, `$1${NBSP}`);

  // тире не должно начинать строку
  out = out.replace(/\s+—/g, `${NBSP}—`);

  // многоточие одним знаком
  out = out.replace(/\.{3}/g, '…');

  return out;
}

/** поля, в которых лежат пути, ссылки и идентификаторы — их не трогаем */
const SKIP_KEYS = new Set([
  'src', 'url', 'logo', 'cover', 'href', 'slug', 'embed', 'poster', 'photo', 'tg', 'icon',
]);

/**
 * Рекурсивно применяет `typo` ко всем строкам структуры, сохраняя её тип.
 * Вызывается один раз при импорте модуля данных.
 */
export function deepTypo<T>(value: T): T {
  if (typeof value === 'string') return typo(value) as unknown as T;
  if (Array.isArray(value)) return value.map((v) => deepTypo(v)) as unknown as T;
  if (value && typeof value === 'object') {
    // React-элементы (иконки) оставляем как есть
    if ('$$typeof' in (value as object)) return value;
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = SKIP_KEYS.has(k) ? v : deepTypo(v);
    }
    return out as T;
  }
  return value;
}
