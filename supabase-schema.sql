create extension if not exists pgcrypto;

create table if not exists websites (
 id uuid primary key default gen_random_uuid(), title text not null, category text not null,
 description text not null, image_url text, demo_url text not null, tags text[] default '{}',
 created_at timestamptz default now()
);
create table if not exists feedback (
 id uuid primary key default gen_random_uuid(), name text not null,
 rating int not null check (rating between 1 and 5), message text not null,
 approved boolean default false, created_at timestamptz default now()
);
create table if not exists settings (
 id int primary key, site_name text, hero_eyebrow text, hero_title text, hero_text text, hero_image text,
 about_title text, about_text text, about_image text, about_label text, whatsapp text, whatsapp_message text,
 build_title text, build_text text, reviews_title text, meta_description text, theme text default 'cream',
 accent text, accent2 text, background text, surface text, features jsonb default '["Modern responsive design","Clear calls-to-action","Easy future updates"]'::jsonb,
 updated_at timestamptz default now()
);

insert into settings (id,site_name,hero_eyebrow,hero_title,hero_text,about_title,about_text,about_label,whatsapp,whatsapp_message,build_title,build_text,reviews_title,meta_description,theme,accent,accent2,background,surface,features)
values (1,'Deepak Web Studio','WEB DESIGN • DEVELOPMENT • DIGITAL PRESENCE','Find a demo.|Build your website.','Explore ready-made website concepts for businesses, creators and professionals. Like one? Let''s turn it into your own website.','Websites designed around your business.','I create clean, responsive and conversion-focused websites for local businesses and personal brands.','YOUR BUSINESS','919999999999','Hi, I want to build a website.','Let''s build something that fits your business.','Tell me what you need and I''ll help you choose a suitable demo or create a custom design.','What people say','Modern websites designed to help businesses attract customers.','cream','#9a6a3a','#d8b28a','#f8f5ef','#fffdf9','["Modern responsive design","Clear calls-to-action","Easy future updates"]'::jsonb)
on conflict (id) do nothing;

alter table websites enable row level security;
alter table feedback enable row level security;
alter table settings enable row level security;

drop policy if exists "public read websites" on websites;
drop policy if exists "public read settings" on settings;
drop policy if exists "public submit feedback" on feedback;
drop policy if exists "public read approved feedback" on feedback;
drop policy if exists "authenticated manage websites" on websites;
drop policy if exists "authenticated manage feedback" on feedback;
drop policy if exists "authenticated manage settings" on settings;

create policy "public read websites" on websites for select using (true);
create policy "public read settings" on settings for select using (true);
create policy "public submit feedback" on feedback for insert with check (approved=false);
create policy "public read approved feedback" on feedback for select using (approved=true);
create policy "authenticated manage websites" on websites for all to authenticated using (true) with check (true);
create policy "authenticated manage feedback" on feedback for all to authenticated using (true) with check (true);
create policy "authenticated manage settings" on settings for all to authenticated using (true) with check (true);


-- Supabase Storage for website images
insert into storage.buckets (id, name, public) values ('site-images','site-images',true) on conflict (id) do update set public=true;
drop policy if exists "public read site images" on storage.objects;
drop policy if exists "authenticated upload site images" on storage.objects;
drop policy if exists "authenticated update site images" on storage.objects;
drop policy if exists "authenticated delete site images" on storage.objects;
create policy "public read site images" on storage.objects for select using (bucket_id='site-images');
create policy "authenticated upload site images" on storage.objects for insert to authenticated with check (bucket_id='site-images');
create policy "authenticated update site images" on storage.objects for update to authenticated using (bucket_id='site-images') with check (bucket_id='site-images');
create policy "authenticated delete site images" on storage.objects for delete to authenticated using (bucket_id='site-images');
