/**
 * Cases catalog + long-form case stories.
 *
 * `caseCards` powers the /cases index grid (bento layout + category filter).
 * `caseStories` holds the full write-up for cases that have a detail page
 * (currently the flagship «Павел Воля. Большой стендап»). Everything here is
 * grounded in the team track record described in data.ts — no invented numbers.
 */

// Filter buckets shown as chips on the index. 'Все' is the reset.
export const caseCategories = [
  'Все',
  'Концерты',
  'PR',
  'Маркетинг',
  'E-commerce',
  'Туры',
] as const;

export type CaseCategory = (typeof caseCategories)[number];

// Card visual weight in the bento grid.
//  featured — big cover card (spans two rows), links to a detail page
//  ink      — dark surface card
//  violet   — solid brand-violet card
//  tint     — light violet-tint card
export type CaseAccent = 'featured' | 'ink' | 'violet' | 'tint';

export type CaseCard = {
  slug: string;
  category: Exclude<CaseCategory, 'Все'>;
  title: string;
  result: string;
  cover?: string;
  accent: CaseAccent;
  /** internal detail route, when the case has a full write-up */
  href?: string;
};

export const caseCards: CaseCard[] = [
  {
    slug: 'pavel-volya',
    category: 'Концерты',
    title: 'Павел Воля. Большой стендап',
    result: 'Тур по 40 городам — 38 солдаутов',
    cover: '/uploads/pavel-event.png',
    accent: 'featured',
    href: '/cases/pavel-volya',
  },
  {
    slug: 'kniga-rekordov',
    category: 'PR',
    title: 'Три награды в «Книге рекордов России»',
    result: '2025 · три рекорда за один тур',
    accent: 'violet',
  },
  {
    slug: 'ifarm',
    category: 'Маркетинг',
    title: 'Оптимизация кампаний iFarm',
    result: 'Перфоманс без слитого бюджета',
    accent: 'ink',
  },
  {
    slug: 'vsyogazin',
    category: 'E-commerce',
    title: 'Запуск ecom-направления «Всёгазин»',
    result: 'Новый канал продаж с нуля',
    accent: 'tint',
  },
  {
    slug: 'druzhinin',
    category: 'Туры',
    title: 'Спектакли Егора Дружинина',
    result: '3 города · гастрольный тур',
    accent: 'tint',
  },
];

// ─── Long-form stories ───────────────────────────────────────────────────────

export type CaseMetric = { v: string; l: string };
export type CaseBlock = { t: string; d: string };
export type CaseHighlight = { t: string; d: string };

export type CaseStory = {
  slug: string;
  category: string;
  title: string;
  lead: string;
  cover: string;
  /** short label row under the hero */
  tags: string[];
  /** headline stat strip in the hero */
  facts: CaseMetric[];
  task: string;
  /** what the agency assembled — the full-cycle workstreams */
  build: CaseBlock[];
  /** big result grid */
  results: CaseMetric[];
  /** qualitative wins */
  highlights: CaseHighlight[];
  /** pull-quote */
  quote: { text: string; author: string };
  /** team member names (matched against data.ts `team`) */
  team: string[];
};

export const caseStories: Record<string, CaseStory> = {
  'pavel-volya': {
    slug: 'pavel-volya',
    category: 'Концерты · полный цикл',
    title: 'Павел Воля.\nБольшой стендап',
    lead: 'Всероссийский тур одного из самых кассовых стендап-шоу страны: маркетинг, PR, продажа билетов и продюсирование — собранные в одну систему и доведённые до солдаутов.',
    cover: '/uploads/pavel-event.png',
    tags: ['Маркетинг', 'PR', 'Продажа билетов', 'Контент & SMM', 'Продюсирование'],
    facts: [
      { v: '40', l: 'городов тура' },
      { v: '38', l: 'солдаутов' },
      { v: '95%', l: 'зала в среднем' },
      { v: '21 280', l: 'рекорд зрителей' },
    ],
    task:
      'Провести большой гастрольный тур по всей стране так, чтобы залы — от клубов до стадионов — собирались стабильно, а не «как получится». Нужно было связать перфоманс-маркетинг, PR и продажу билетов в один управляемый механизм: где каждый город прогревается заранее, спрос считается, а не угадывается, а внимание аудитории превращается в проданные места.',
    build: [
      {
        t: 'Перфоманс-маркетинг под каждый город',
        d: 'Отдельные кампании на 40 городов: таргет и контекст с прогревом за несколько недель до старта продаж, ретаргет по тёплой аудитории, ежедневный контроль стоимости билета в закупке — без слитого бюджета на «охваты ради охватов».',
      },
      {
        t: 'PR и работа со СМИ',
        d: 'Инфоповоды под каждый этап тура, публикации в федеральных медиа и попадания в эфиры. PR не «для галочки», а как канал спроса: усиливал доверие и подогревал продажи там, где перфоманс уже привёл трафик.',
      },
      {
        t: 'Продажа билетов и аналитика',
        d: 'Единая воронка от рекламы до кассы: сквозная аналитика по городам, динамическое управление ценой и посадкой, приоритезация бюджета на площадки, где спрос рос быстрее. Решения принимались по цифрам в реальном времени.',
      },
      {
        t: 'Контент, SMM и удержание',
        d: 'Прогрев в соцсетях и мессенджерах, органический рост Telegram-канала без закупки, работа с базой зрителей между городами — чтобы каждый следующий концерт стартовал уже с тёплой аудиторией.',
      },
    ],
    results: [
      { v: '40', l: 'городов в туре — от клубов до стадионов' },
      { v: '38', l: 'аншлагов из 40 площадок' },
      { v: '21 280', l: 'зрителей — рекорд России по стендапу (дек. 2025)' },
      { v: '0 ₽', l: 'на рост Telegram-канала — только органика' },
    ],
    highlights: [
      {
        t: 'Рекорд страны',
        d: 'Один из концертов тура собрал 21 280 зрителей — рекорд России по числу зрителей на стендап-шоу (декабрь 2025).',
      },
      {
        t: 'Федеральные медиа',
        d: 'Материалы в Forbes и эфиры на федеральном ТВ — PR-охваты, которые работали на доверие и продажи, а не просто на упоминания.',
      },
      {
        t: 'Нестандартные коллаборации',
        d: 'После COVID-19 — бартер с KDL: 1 500 бесплатных ПЦР-тестов для зрителей на концерте. Инфоповод и забота об аудитории в одном решении.',
      },
      {
        t: 'Аудитория, которая остаётся',
        d: 'Рост Telegram-канала без рекламного бюджета — только на органике и контенте. Тёплая база, которая переходит из тура в тур.',
      },
    ],
    quote: {
      text: 'Мы не продавали «рекламу концертов». Мы собрали систему, где маркетинг, PR и продажи работают на одну цифру — заполненный зал.',
      author: 'Команда МЭПЛ',
    },
    team: ['Михаил Томчук', 'Нелли Суконникова', 'Максим Зотов'],
  },
};
