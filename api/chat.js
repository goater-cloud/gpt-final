export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  try {
    const { message } = await req.json();

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1',
        messages: [{ role: 'user', content: message }]
      })
    });

    const data = await response.json();

    if (data.error) {
      return new Response(JSON.stringify({
        choices: [{
          message: {
            content: `OpenAI error: ${data.error.message}`
          }
        }]
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({
      choices: [{
        message: {
          content: `Server error: ${err.message}`
        }
      }]
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
