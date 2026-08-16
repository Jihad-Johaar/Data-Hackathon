
const services = {
    transactionBanking: {
        name: "Transaction Banking",

        offerings: [
            {
                name: "Payments",
                description:
                    "Payment solutions for corporate transactions."
            },
            {
                name: "Collections",
                description:
                    "Solutions for receiving and managing corporate collections."
            },
            {
                name: "Reconciliation Solutions",
                description:
                    "Solutions supporting reconciliation and visibility of corporate transactions."
            },
            {
                name: "Liquidity Management",
                description:
                    "Solutions for managing corporate cash positions and liquidity."
            },
            {
                name: "Guarantees",
                description:
                    "Bank guarantees supporting contractual and commercial obligations."
            },
            {
                name: "Trade Finance",
                description:
                    "Trade financing and documentary solutions supporting international commerce."
            },
            {
                name: "e-Channels",
                description:
                    "Digital channels providing corporate banking access and transaction capabilities."
            }
        ]
    },

    investmentBanking: {
        name: "Investment Banking",

        offerings: [
            {
                name: "Corporate Finance",
                description:
                    "Advisory and financing solutions for corporate strategic and financial requirements."
            },
            {
                name: "Equity Capital Markets",
                description:
                    "Solutions supporting equity capital raising and related corporate transactions."
            },
            {
                name: "Debt Primary Markets",
                description:
                    "Solutions supporting corporate debt issuance and capital raising."
            },
            {
                name: "Sector Financing and Advisory",
                description:
                    "Financing and advisory for mining, metals, energy and infrastructure."
            },
            {
                name: "Debt Solutions",
                description:
                    "Structured debt and financing solutions for corporate requirements."
            },
            {
                name: "Real Estate",
                description:
                    "Financing and advisory solutions related to real estate."
            },
            {
                name: "Structured Trade and Commodity Finance",
                description:
                    "Structured financing solutions supporting trade and commodity-related activities."
            }
        ]
    },

    globalMarkets: {
        name: "Global Markets",

        offerings: [
            {
                name: "Foreign Exchange",
                description:
                    "Solutions for managing foreign currency transactions and exposures."
            },
            {
                name: "Commodities",
                description:
                    "Solutions relating to commodity exposures and transactions."
            },
            {
                name: "Credit",
                description:
                    "Credit market solutions for corporate requirements."
            },
            {
                name: "Interest Rates",
                description:
                    "Solutions for managing interest-rate exposures."
            },
            {
                name: "Money Markets",
                description:
                    "Short-term funding and investment market solutions."
            },
            {
                name: "Equities",
                description:
                    "Equity market solutions and services."
            }
        ]
    }
};

function buildAIContext(client) {

    return {
        client: {
            name: client.name,
            sector: client.sector,
            hq: client.hq,
            relationship_manager: client.relationshipManager
        },

        banking_relationship: {
            estimated_wallet: client.estimatedWallet,
            syn_bank_wallet: client.synBankWallet,
            share_of_wallet: client.shareOfWallet,
            wallet_gap: client.walletGap,
            opportunity_score: client.opportunityScore,
            priority: client.priority
        },

        product_opportunities: client.products,

        evidence: client.evidence,

        external_financials: client.externalFinancials,

        existing_briefing: client.briefing,

        existing_next_step: client.nextStep,

        available_services: services
    };
}


function buildPrompt(context, question) {

    return `
You are Syn AI, a corporate and investment banking intelligence
assistant helping a relationship manager prepare for a client
conversation.

Your task is to answer the banker's question about the client
using ONLY the supplied client context.

The dashboard has already performed the financial calculations
and opportunity analysis.

You must NOT recalculate, reinterpret, or invent financial data.

IMPORTANT:

- Use the supplied client information as the source of truth.
- Do not invent financial figures.
- Do not invent products or banking services.
- Only refer to services contained in the supplied service catalogue.
- Do not claim that the client definitely needs a product.
- Distinguish observed information from inference.
- Treat estimated wallet values as estimates of potential banking
  wallet, not as company revenue or debt.
- Treat external financial information as information about the
  client's financial position.
- Do not equate banking wallet figures with external financial
  figures simply because their values are similar.
- Competitor leakage represents estimated potential outside the
  current bank relationship. It is not confirmed revenue captured
  by competitors.
- If the available information does not support a conclusion,
  explicitly say so.
- Do not use generic industry assumptions as if they were facts
  about this client.

AVAILABLE CIB SERVICES:

${JSON.stringify(services, null, 2)}

Use these services when answering questions about potential
banking opportunities.

If a service is relevant, use its exact name from the catalogue.

RESPONSE STYLE:

Answer naturally as a knowledgeable corporate or investment banker
speaking to another banker.

Do NOT return JSON.

Do NOT describe the data structure.

Do NOT mention fields, variables, prompts, or the AI.

Do NOT simply repeat every number supplied.

Focus on the question the banker actually asked.

Give a concise, commercially useful answer.

Where appropriate:

1. State the relevant fact.
2. Explain what it suggests.
3. Clearly distinguish that suggestion from a confirmed client need.
4. Explain what the banker could investigate next.

ACTIONABLE BUSINESS GUIDANCE:

When the question asks about an opportunity, recommendation,
next step, or service:

- Identify the relevant client signal.
- Connect that signal to an available CIB service.
- Explain why the service may be relevant.
- Suggest what the banker should investigate or discuss.
- Do not present a potential opportunity as a confirmed client need.
- Do not recommend a service merely because the client operates
  in an industry where that service is commonly used.

The purpose is to help the banker have a better conversation,
not to prescribe a product without evidence.

CLIENT CONTEXT:

${JSON.stringify(context, null, 2)}

BANKER'S QUESTION:

${question}

Return only the natural-language answer.
`;
}


async function askAI(client, question) {

    const context = buildAIContext(client);

    const prompt = buildPrompt(
        context,
        question
    );

    console.log("Sending question to AI:", question);

    const response = await fetch(
        "/api/chat",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                model: "openrouter/free",

                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ]
            })
        }
    );

    if (!response.ok) {

        const errorText = await response.text();

        throw new Error(
            `AI request failed: ${response.status} ${errorText}`
        );
    }

    const data = await response.json();

    if (
        !data.choices ||
        !data.choices[0] ||
        !data.choices[0].message
    ) {
        throw new Error(
            "AI returned an unexpected response."
        );
    }

    return data.choices[0].message.content;
}


window.askAI = askAI;