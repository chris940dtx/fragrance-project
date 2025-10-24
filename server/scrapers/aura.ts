//Two step scraper, gets search results for the searchTerm,
//then vists indiviual product page to get the data
import * as cheerio from "cheerio";

export async function searchFragrance(searchTerm: string): Promise<any> {
  if (!searchTerm) {
    //in case search input is empty or whitesapce
    throw new Error("Provide a fragrance name");
  }

  //builds search url
  const url = `https://www.aurafragrance.com/search?q=${encodeURIComponent(
    searchTerm
  )}`;

  try {
    const response = await fetch(url, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*,q=0.8",
      },
    });

    //chekcing if response was successful
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }

    const html = await response.text(); // get raw HTMl as string
    const $ = cheerio.load(html); //load html into cheerio

    // visitng the search page to get the products indivual page
    const firstProductLink = $(".grid-item.search-result") // this is the css class selectors
      .first() // only first product
      .find("a") // gets link inisde the product
      .attr("href"); // gets the url from link

    //check if link returns a product's indivual page link
    if (!firstProductLink) {
      throw new Error("No products found");
    }

    console.log(`Fetching first product: ${firstProductLink}`);

    const fullProductUrl = firstProductLink.startsWith("http")
      ? firstProductLink
      : `https://www.aurafragrance.com${firstProductLink}`;

    // visiting the product page get the data
    const productResponse = await fetch(fullProductUrl, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    if (!productResponse.ok) {
      throw new Error(
        `Failed to fetch product page: ${productResponse.status}`
      );
    }
    //convert indiviual product page HTML
    const productHtml = await productResponse.text();
    const $product = cheerio.load(productHtml); // allows to search thru product indiviual page

    //follwing try catch is for geting the productId
    //more complicated bc inside tag contains 2 properties productId and variantId
    //we need to extract only the productId property
    let productId = "";
    try {
      // finds script tag with id="shop-promise-product"
      //.html() gets content inside of script tag(the json string)
      const productScript = $product("#shop-promise-product").html();
      // if there is such a tag
      if (productScript) {
        //convert json string into JS object
        const productData = JSON.parse(productScript);
        //extract productId property from parsed object
        //object looks like this
        //{productId: "7312085876799"(want this), variantId: "40475586166847"}
        productId = productData.productId || "";
      }
    } catch (error) {
      console.log("Could not extract product ID:", error);
    }
    //extracting data using css selectors
    const name = $product("h1").text().trim();
    const imageUrl = $product('meta[itemprop="image"]').attr("content") || "";
    const priceValue = $product('meta[itemprop="price"]').attr("content") || "";
    const price = priceValue ? `$${priceValue}` : "Price not found";

    console.log(`First product: ${name} - ${price}`);
    // returns the name,price,imagerurl together to whoever/wtv called this function
    // returning an array to index.ts bc its expecting an array
    return [
      {
        id: productId,
        name,
        price,
        imageUrl,
      },
    ];
  } catch (error) {
    //log error and rethrow
    console.error("Error searching for fragrance:", error);
    throw error;
  }
}
