const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ─── Affiliate Feed Simulators ───────────────────────────────────────────────
// Each simulates the raw shape returned by the respective affiliate network.
// Swap these functions for real HTTP calls when live credentials are available.

async function fetchAwinProducts() {
  // Awin feed shape: flat object with camelCase + "aw_" prefixed fields
  return [
    {
      aw_product_id: "AW-001",
      product_name: "Tailored Blazer in Ivory",
      search_price: "189.00",
      merchant_image_url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80",
      brand_name: "Reiss",
      merchant_name: "Reiss",
      merchant_deep_link: "https://www.reiss.com",
      category_name: "Coats & Jackets",
      colour: "Ivory",
      aw_deep_link: "https://www.awin1.com/cread.php?awinmid=0000&awinaffid=0000&ued=https://www.reiss.com/p/tailored-blazer-ivory",
    },
    {
      aw_product_id: "AW-002",
      product_name: "Silk Slip Dress",
      search_price: "245.00",
      merchant_image_url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
      brand_name: "Reformation",
      merchant_name: "Reformation",
      merchant_deep_link: "https://www.thereformation.com",
      category_name: "Dresses",
      colour: "Black",
      aw_deep_link: "https://www.awin1.com/cread.php?awinmid=0000&awinaffid=0000&ued=https://www.thereformation.com/products/silk-slip-dress",
    },
    {
      aw_product_id: "AW-003",
      product_name: "Wide-Leg Trousers",
      search_price: "95.00",
      merchant_image_url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80",
      brand_name: "Arket",
      merchant_name: "Arket",
      merchant_deep_link: "https://www.arket.com",
      category_name: "Trousers",
      colour: "Camel",
      aw_deep_link: "https://www.awin1.com/cread.php?awinmid=0000&awinaffid=0000&ued=https://www.arket.com/en_gbp/women/trousers/wide-leg-trousers.html",
    },
    {
      aw_product_id: "AW-004",
      product_name: "Cashmere Crew Neck Jumper",
      search_price: "320.00",
      merchant_image_url: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80",
      brand_name: "Johnstons of Elgin",
      merchant_name: "Johnstons of Elgin",
      merchant_deep_link: "https://www.johnstonsofelgin.com",
      category_name: "Knitwear",
      colour: "Navy",
      aw_deep_link: "https://www.awin1.com/cread.php?awinmid=0000&awinaffid=0000&ued=https://www.johnstonsofelgin.com/cashmere-crew-neck",
    },
    {
      aw_product_id: "AW-005",
      product_name: "Linen Shirt Dress",
      search_price: "79.00",
      merchant_image_url: "https://images.unsplash.com/photo-1612722432474-b971cdcea546?w=600&q=80",
      brand_name: "& Other Stories",
      merchant_name: "& Other Stories",
      merchant_deep_link: "https://www.stories.com",
      category_name: "Dresses",
      colour: "White",
      aw_deep_link: "https://www.awin1.com/cread.php?awinmid=0000&awinaffid=0000&ued=https://www.stories.com/en_gbp/clothing/dresses/linen-shirt-dress.html",
    },
    {
      aw_product_id: "AW-006",
      product_name: "Leather Crossbody Bag",
      search_price: "195.00",
      merchant_image_url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
      brand_name: "Mango",
      merchant_name: "Mango",
      merchant_deep_link: "https://www.mango.com",
      category_name: "Bags",
      colour: "Tan",
      aw_deep_link: "https://www.awin1.com/cread.php?awinmid=0000&awinaffid=0000&ued=https://www.mango.com/en_gb/bags/crossbody-bags",
    },
    {
      aw_product_id: "AW-007",
      product_name: "Block Heel Mule",
      search_price: "130.00",
      merchant_image_url: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80",
      brand_name: "Kurt Geiger",
      merchant_name: "Kurt Geiger",
      merchant_deep_link: "https://www.kurtgeiger.com",
      category_name: "Shoes",
      colour: "Black",
      aw_deep_link: "https://www.awin1.com/cread.php?awinmid=0000&awinaffid=0000&ued=https://www.kurtgeiger.com/mules",
    },
    {
      aw_product_id: "AW-008",
      product_name: "Pleated Midi Skirt",
      search_price: "68.00",
      merchant_image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
      brand_name: "Zara",
      merchant_name: "Zara",
      merchant_deep_link: "https://www.zara.com",
      category_name: "Skirts",
      colour: "Sage",
      aw_deep_link: "https://www.awin1.com/cread.php?awinmid=0000&awinaffid=0000&ued=https://www.zara.com/gb/en/woman/skirts",
    },
    {
      aw_product_id: "AW-009",
      product_name: "Oversized Denim Jacket",
      search_price: "85.00",
      merchant_image_url: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600&q=80",
      brand_name: "Weekday",
      merchant_name: "Weekday",
      merchant_deep_link: "https://www.weekday.com",
      category_name: "Coats & Jackets",
      colour: "Blue",
      aw_deep_link: "https://www.awin1.com/cread.php?awinmid=0000&awinaffid=0000&ued=https://www.weekday.com/en_gbp/categories/women/jackets",
    },
    {
      aw_product_id: "AW-010",
      product_name: "Gold Hoop Earrings",
      search_price: "45.00",
      merchant_image_url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80",
      brand_name: "Missoma",
      merchant_name: "Missoma",
      merchant_deep_link: "https://www.missoma.com",
      category_name: "Accessories",
      colour: "Gold",
      aw_deep_link: "https://www.awin1.com/cread.php?awinmid=0000&awinaffid=0000&ued=https://www.missoma.com/collections/earrings",
    },
  ];
}

