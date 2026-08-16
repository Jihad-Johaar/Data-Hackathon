import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/*
 * Allow the server to receive JSON requests.
 */
app.use(express.json());

/*
 * Serve the existing dashboard.
 *
 * This means:
 *
 * http://localhost:3000/dashboard/
 *
 * will load dashboard/index.html
 */
app.use(
    "/dashboard",
    express.static(
        path.join(__dirname, "dashboard")
    )
);

app.use(
    "/pipeline",
    express.static(
        path.join(__dirname, "pipeline")
    )
);

/*
 * Chatbot endpoint.
 *
 * The browser calls this endpoint.
 * The OpenRouter API key never reaches the browser.
 */
app.post("/api/chat", async (req, res) => {

    try {

        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization":
                        `Bearer ${process.env.OPENROUTER_API_KEY}`
                },

                body: JSON.stringify(req.body)
            }
        );

        const data = await response.json();

        res
            .status(response.status)
            .json(data);

    } catch (error) {

        console.error("OpenRouter request failed:");
        console.error(error);

        res.status(500).json({
            error: {
                message: "AI request failed."
            }
        });
    }
});

/*
 * Start the server.
 */
app.listen(PORT, () => {

    console.log(
        `Syn AI server running at http://localhost:${PORT}`
    );

});