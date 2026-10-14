# НЭО Питомник

Современный многостраничный сайт питомника с каталогом из 188 позиций, 33 категориями, девятью услугами, блогом и анимацией роста ели при прокрутке. Данные и фотографии взяты с исходного сайта https://neo-pitomnik.ru/.

**Сайт:** https://yasinsckijtema1907-eng.github.io/neo-pitomnik/

## Запуск

Требуется Node.js 22.13 или новее.

```sh
npm ci
npm run dev
```

## Сборка для GitHub Pages

```sh
# Bash / Linux / macOS
NEXT_PUBLIC_BASE_PATH=/neo-pitomnik NEXT_PUBLIC_SITE_ORIGIN=https://yasinsckijtema1907-eng.github.io npm run build
```

```powershell
$env:NEXT_PUBLIC_BASE_PATH='/neo-pitomnik'
$env:NEXT_PUBLIC_SITE_ORIGIN='https://yasinsckijtema1907-eng.github.io'
npm run build
```

Готовый сайт находится в `out/`. Все страницы генерируются отдельными HTML-файлами. GitHub Actions автоматически собирает и публикует сайт после изменения ветки `main`.

## Заявки

Выбор растений хранится в браузере. Форма готовит письмо на `admin@neo-pitomnik.ru` с контактами и выбранными позициями. Посетитель открывает и отправляет письмо из своей почты; сайт не сообщает об автоматической отправке или сохранении заявки.

Оригинальный обработчик заявок для OpenAI Sites и Cloudflare D1 сохранён в `server/sites-inquiry-route.ts`, схема — в `db/` и `drizzle/`. Этот обработчик не запускается на GitHub Pages. Для автоматического приёма заявок понадобится отдельный сервер.

## Где редактировать

- `app/garden.tsx` — общий интерфейс и анимация дерева;
- `app/page-content.tsx` — содержание основных разделов;
- `app/multipage.css` и `app/globals.css` — стили;
- `public/catalog.json` — исходный ассортимент и цены;
- `public/blog.json` — статья исходного блога;
- `public/assets/` — фотографии, шрифты и кадры анимации.

У части товаров на исходном сайте нет фотографий; для них показана нейтральная заглушка. Наличие и цены подтверждаются питомником. Не меняйте изображения на вымышленные фотографии конкретных сортов.
