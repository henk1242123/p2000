// netlify/functions/proxy.js
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const feedUrl = event.queryStringParameters.feed;
  if (!feedUrl) {
    return { statusCode: 400, body: JSON.stringify({ error: "Geen feed URL opgegeven" }) };
  }

  try {
    const response = await fetch(feedUrl);
    const text = await response.text();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/xml" },
      body: text
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
