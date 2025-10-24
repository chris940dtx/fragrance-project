import React, { useState } from "react";

interface Product {
  id: string;
  name: string;
  price: string;
  imageUrl: string;
}

function App() {
  
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Product[] | null>(null);
  const [error, setError] = useState("");

  //function used by input box
  //gets input from the user and sets it to searchterm state var
  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  //this function is going to be used when button is clicked and
  // the function sends "searchTerm" to the api/scraper
  // which then the backend sends a response back via json stored in data
  //then stored in "results" state var
  const handleSearch = async () => {
    //make api call to backend
    try {
      if (searchTerm === "") {
        setError("Please enter a fragrance");
        return;
      }

      const response = await fetch(
        `http://localhost:3001/api/search?q=${encodeURIComponent(searchTerm)}`
      );
      if (!response.ok) {
        throw new Error("failed to fetch");
      }

      //this is what backend is sending to frontend
      //server/index.ts sends JSON object that looks like this
      // {success: true, count: products.length, products: products}
      //  whole JSON object gets stored in data variable
      const data = await response.json();
      //setting the "products" property of data as the result
      setResults(data.products);
    } catch (error) {
      setError("Failed to search. Please try again");
      console.error("Search error:", error);
    }
  };

  return (
    <div>
      <h1>Fragrance search</h1>
      <input type="text" value={searchTerm} onChange={handleInput} />

      <button onClick={handleSearch}>Search</button>

      {/* error displayed w/ condiotnal rendring */}
      {error && <div>{error}</div>}

      {results && (
        <div>
          <h2>Results:</h2>
          {results.map((product) => (
            <div key={product.id}>
              <img src={product.imageUrl} alt={product.name} />
              <h3>{product.name}</h3>
              <p>Price: {product.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default App;
