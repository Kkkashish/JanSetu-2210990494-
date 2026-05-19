const { Translate } = require("@google-cloud/translate").v2;

const translate = new Translate({
  key: "YOUR_GOOGLE_API_KEY",
});

const translateToEnglish = async (text) => {
  try {
    const [translation] = await translate.translate(text, "en");
    return translation;
  } catch (error) {
    console.error("Translation Error:", error);
    return text; // fallback
  }
};

module.exports = translateToEnglish;