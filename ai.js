const categories = ['Royalty & Payments','ISBN & Metadata Issues','Printing & Quality','Distribution & Availability','Book Status & Production Updates','General Inquiry'];
const knowledgeBase = `BookLeaf is a self-publishing company operating in India and the US. Packages: Standard Free and paid Bestseller Breakthrough. Royalty split is 80% of net profit to author and 20% to BookLeaf. Net profit = MRP minus printing cost, platform commission and shipping. Royalties are calculated quarterly and paid within 45 days of quarter end; minimum payout is ₹1,000, below which amounts roll over. Payouts go by bank transfer to the linked dashboard account. Every BookLeaf book gets a unique ISBN under BookLeaf's imprint; ISBN errors are high priority and production team should be escalated within 48 hours. Standard printing turnaround is 5–7 business days. Verified print defects qualify for free reprint; request photos. Listings generally go live 7–10 business days after publication. Availability issues can be re-synced in 24–48 hours. Production stages: Manuscript Received, Editing, Cover Design, Typesetting, Proofreading, ISBN Assignment, Printing, Distribution Setup, Published & Live. Metadata changes usually reflect in 3–5 business days. Tone: empathetic, professional, specific, own mistakes, give a clear next step and timeline. Never invent account-specific facts or payout dates.`;
function fallback(text){
 const t=text.toLowerCase();
 let category='General Inquiry';
 if(/royalt|payment|payout|paid|earning|money|₹|bank/.test(t)) category=categories[0];
 else if(/isbn|metadata|author bio|description/.test(t)) category=categories[1];
 else if(/print|misprint|binding|blurry|quality|pages/.test(t)) category=categories[2];
 else if(/amazon|flipkart|unavailable|listing|distribution|stock/.test(t)) category=categories[3];
 else if(/status|production|typesetting|proof|cover|published|delay/.test(t)) category=categories[4];
 let priority='Low';
 if(/urgent|fraud|wrong isbn|duplicate isbn|wrong book|no royalty|6 months|defect|misprint|not received|overdue|serious/.test(t)) priority='High';
 else if(/payment|royalt|unavailable|broken|delay|issue|problem/.test(t)) priority='Medium';
 if(/legal|safety|multiple failed|critical/.test(t)) priority='Critical';
 return {category,priority,draft:`Hello,\n\nThank you for letting us know about this. We understand how important it is to get a clear and timely update.\n\nOur support team will review the details of your query and coordinate with the relevant team. If any additional information is needed, we will contact you. We aim to provide an update within 48 hours.\n\nNext step: please reply here with any supporting details that may help us investigate.\n\nRegards,\nBookLeaf Support`,provider:'rules-fallback'};
}
export async function analyzeTicket(subject, description){
 const text=`Subject: ${subject}\nDescription: ${description}`;
 const key=process.env.OPENAI_API_KEY;
 if(!key) return fallback(text);
 try {
  const response=await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({model:process.env.OPENAI_MODEL||'gpt-4o-mini',temperature:0.2,max_tokens:450,messages:[{role:'system',content:`You classify BookLeaf author support tickets and draft a response. Use only these categories: ${categories.join('; ')}. Priority must be Critical, High, Medium, or Low. Use the policy context below; do not invent author-specific facts, payment dates, completed actions, or promises beyond a 48-hour update. Be empathetic and professional; end with a clear next step. Return ONLY valid JSON with keys category, priority, draft. Knowledge base: ${knowledgeBase}`},{role:'user',content:text}]})});
  if(!response.ok) throw new Error(`AI API status ${response.status}`);
  const data=await response.json(); const raw=data.choices?.[0]?.message?.content||''; const parsed=JSON.parse(raw.replace(/^```json\s*/,'').replace(/```$/,'').trim());
  if(!categories.includes(parsed.category)||!['Critical','High','Medium','Low'].includes(parsed.priority)||typeof parsed.draft!=='string') throw new Error('Invalid AI response schema');
  return {...parsed,provider:'openai'};
 } catch(err){ console.error('AI unavailable; using fallback:',err.message); return fallback(text); }
}
