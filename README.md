# its-cloudflare-bro

> “It’s not down.  
> It’s Cloudflare, bro.”

A **parody React component library** inspired by the *vibe* of Cloudflare-style outage screens, created as a joke reference for when **something, somewhere, is mysteriously broken again**.

It renders a fake Cloudflare-ish error page with **invented 6xx errors** that sound technically plausible while being obviously nonsense.

---

## ⚠️ Important Disclaimer

This project is **NOT affiliated with, endorsed by, or produced by Cloudflare, Inc.**

- This is **not** an official Cloudflare error page
- No Cloudflare source code, HTML, CSS, text, or assets are used
- All content in this repository is **original** and created as a **parody**
- All trademarks, service names, and references belong to their respective owners

If you are looking for real Cloudflare error pages or outage information, please refer to Cloudflare’s official documentation and status pages.

---

## 🧠 What This Is

- A **React + TypeScript component library**
- Styled with **Tailwind** (compiled and shipped as `style.css`)
- Designed to look *familiar* without copying anything proprietary
- Intended for:
  - Joke repositories
  - Placeholder outage pages
  - Demos, mockups, and memes
  - Screenshots when “it worked yesterday”

---

## 📦 Install

```bash
npm i its-cloudflare-bro
```

---

## ✅ Usage

```tsx
import { CloudflareErrorPage, JOKE_CLOUDFLARE_ERRORS } from "its-cloudflare-bro";
import "its-cloudflare-bro/style.css";

export function Example() {
  return (
    <CloudflareErrorPage
      error={JOKE_CLOUDFLARE_ERRORS[0]}
      colo="Paris"
      host="definitely-real-origin.example"
      visitorIp="203.0.113.13"
    />
  );
}
```

---

## 🖼️ Icons / assets

No images required — the middle “Browser / Cloud / Host” icons are **inline SVG** bundled with the component.

---

## 🚫 What This Is NOT

- A real Cloudflare error page
- An official Cloudflare product or service
- A replacement for Cloudflare
- Legal advice
- A definitive explanation for why your site is down (but let’s be honest)

---

## 📄 License

This project is licensed under the **MIT License**.

You are free to:
- Use
- Modify
- Copy
- Share
- Redistribute

As long as the original copyright notice and license are included.

See the [`LICENSE`](./LICENSE) file for full details.

---

## 🧩 Notes on Parody & Fair Use

This project is intended as a **parody / homage**.

Care has been taken to avoid:
- Cloudflare logos or branding
- Proprietary wording
- Direct copies of layouts, stylesheets, or error messages

Any resemblance is **intentional, comedic, and non-functional**.

If you believe anything in this repository crosses a line, feel free to open an issue.

---

## 🫠 Why Does This Exist?

Because every outage has a phase where someone says:

> “It’s Cloudflare, bro.”

And now there’s a page for that.

---

*“its-cloudflare-bro” is a joke name.  
Please do not harass Cloudflare employees.  
They are probably having a day.*
