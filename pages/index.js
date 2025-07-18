import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [input, setInput] = useState('');
  const [tone, setTone] = useState('professional');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const tones = {
    professional: 'Professional and formal',
    warm: 'Warm and friendly',
    concise: 'Concise and to-the-point',
    casual: 'Casual and conversational',
    persuasive: 'Persuasive and compelling',
    empathetic: 'Empathetic and understanding'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: input.trim(),
          tone: tone,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setOutput(data.email);
      } else {
        setOutput('Sorry, there was an error generating your email. Please try again.');
      }
    } catch (error) {
      setOutput('Sorry, there was an error generating your email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      alert('Email copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <>
      <Head>
        <title>Mirank AI Email Writer</title>
        <meta name="description" content="Transform your thoughts into professional emails with AI" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Mirank AI Email Writer
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Transform your raw thoughts into polished, professional emails with the power of AI
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Input Section */}
                  <div>
                    <label htmlFor="input" className="block text-sm font-medium text-gray-700 mb-2">
                      What would you like to say?
                    </label>
                    <textarea
                      id="input"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Tell me what you want to communicate... I'll help you write it professionally!"
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                      rows={4}
                      required
                    />
                  </div>

                  {/* Tone Selection */}
                  <div>
                    <label htmlFor="tone" className="block text-sm font-medium text-gray-700 mb-2">
                      Choose your tone
                    </label>
                    <select
                      id="tone"
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    >
                      {Object.entries(tones).map(([key, description]) => (
                        <option key={key} value={key}>
                          {description}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Generate Button */}
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating your email...
                      </div>
                    ) : (
                      'Generate Email'
                    )}
                  </button>
                </form>
              </div>

              {/* Output Section */}
              {output && (
                <div className="border-t border-gray-200 bg-gray-50 p-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Your Generated Email</h3>
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy
                    </button>
                  </div>
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <pre className="whitespace-pre-wrap text-gray-800 font-sans leading-relaxed">
                      {output}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-12 text-gray-500">
            <p>Powered by Mirank AI • Built with Next.js & Tailwind CSS</p>
          </div>
        </div>
      </div>
    </>
  );
}
