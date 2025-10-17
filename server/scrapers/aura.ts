//figure out what to put for user-agent and then figure out how to get the specific data when inputing a fragrance name.
//DO THIS ^^^^
export async function searchFragrance(searchTerm: string): Promise<any> {
  if (!searchTerm) {
    //incase search input is empty or whitesapce
    throw new Error("Provide a fragrance name");
  }

  const url = `https://www.aurafragrance.com/products.json?q=${encodeURIComponent(
    searchTerm
  )}`;

  try {
    const response = await fetch(url, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        accept: "application/json, text/plain, */*",
      },
    });

    //chekcing if response was successful
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }

    const data = await response.json();
    return data.products;

  } catch (error) {
    //log error and rethrow
    console.error("Error seareching for fragrance:", error);
    throw error;
  }
}
