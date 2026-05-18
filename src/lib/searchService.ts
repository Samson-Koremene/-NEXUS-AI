export interface SearchResultItem {
  title: string;
  link: string;
  snippet: string;
}

export async function searchWeb(query: string, apiKey: string): Promise<SearchResultItem[]> {
  const res = await fetch('https://google.serper.dev/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': apiKey
    },
    body: JSON.stringify({
      q: query,
      num: 5
    })
  });

  if (!res.ok) {
    throw new Error(`Serper API error: ${res.status}`);
  }

  const data = await res.json();
  return (data.organic || []).map((item: any) => ({
    title: item.title,
    link: item.link,
    snippet: item.snippet
  }));
}
