export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { input, tone } = req.body;

  if (!input || !tone) {
    return res.status(400).json({ message: 'Missing input or tone' });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 800,
        messages: [
          {
            role: "user",
            content: `Fix the grammar and spelling in this message and turn it into a professional email:

"${input}"

Make it ${tone} in tone. Fix all typos and grammar errors. Format numbers properly. Create a subject line.

Write a complete professional email.`
          }
        ]
      })
    });

    if (!response.ok) {
      console.error('API Response not OK:', response.status, response.statusText);
      return res.status(500).json({ message: 'API request failed' });
    }

    const data = await response.json();
    
    if (data.content && data.content[0] && data.content[0].text) {
      const email = data.content[0].text;
      return res.status(200).json({ email });
    } else {
      console.error('Unexpected response format:', data);
      return res.status(500).json({ message: 'Unexpected response format' });
    }
    
  } catch (error) {
    console.error('Error details:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
}
