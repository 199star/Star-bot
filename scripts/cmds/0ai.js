const axios = require('axios');

const Prefixes = [
  'gpt',
  'ai',
  'morning',
  'star',
];

module.exports = {
  config: {
    name: 'chatgpt',
    version: '2.0',
    author: 'Aryan Chauhan',
    role: 0,
    category: 'ai',
    shortDescription: {
      en: 'Asks an AI for an answer.',
    },
    longDescription: {
      en: 'Asks an AI for an answer based on the user prompt.',
    },
    guide: {
      en: '{pn} [prompt]',
    },
  },
  onStart: async function () {},
  onChat: async function ({ api, event, args, message }) {
    try {
      const prefix = Prefixes.find((p) => event.body && event.body.toLowerCase().startsWith(p)); 

      if (!prefix) {
        return;
      }

      const prompt = event.body.substring(prefix.length).trim();

      const response = await axios.get(`http://ai-technology.onrender.com/api/starai?prompt=${encodeURIComponent(prompt)}`);

      if (response.status !== 200 || !response.data) {
        throw new Error('Invalid or missing response from API');
      }

      const messageText = response.data.fullResponse;

      await api.sendMessage(messageText, event.threadID);

      console.log('Sent answer as a reply to user');
    } catch (error) {
      console.error(`Failed to get answer: ${error.message}`);
      api.sendMessage(
        `${error.message}. You can try typing your question again or resending it, as there might be a bug from the server that's causing the problem. It might resolve the issue.`,
        event.threadID
      );
    }
  },
};
