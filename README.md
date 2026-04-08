# IRELIA — Your Edit

Multi-retailer fashion discovery platform.

## Stack

- **Backend**: Node.js + Express (`/server`)
- **Frontend**: React (`/client`)
- **Affiliate networks simulated**: Awin, Rakuten, Impact

---

## Setup

### 1. Install dependencies

```bash
npm run install:all
```

This installs root, server, and client dependencies.

### 2. Run in development

```bash
npm run dev
```

- API runs on `http://localhost:3001`
- React dev server runs on `http://localhost:3000` with proxy to API

### 3. Production build

```bash
npm run build
NODE_ENV=production npm start
```

Express serves the React build at `/`.

---

## API

### `GET /api/products`

Returns normalised products from all affiliate sources.

**Response:**
```json
{
  "products": [
    {
      "id": "awin-AW-001",
      "title": "Tailored Blazer in Ivory",
      "price": "£189.00",
      "image": "https://...",
      "brand": "Reiss",
      "retailer": "Reiss",
      "productUrl": "https://www.awin1.com/...",
      "category": "Coats & Jackets",
      "color": "Ivory",
      "source": "awin"
    }
  ]
}
```

---

## Replacing simulated feeds with real APIs

Each feed fetcher is isolated in `/server/index.js`:

- `fetchAwinProducts()` — replace with `https://productdata.awin.com/datafeed/...`
- `fetchRakutenProducts()` — replace with Rakuten LinkShare feed URL
- `fetchImpactProducts()` — replace with Impact catalog API

The normaliser functions (`normaliseAwin`, `normaliseRakuten`, `normaliseImpact`) transform raw network shapes into the unified product model. Update these if the real feed schema differs.

---

## Architecture

```
irelia/
├── server/
│   ├── index.js          # Express API, feed fetchers, normalisers
│   └── package.json
├── client/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── index.js
│   │   ├── index.css
│   │   ├── App.js
│   │   └── components/
│   │       ├── Header.js         # Top nav (Women/Men/Shoes/Bags/Accessories/Sale)
│   │       ├── FilterBar.js      # Category / Colour / Brand / Price filters
│   │       ├── ProductGrid.js    # Grid with skeleton loaders, pagination
│   │       ├── ProductCard.js    # Card with lazy image, save toggle
│   │       ├── ProductPanel.js   # Desktop slide panel / mobile bottom sheet PDP
│   │       └── SavedEdit.js      # Saved items drawer
│   └── package.json
└── package.json
```

---

## Design system

| Token | Value |
|---|---|
| Font | Inter |
| Background | #ffffff |
| Border | #e5e5e5 |
| Border radius | 2px |
| Primary | #000000 |
| Text secondary | #555555 |
| Text muted | #888888 |

---

## Save system

Items are persisted to `localStorage` under the key `irelia_saved` as a JSON array of product IDs.
