const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

function doStuff() {
    return openai.chat.completions.create({
        messages: [{ role: "user", content: "Say this is a test" }],
        model: "gpt-3.5-turbo",
    }).then(chatCompletion => {
        console.log(chatCompletion);
    }).catch(err => {
        console.error(err);
    });
}

doStuff();
