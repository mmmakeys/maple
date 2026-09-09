/**
 * Два домена, одна сборка.
 *
 * maple-media.ru — сайт МЭПЛ, «Сценика» живёт на своём домене scenika.ru
 * и открывается там с корня. Локально оба сайта доступны по путям
 * `/` и `/scenika`, чтобы разработка не требовала правки hosts.
 *
 * Разделение по имени хоста, а не по пути: так один и тот же артефакт
 * сборки раздаётся обоим доменам и не нужно собирать и выкатывать дважды.
 */

const SCENIKA_HOSTS = ['scenika.ru', 'www.scenika.ru'];
const MAPLE_HOSTS = ['maple-media.ru', 'www.maple-media.ru'];

const host = typeof window === 'undefined' ? '' : window.location.hostname;

/** Открыт домен «Сценики» — она рендерится с корня. */
export const onScenikaHost = SCENIKA_HOSTS.includes(host);

/** Боевой домен, а не localhost или превью-адрес. */
const onProdHost = onScenikaHost || MAPLE_HOSTS.includes(host);

/** Куда ведёт ссылка на МЭПЛ. */
export const MAPLE_HOME = onScenikaHost ? 'https://maple-media.ru/' : '/';

/** Куда ведёт ссылка на «Сценику». */
export const SCENIKA_HOME = onScenikaHost ? '/' : onProdHost ? 'https://scenika.ru/' : '/scenika';
