import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/*
 * Allow the server to receive JSON requests.
 */
app.use(express.json());

/*
 * Serve the dashboard.
 *
 * Open:
 *
 * http://localhost:3000/dashboard/
 */
app.use(
    "/dashboard",
    express.static(
        path.join(__dirname, "dashboard")
    )
);

/*
 * Serve the pipeline output.
 *
 * This makes the pipeline data available locally to the
 * dashboard regardless of where the repository is located.
 *
 * Example:
 *
 * http://localhost:3000/pipeline/
 */
app.use(
    "/pipeline",
    express.static(
        path.join(__dirname, "pipeline")
    )
);

/*
 * Chatbot endpoint.
 *
 * The browser communicates with this endpoint.
 *
 * The OpenRouter API key stays on this machine and is loaded
 * from the .env file.
 *
 * The browser never receives the API key.
 */
app.post("/api/chat", async (req, res) => {

    try {

        if (!process.env.OPENROUTER_API_KEY) {

            return res.status(500).json({
                error: {
                    message:
                        "OPENROUTER_API_KEY is not configured."
                }
            });
        }

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

        console.error(
            "OpenRouter request failed:"
        );

        console.error(error);

        res.status(500).json({
            error: {
                message:
                    "AI request failed."
            }
        });
    }
});

/*
 * Start the server.
 *
 * process.env.PORT allows the application to work on
 * different machines and hosting environments.
 *
 * 3000 is used when no PORT has been supplied.
 */
app.listen(PORT, "0.0.0.0", () => {

    console.log(
        `Syn AI server running on port ${PORT}`
    );

    console.log(
        `Dashboard: http://localhost:${PORT}/dashboard/`
    );

});