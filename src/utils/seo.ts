import { ToolDefinition, GuideArticle } from '../types';

const BASE_URL = 'https://freetoolbox.app';

export function updateSEOMeta(options: {
  title: string;
  description: string;
  canonicalPath: string;
  robots?: string;
  image?: string;
  schema?: object | object[];
}) {
  if (typeof document === 'undefined') return;
  document.title = options.title;
  const ensure = (selector: string, attrs: Record<string,string>) => {
    let el = document.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null;
    if (!el) { el = document.createElement(selector.startsWith('link') ? 'link' : 'meta') as any; Object.entries(attrs).forEach(([k,v]) => el!.setAttribute(k,v)); document.head.appendChild(el); }
    return el;
  };
  const cleanPath = options.canonicalPath.startsWith('/') ? options.canonicalPath : `/${options.canonicalPath}`;
  const canonicalUrl = `${BASE_URL}${cleanPath === '/' ? '/' : cleanPath.replace(/\/$/, '')}`;
  ensure('meta[name="description"]', { name:'description' }).setAttribute('content', options.description);
  ensure('meta[name="robots"]', { name:'robots' }).setAttribute('content', options.robots || 'index, follow');
  ensure('link[rel="canonical"]', { rel:'canonical' }).setAttribute('href', canonicalUrl);
  ensure('meta[property="og:title"]', { property:'og:title' }).setAttribute('content', options.title);
  ensure('meta[property="og:description"]', { property:'og:description' }).setAttribute('content', options.description);
  ensure('meta[property="og:url"]', { property:'og:url' }).setAttribute('content', canonicalUrl);
  ensure('meta[property="og:image"]', { property:'og:image' }).setAttribute('content', options.image || `${BASE_URL}/pwa-512x512.png`);
  ensure('meta[name="twitter:title"]', { name:'twitter:title' }).setAttribute('content', options.title);
  ensure('meta[name="twitter:description"]', { name:'twitter:description' }).setAttribute('content', options.description);
  ensure('meta[name="twitter:image"]', { name:'twitter:image' }).setAttribute('content', options.image || `${BASE_URL}/pwa-512x512.png`);
  document.getElementById('ftb-dynamic-schema')?.remove();
  if (options.schema) { const script=document.createElement('script'); script.id='ftb-dynamic-schema'; script.type='application/ld+json'; script.textContent=JSON.stringify(options.schema); document.head.appendChild(script); }
}

export function generateToolSchema(tool: ToolDefinition) {
  const toolUrl = `${BASE_URL}/${tool.slug}`;
  return [
    { '@context':'https://schema.org', '@type':'WebApplication', '@id':`${toolUrl}/#app`, name:tool.title, url:toolUrl, applicationCategory:'UtilityApplication', operatingSystem:'Any (Web Browser)', offers:{'@type':'Offer',price:'0.00',priceCurrency:'USD'}, description:tool.metaDescription, featureList:tool.featuresList.join(', ') },
    { '@context':'https://schema.org', '@type':'BreadcrumbList', itemListElement:[
      {'@type':'ListItem',position:1,name:'Home',item:BASE_URL+'/'},
      {'@type':'ListItem',position:2,name:tool.categoryName,item:`${BASE_URL}/tools/${({image:'image-tools',pdf:'pdf-tools',text:'text-tools',developer:'developer-tools',calculator:'calculator-tools'} as Record<string,string>)[tool.category]}`},
      {'@type':'ListItem',position:3,name:tool.title,item:toolUrl}
    ]},
    { '@context':'https://schema.org', '@type':'HowTo', name:`How to use ${tool.title}`, description:tool.shortIntro, step:tool.howToSteps.map((step)=>({'@type':'HowToStep',position:step.step,name:step.title,text:step.description})) },
    { '@context':'https://schema.org', '@type':'FAQPage', mainEntity:tool.faqs.map((faq)=>({'@type':'Question',name:faq.question,acceptedAnswer:{'@type':'Answer',text:faq.answer}})) }
  ];
}

export function generateGuideSchema(guide: GuideArticle) {
  const guideUrl = `${BASE_URL}/guides/${guide.slug}`;
  return { '@context':'https://schema.org','@type':'TechArticle','@id':`${guideUrl}/#article`,headline:guide.title,description:guide.description,author:{'@type':'Organization',name:'FreeToolBox Engineering',url:BASE_URL},publisher:{'@type':'Organization',name:'FreeToolBox',url:BASE_URL},datePublished:guide.publishedDate,mainEntityOfPage:guideUrl };
}