async function fetchRakutenProducts() {
  // Rakuten feed shape: nested "item" wrapper with PascalCase fields
  return [
    {
      item: {
        ItemID: "RAK-001",
        ItemName: "Ribbed Bodysuit",
        ItemPrice: "42.00",
        ImageURL: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80",
        Brand: "ASOS Design",
        Retailer: "ASOS",
        ItemURL: "https://www.asos.com/asos-design/ribbed-bodysuit/prd/12345",
        Category: "Tops",
        Color: "White",
      },
    },
    {
      item: {
        ItemID: "RAK-002",
        ItemName: "Slim Fit Chinos",
        ItemPrice: "59.00",
        ImageURL: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80",
        Brand: "Polo Ralph Lauren",
        Retailer: "John Lewis",
        ItemURL: "https://www.johnlewis.com/polo-ralph-lauren-slim-fit-chinos/p12345",
        Category: "Trousers",
        Color: "Khaki",
      },
    },
    {
      item: {
        ItemID: "RAK-003",
        ItemName: "Trench Coat",
        ItemPrice: "399.00",
        ImageURL: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&q=80",
        Brand: "Burberry",
        Retailer: "Selfridges",
        ItemURL: "https://www.selfridges.com/burberry/trench-coat",
        Category: "Coats & Jackets",
        Color: "Camel",
      },
    },
    {
      item: {
        ItemID: "RAK-004",
        ItemName: "Strappy Heeled Sandal",
        ItemPrice: "115.00",
        ImageURL: "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=600&q=80",
        Brand: "Dune London",
        Retailer: "Dune London",
        ItemURL: "https://www.dunelondon.com/strappy-heeled-sandal",
        Category: "Shoes",
        Color: "Nude",
      },
    },
    {
      item: {
        ItemID: "RAK-005",
        ItemName: "Structured Tote Bag",
        ItemPrice: "285.00",
        ImageURL: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80",
        Brand: "A.P.C.",
        Retailer: "MATCHESFASHION",
        ItemURL: "https://www.matchesfashion.com/products/a-p-c-tote-bag",
        Category: "Bags",
        Color: "Black",
      },
    },
    {
      item: {
        ItemID: "RAK-006",
        ItemName: "Oxford Button-Down Shirt",
        ItemPrice: "75.00",
        ImageURL: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&q=80",
        Brand: "Ralph Lauren",
        Retailer: "Ralph Lauren",
        ItemURL: "https://www.ralphlauren.co.uk/oxford-shirt",
        Category: "Tops",
        Color: "Blue",
      },
    },
    {
      item: {
        ItemID: "RAK-007",
        ItemName: "Slim Tapered Jeans",
        ItemPrice: "89.00",
        ImageURL: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=600&q=80",
        Brand: "Levi's",
        Retailer: "ASOS",
        ItemURL: "https://www.asos.com/levis/slim-tapered-jeans/prd/99999",
        Category: "Jeans",
        Color: "Indigo",
      },
    },
    {
      item: {
        ItemID: "RAK-008",
        ItemName: "Merino Polo Shirt",
        ItemPrice: "110.00",
        ImageURL: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&q=80",
        Brand: "John Smedley",
        Retailer: "John Smedley",
        ItemURL: "https://www.johnsmedley.com/merino-polo",
        Category: "Tops",
        Color: "Navy",
      },
    },
    {
      item: {
        ItemID: "RAK-009",
        ItemName: "Leather Belt",
        ItemPrice: "55.00",
        ImageURL: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
        Brand: "Anderson's",
        Retailer: "Mr Porter",
        ItemURL: "https://www.mrporter.com/en-gb/mens/product/andersons/leather-belt",
        Category: "Accessories",
        Color: "Brown",
      },
    },
    {
      item: {
        ItemID: "RAK-010",
        ItemName: "Wool Overcoat",
        ItemPrice: "495.00",
        ImageURL: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&q=80",
        Brand: "Cos",
        Retailer: "COS",
        ItemURL: "https://www.cos.com/en_gbp/men/menswear/jackets-coats/wool-overcoat.html",
        Category: "Coats & Jackets",
        Color: "Grey",
      },
    },
  ];
}

