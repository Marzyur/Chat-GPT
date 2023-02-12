const {Configuration, OpenAIApi } = require("openai");
const OPENAI_API_KEY = "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"
exports.chatgpt = async (req, res) => {
    const {
    // api_key, 
    //     organization_key,
    //     model,
    //     prompt,
    //     temperature,
    //     max_tokens,
    //     top_p,
    //     frequency_penalty,
    //     presence_penalty,
        // stop,
        prompt
    } = req.body;

    const configuration = new Configuration({
        apiKey: OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    try {
    const response = await openai.createCompletion({
    // model: model,
    // prompt: prompt,
    // temperature: temperature,
    // max_tokens: 1000,
    // top_p: top_p,
    // frequency_penalty: frequency_penalty,
    // presence_penalty: presence_penalty,
    // stop: [stop],
    model: "text-davinci-003",
    prompt: prompt,
    max_tokens: 1000,
  });
  res.status(200).json({
    response : response.data.choices[0].text,
  })
}
catch(err){
    res.status(500).json({err: err.message})
}
}