# The Royal Blush — Client Preview for GitHub Pages

Ye alag static sample hai, client ko website ka design aur flow samjhane ke liye. Node.js, npm, database, setup key ya server hosting ki zaroorat nahi.

## GitHub par upload karke link kaise bhejein

1. ZIP extract karein.
2. GitHub par ek nayi **public repository** banayein, jaise `royal-blush-sample`.
3. Repository mein **Add file → Upload files** kholein.
4. Extracted folder ke **andar ki files** upload karein: `index.html`, `app.js`, `demo.js`, `seed.js`, CSS files aur poora `assets` folder. `index.html` repository ke root mein hona chahiye; extra parent folder ke andar nahi. ZIP file ko seedha upload nahi karna.
5. **Commit changes** karein.
6. **Settings → Pages → Build and deployment → Source: Deploy from a branch** select karein.
7. Branch **main**, folder **/(root)** choose karke **Save** karein.
8. Deployment complete hone par **Settings → Pages** mein website ka link milega. Wahi link client ko bhejein, repository wala code link nahi.

Example URL format: `https://YOUR-USERNAME.github.io/royal-blush-sample/` (ye example hai, published link nahi).

Official instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Client kya dekh/test kar sakta hai

- Original floating 3D perfume/lipstick top section with animations.
- Current lower homepage sections and all 20 sample products.
- Shop, search, category filters, sorting, product details and image zoom.
- Shopping bag, wishlist, and order-message preview.
- Sample customer profile: Account → **Enter customer demo**. No password required.
- Owner dashboard: top preview bar mein **Owner demo**. No setup key/login required.
- Product/category editing, delete confirmations and example inbox.
- Chat demo: sample reply clearly marked; owner demo se isi browser ki conversation par reply try kar sakte hain.
- Responsive mobile layout.

## Demo ki limits

- Top par **CLIENT PREVIEW** label hai. Ye live store nahi hai.
- Data sirf is browser ke local storage mein save hota hai. Doosre visitors/devices ke saath sync nahi hota.
- No real signup, passwords, owner authentication, orders, payments or live customer messages.
- Sample owner access intentionally public hai; ismein koi private store data nahi hai.
- WhatsApp buttons message preview dikhate hain; real store ko message nahi bhejte.
- Use fictional customer details only.
- Photo upload small browser preview ke liye hai (under 750 KB); video upload static demo mein disabled hai.
- **Reset demo** se browser ke sample changes clear kar sakte hain.
- Existing full V2 backend, real accounts, uploads and database is package mein included nahi hain aur unchanged hain.
- Seed catalogue and product illustrations are sample content; the decorative editorial image is AI-generated.

## Client ko bhejne ke liye message

“Ye aapki Royal Blush website ka interactive sample hai. Aap homepage animation, products, mobile layout aur shopping bag check kar sakte hain. Upar Owner demo se dashboard bhi dekh sakte hain. Ye design-review version hai; real login, orders aur live chat full hosted version mein honge. Please design aur flow par apna feedback bhej dein.”

## Technical notes

All URLs are relative and navigation uses `index.html?page=...`, so the demo works inside a GitHub project repository subdirectory. No backend `/api` requests are made. `.nojekyll` is included. No build step or GitHub Actions configuration is required for branch publishing.

Tested under a nested repository-style URL for asset loading, all 20 products, cart, sample account, category creation, owner/customer message previews and mobile width. This source package has not been published to GitHub yet.
