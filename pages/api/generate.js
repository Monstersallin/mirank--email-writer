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
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: `You are a professional email writing assistant. Your task is to transform the user's rough input into a well-structured, grammatically correct, professional email.

USER INPUT: "${input}"
REQUESTED TONE: ${tone}

INSTRUCTIONS:
1. Fix ALL grammar, spelling, and punctuation errors
2. Improve sentence structure and clarity
3. Format numbers properly (e.g., $24,234 instead of $24234)
4. Fix typos (e.g., "travek" should be "travel")
5. Make the language more professional and clear
6. Create a proper subject line
7. Structure it as a complete email with greeting, body, and closing

TONE GUIDELINES:
- formal: Professional, respectful, structured
- friendly: Warm but professional, approachable
- direct: Clear, concise, straight to the point
- casual: Relaxed but still professional
- persuasive: Compelling, emphasizing benefits
- empathetic: Understanding, considerate

OUTPUT FORMAT:
Subject: [Clear, descriptive subject line]

Dear [Recipient Name],

[Well-structured email body that clearly communicates the user's intent with proper grammar and professional language]

Best regards,
[Your Name]

Generate the email now:`
          }
        ]
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      const email = data.content[0].text;
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
