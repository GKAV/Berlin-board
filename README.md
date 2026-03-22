# Berlin Board

## Что нужно сделать перед деплоем

### 1. Вставь свои ключи в файл `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=твой_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=твой_publishable_key
```

### 2. Создай таблицу в Supabase (SQL Editor):
```sql
create table posts (
  id text primary key,
  text text not null,
  nickname text,
  avatar text,
  color text,
  time timestamptz default now()
);
```

### 3. Задеплой на Vercel:
- Зайди на vercel.com
- "Add New Project" → "Import" папку berlin-board
- В настройках добавь Environment Variables:
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY
- Нажми Deploy

### Управление постами:
- Заходи в Supabase → Table Editor → posts
- Там видишь все посты, можешь удалять любые
