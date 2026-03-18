const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const FIRECRAWL_API = 'https://api.firecrawl.dev/v1';
const AI_GATEWAY = 'https://ai.gateway.lovable.dev/v1/chat/completions';

async function searchJobs(apiKey: string, query: string, limit = 5): Promise<any[]> {
  try {
    const response = await fetch(`${FIRECRAWL_API}/search`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        limit,
        scrapeOptions: { formats: ['markdown'] },
      }),
    });
    const data = await response.json();
    return data?.data || [];
  } catch (e) {
    console.error('Search failed for:', query, e);
    return [];
  }
}

async function analyzeWithAI(lovableKey: string, role: string, scrapedData: string): Promise<any> {
  const systemPrompt = `You are a career intelligence analyst. Analyze job market data and return structured JSON.
CRITICAL RULES:
- Only include data you can confirm from the provided sources. 
- If uncertain, use "Unknown" for that field.
- Never fabricate company names, salary numbers, or statistics.
- Cross-reference data points when multiple sources mention the same information.
- Remove duplicates and irrelevant information.`;

  const userPrompt = `Analyze the following scraped job market data for the role: "${role}"

Scraped Data:
${scrapedData.slice(0, 12000)}

Return a JSON object with this exact structure:
{
  "role": "${role}",
  "summary": "Brief 2-sentence market overview",
  "companies": [
    {
      "name": "Company Name",
      "industry": "Industry",
      "openPositions": "number or Unknown",
      "keyTechnologies": ["tech1", "tech2"],
      "avgExperience": "e.g. 3-5 years or Unknown",
      "jobUrl": "URL if found, otherwise null"
    }
  ],
  "topSkills": ["skill1", "skill2", "skill3"],
  "emergingSkills": ["skill1", "skill2"],
  "decliningSkills": ["skill1"],
  "salaryRanges": [
    { "region": "USA", "range": "$X - $Y", "currency": "USD" },
    { "region": "Europe", "range": "€X - €Y", "currency": "EUR" },
    { "region": "India", "range": "₹XL - ₹YL", "currency": "INR" }
  ],
  "hiringTrends": {
    "topCountries": ["country1", "country2", "country3"],
    "topCities": ["city1", "city2", "city3"],
    "demandScore": 0-100,
    "growthRate": "percentage or Unknown"
  },
  "experienceLevels": {
    "junior": { "years": "0-2", "avgSalary": "range or Unknown" },
    "mid": { "years": "3-5", "avgSalary": "range or Unknown" },
    "senior": { "years": "6+", "avgSalary": "range or Unknown" }
  },
  "jobLinks": [
    { "company": "Company", "role": "Role Title", "url": "URL" }
  ],
  "dataConfidence": "high/medium/low",
  "sourcesAnalyzed": number
}

Only include companies and data actually found in the scraped content. If no salary data is found, use "Unknown".`;

  try {
    const response = await fetch(AI_GATEWAY, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        tools: [{
          type: 'function',
          function: {
            name: 'return_career_intelligence',
            description: 'Return structured career intelligence data',
            parameters: {
              type: 'object',
              properties: {
                role: { type: 'string' },
                summary: { type: 'string' },
                companies: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      industry: { type: 'string' },
                      openPositions: { type: 'string' },
                      keyTechnologies: { type: 'array', items: { type: 'string' } },
                      avgExperience: { type: 'string' },
                      jobUrl: { type: 'string' },
                    },
                    required: ['name', 'industry'],
                  },
                },
                topSkills: { type: 'array', items: { type: 'string' } },
                emergingSkills: { type: 'array', items: { type: 'string' } },
                decliningSkills: { type: 'array', items: { type: 'string' } },
                salaryRanges: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      region: { type: 'string' },
                      range: { type: 'string' },
                      currency: { type: 'string' },
                    },
                    required: ['region', 'range'],
                  },
                },
                hiringTrends: {
                  type: 'object',
                  properties: {
                    topCountries: { type: 'array', items: { type: 'string' } },
                    topCities: { type: 'array', items: { type: 'string' } },
                    demandScore: { type: 'number' },
                    growthRate: { type: 'string' },
                  },
                },
                experienceLevels: {
                  type: 'object',
                  properties: {
                    junior: {
                      type: 'object',
                      properties: { years: { type: 'string' }, avgSalary: { type: 'string' } },
                    },
                    mid: {
                      type: 'object',
                      properties: { years: { type: 'string' }, avgSalary: { type: 'string' } },
                    },
                    senior: {
                      type: 'object',
                      properties: { years: { type: 'string' }, avgSalary: { type: 'string' } },
                    },
                  },
                },
                jobLinks: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      company: { type: 'string' },
                      role: { type: 'string' },
                      url: { type: 'string' },
                    },
                    required: ['company', 'role', 'url'],
                  },
                },
                dataConfidence: { type: 'string' },
                sourcesAnalyzed: { type: 'number' },
              },
              required: ['role', 'summary', 'topSkills', 'hiringTrends'],
            },
          },
        }],
        tool_choice: { type: 'function', function: { name: 'return_career_intelligence' } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return { error: 'Rate limited. Please try again in a moment.' };
      }
      if (response.status === 402) {
        return { error: 'AI credits exhausted. Please add credits in workspace settings.' };
      }
      const text = await response.text();
      console.error('AI gateway error:', response.status, text);
      return { error: 'AI analysis failed' };
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      return JSON.parse(toolCall.function.arguments);
    }

    // Fallback: try to parse content directly
    const content = data.choices?.[0]?.message?.content;
    if (content) {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
    }

    return { error: 'Failed to parse AI response' };
  } catch (e) {
    console.error('AI analysis error:', e);
    return { error: 'AI analysis failed: ' + (e instanceof Error ? e.message : 'Unknown error') };
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { role } = await req.json();

    if (!role || typeof role !== 'string' || role.length > 100) {
      return new Response(
        JSON.stringify({ success: false, error: 'Valid role name is required (max 100 chars)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const firecrawlKey = Deno.env.get('FIRECRAWL_API_KEY');
    const lovableKey = Deno.env.get('LOVABLE_API_KEY');

    if (!firecrawlKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    if (!lovableKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'AI gateway not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Analyzing role:', role);

    // Run multiple searches in parallel for comprehensive data
    const searchQueries = [
      `${role} job openings 2025 hiring companies`,
      `${role} salary range USA Europe India 2025`,
      `${role} required skills technologies 2025`,
      `${role} hiring trends top companies remote`,
    ];

    const results = await Promise.all(
      searchQueries.map(q => searchJobs(firecrawlKey, q, 5))
    );

    // Combine all scraped content
    const allResults = results.flat();
    const scrapedContent = allResults
      .map((r, i) => `[Source ${i + 1}] ${r.title || ''}\nURL: ${r.url || ''}\n${r.markdown || r.description || ''}`)
      .join('\n\n---\n\n');

    console.log(`Scraped ${allResults.length} sources. Running AI analysis...`);

    // Analyze with AI
    const analysis = await analyzeWithAI(lovableKey, role, scrapedContent);

    if (analysis.error) {
      return new Response(
        JSON.stringify({ success: false, error: analysis.error }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Enrich with source count
    analysis.sourcesAnalyzed = allResults.length;

    return new Response(
      JSON.stringify({ success: true, data: analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Career intelligence error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
