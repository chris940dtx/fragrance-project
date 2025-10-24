import express from "express"; //framework that creates the web server 
import cors from "cors"; // allows React to talk to Express (prt 3000 talk w/ 3001)

import { searchFragrance } from "./scrapers/aura"; // scraper fucntion

const app = express();// creating express app
const PORT = 3001;
//CORS allows your React app (port 3000) to talk to Express (port 3001)
//app.use is the middleware, run b4 route handlers
app.use(cors());
//allows Express to undertsand JSON in request 
app.use(express.json());// need this when sending data from react to Express


app.get("/api/search", async (req, res) => { // this is the request from the frontend
    //req- info from the client, res- send data back to client 
    try {
        const fragranceName = req.query.q as string; 

        //basically an error handler? validating they provided a fragrance name
        if (!fragranceName) {
            return res.status(400).json({
                error:"please provide a fragrance name"
            });
        }
        //pause everything until searchFragrance function 
        // from aura.ts scraper file happens
        //and then continue 
        const products = await searchFragrance(fragranceName);

        // sending results as an array(bc of the return on aura.ts)
        //  back as JSON to the frontend
        res.json({
            success: true,
            count: products.length,
            products: products
        });

    } catch (error) {
        console.error("Error in /api/search:", error);
        res.status(500).json({
            success: false, 
            error: "Failed to search for fragrance" 
        });
    }
});

app.listen(PORT, () =>{
    console.log(`Server running on http://localhost:${PORT} `)
});