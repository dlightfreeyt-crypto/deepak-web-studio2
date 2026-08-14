# Deepak Web Studio v2

A Supabase + Netlify static website with a working admin control center.

## Setup

1. Create/open your Supabase project.
2. Run `supabase-schema.sql` in Supabase SQL Editor.
3. In Supabase Authentication > Users, create your admin email/password.
4. Edit `config.js` and replace:
   - YOUR_SUPABASE_URL
   - YOUR_SUPABASE_ANON_KEY
5. Upload all files to GitHub root.
6. Connect the repo to Netlify.
7. Open `/admin.html` and log in.

## Admin controls

- Add/edit/delete website demos
- Website title/category/image/demo URL/tags
- Approve/hide/delete customer reviews
- WhatsApp number and pre-filled message
- Site name and SEO description
- Hero text and hero image
- About text/image
- Build/CTA text
- Review heading
- Theme + custom colors
- Homepage benefit points

The public site keeps the original cream/aesthetic visual direction.

## Important security note

The starter policies allow any authenticated Supabase user to manage admin data. For a real client-facing production site, restrict management policies to your own Supabase Auth user UUID.
