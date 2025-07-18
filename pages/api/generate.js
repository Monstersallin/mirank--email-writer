export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { input, tone } = req.body;

  if (!input || !tone) {
    return res.status(400).json({ message: 'Missing input or tone' });
  }

  // Debug logging
  console.log('API Called with:', { input, tone });

  try {
    const promptContent = `You are a professional email writing assistant. Transform the user's rough input into a well-structured, grammatically correct, professional email.

USER INPUT: "${input}"
REQUESTED TONE: ${tone}

CRITICAL INSTRUCTIONS:
1. NEVER use generic templates or placeholder text
2. READ the user input carefully and understand what they actually want to communicate
3. Fix ALL grammar, spelling, and punctuation errors
4. Improve sentence structure and clarity
5. Format numbers properly (e.g., $2,324 instead of $2324)
6. Fix typos (e.g., "travek" should be "travel", "vosts" should be "costs")
7. Make the language professional and clear
8. Create a specific subject line based on the actual content
9. Write a complete email that addresses the user's specific request

EXAMPLE TRANSFORMATION:
Input: "need approve budget travek asia supplier vosts $2324"
Should become: A clear email requesting approval for a $2,324 travel budget to Asia including supplier costs

DO NOT use generic phrases like "This initiative represents a strategic opportunity" unless it actually relates to the user's specific request.

Write a professional email that directly addresses what the user is asking for:`;

    console.log('Sending prompt:', promptContent);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: promptContent
          }
        ]
      })
    });

    const data = await response.json();
    console.log('Claude response:', data);
    
    if (response.ok) {
      const email = data.content[0].text;
      console.log('Generated email:', email);
      res.status(200).json({ email });
    } else {
      console.error('Claude API Error:', data);
      res.status(500).json({ message: 'Failed to generate email' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
