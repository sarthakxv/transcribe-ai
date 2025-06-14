"use server";

import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

// Tavily search function
async function searchWithTavily(query: string): Promise<string> {
  if (!process.env.TAVILY_API_KEY) {
    return "Search functionality requires Tavily API key configuration.";
  }
  
  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: process.env.TAVILY_API_KEY,
        query,
        search_depth: "basic",
        include_answer: true,
        max_results: 3
      }),
    });
    
    const data = await response.json();
    
    if (data.answer) {
      return data.answer;
    }
    
    if (data.results && data.results.length > 0) {
      return data.results
        .map((result: any) => `${result.title}: ${result.content}`)
        .join('\n\n');
    }
    
    return "No relevant search results found.";
  } catch (error) {
    console.error("Tavily search error:", error);
    return "Search functionality is currently unavailable.";
  }
}

export async function askAboutTranscript(
  question: string,
  transcript: { text: string }[]
) {
  const system = `You are an assistant who answers questions using the transcript provided and can search for additional information when needed.
  
  First, try to answer using only the transcript. If the answer is not in the transcript or you need additional context, you can use the search function to find relevant information.
  
  When using search results, clearly indicate what information came from the transcript vs. external sources.`;

  const content = transcript.map(l => l.text).join("\n");
  
  const tools = [
    {
      type: "function" as const,
      function: {
        name: "search_web",
        description: "Search the web for additional information when the transcript doesn't contain the answer",
        parameters: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "The search query to find relevant information"
            }
          },
          required: ["query"]
        }
      }
    }
  ];

  let messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: "system", content: system },
    { role: "user", content: `Transcript:\n${content}` },
    { role: "user", content: question }
  ];

  const firstResponse = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    tools,
    tool_choice: "auto",
    temperature: 0.2,
  });

  const firstChoice = firstResponse.choices[0];
  
  if (firstChoice.message.tool_calls && firstChoice.message.tool_calls.length > 0) {
    messages.push(firstChoice.message);
    
    for (const toolCall of firstChoice.message.tool_calls) {
      if (toolCall.function.name === "search_web") {
        const args = JSON.parse(toolCall.function.arguments);
        
        // Use Tavily instead of the other search functions
        const searchResults = await searchWithTavily(args.query);
        
        messages.push({
          role: "tool",
          content: searchResults,
          tool_call_id: toolCall.id
        });
      }
    }
    
    const finalResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.2,
    });
    
    return finalResponse.choices[0]?.message.content ?? "";
  }
  
  return firstChoice.message.content ?? "";
}
