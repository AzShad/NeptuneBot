/*const axios = require('axios');

module.exports ={
    name: "chat",
    description: "Ask a question to chat GPT",
    options: [
        {
            name: "question",
            description: "Ask your question to chat GPT",
            type: "STRING",
            required: true,
        },
    ],

    run: async(client, interaction, args) => {

        const question = interaction.options.getString('question');
        // Envoie la question à ChatGPT et récupère la réponse
        const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
            prompt: `Q: ${question}\nA:`,
            max_tokens: 50,
            temperature: 0.5,
            n: 1,
            stop: '\n'
        }, {
            headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
            }
        });
        // Envoie la réponse à l'utilisateur
        await interaction.reply(response.data.choices[0].text);
    },
};*/