async function fetchImpactProducts() {
  // Impact feed shape: snake_case with "imp_" prefix on some IDs
  return [
    {
      imp_id: "IMP-001",
      name: "Printed Wrap Dress",
      price_gbp: "135.00",
      img: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80",
      brand: "Diane von Furstenberg",
      store: "Net-a-Porter",
      url: "https://www.net-a-porter.com/en-gb/shop/product/diane-von-furstenberg/wrap-dress",
      product_type: "Dresses",
      primary_colour: "Multicolour",
    },
    {
      imp_id: "IMP-002",
      name: "High-Waisted Shorts",
      price_gbp: "49.00",
      img: "https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=600&q=80",
      brand: "Topshop",
      store: "ASOS",
      url: "https://www.asos.com/topshop/high-waist-shorts/prd/33333",
      product_type: "Shorts",
      primary_colour: "Black",
    },
    {
      imp_id: "IMP-003",
      name: "Chunky Knit Cardigan",
      price_gbp: "98.00",
      img: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80",
      brand: "Monki",
      store: "Monki",
      url: "https://www.monki.com/en_gbp/clothing/cardigans/chunky-knit-cardigan.html",
      product_type: "Knitwear",
      primary_colour: "Cream",
    },
    {
      imp_id: "IMP-004",
      name: "Platform Trainer",
      price_gbp: "155.00",
      img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
      brand: "New Balance",
      store: "JD Sports",
      url: "https://www.jdsports.co.uk/product/new-balance-platform-trainer",
      product_type: "Shoes",
      primary_colour: "White",
    },
    {
      imp_id: "IMP-005",
      name: "Quilted Chain Shoulder Bag",
      price_gbp: "1250.00",
      img: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&q=80",
      brand: "Chanel",
      store: "Selfridges",
      url: "https://www.selfridges.com/chanel/quilted-chain-bag",
      product_type: "Bags",
      primary_colour: "Black",
    },
    {
      imp_id: "IMP-006",
      name: "Satin Midi Skirt",
      price_gbp: "72.00",
      img: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&q=80",
      brand: "Ghost",
      store: "Ghost",
      url: "https://www.ghost.co.uk/collections/skirts/satin-midi-skirt",
      product_type: "Skirts",
      primary_colour: "Champagne",
    },
    {
      imp_id: "IMP-007",
      name: "Leather Chelsea Boot",
      price_gbp: "220.00",
      img: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&q=80",
      brand: "Whistles",
      store: "Whistles",
      url: "https://www.whistles.com/footwear/boots/leather-chelsea-boot.html",
      product_type: "Shoes",
      primary_colour: "Black",
    },
    {
      imp_id: "IMP-008",
      name: "Sheer Organza Blouse",
      price_gbp: "88.00",
      img: "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=600&q=80",
      brand: "Ganni",
      store: "GANNI",
      url: "https://www.ganni.com/en-gb/clothing/tops/organza-blouse.html",
      product_type: "Tops",
      primary_colour: "Pink",
    },
    {
      imp_id: "IMP-009",
      name: "Minimalist Watch",
      price_gbp: "199.00",
      img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
      brand: "CLUSE",
      store: "CLUSE",
      url: "https://www.cluse.com/en-gb/collections/watches",
      product_type: "Accessories",
      primary_colour: "Silver",
    },
    {
      imp_id: "IMP-010",
      name: "Straight Leg Jeans",
      price_gbp: "65.00",
      img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80",
      brand: "Agolde",
      store: "MATCHESFASHION",
      url: "https://www.matchesfashion.com/products/agolde-straight-leg-jeans",
      product_type: "Jeans",
      primary_colour: "Denim",
    },
  ];
}

// ─── Normalisers ──────────────────────────────────────────────────────────────

function normaliseAwin(raw) {
  return {
    id: `awin-${raw.aw_product_id}`,
    title: raw.product_name,
    price: `£${parseFloat(raw.search_price).toFixed(2)}`,
    image: raw.merchant_image_url,
    brand: raw.brand_name,
    retailer: raw.merchant_name,
    productUrl: raw.aw_deep_link,
    category: raw.category_name,
    color: raw.colour,
    source: "awin",
  };
}

function normaliseRakuten(raw) {
  const item = raw.item;
  return {
    id: `rakuten-${item.ItemID}`,
    title: item.ItemName,
    price: `£${parseFloat(item.ItemPrice).toFixed(2)}`,
    image: item.ImageURL,
    brand: item.Brand,
    retailer: item.Retailer,
    productUrl: item.ItemURL,
    category: item.Category,
    color: item.Color,
    source: "rakuten",
  };
}

function normaliseImpact(raw) {
  return {
    id: `impact-${raw.imp_id}`,
    title: raw.name,
    price: `£${parseFloat(raw.price_gbp).toFixed(2)}`,
    image: raw.img,
    brand: raw.brand,
    retailer: raw.store,
    productUrl: raw.url,
    category: raw.product_type,
    color: raw.primary_colour,
    source: "impact",
  };
}

// ─── Route ────────────────────────────────────────────────────────────────────

app.get("/api/products", async (req, res) => {
  try {
    const [awinRaw, rakutenRaw, impactRaw] = await Promise.all([
      fetchAwinProducts(),
      fetchRakutenProducts(),
      fetchImpactProducts(),
    ]);

    const products = [
      ...awinRaw.map(normaliseAwin),
      ...rakutenRaw.map(normaliseRakuten),
      ...impactRaw.map(normaliseImpact),
    ];

    res.json({ products });
  } catch (err) {
    console.error("Failed to fetch products:", err);
    res.status(500).json({ error: "Failed to load products" });
  }
});

// ─── Serve React build in production ─────────────────────────────────────────

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`IRELIA API running on port ${PORT}`);
});
