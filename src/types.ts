export type ToolCategory = 'image' | 'pdf' | 'text' | 'developer' | 'calculator';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface HowToStep {
  step: number;
  title: string;
  description: string;
}

export interface ToolDefinition {
  id: string;
  title: string;
  slug: string;
  category: ToolCategory;
  categoryName: string;
  description: string;
  iconName: string;
  popular: boolean;
  tags: string[];
  seoTitle: string;
  metaDescription: string;
  h1: string;
  shortIntro: string;
  howToSteps: HowToStep[];
  featuresList: string[];
  supportedFormats: {
    input: string[];
    output: string[];
  };
  faqs: FAQItem[];
  relatedToolSlugs: string[];
  educationalContent: {
    overview: string;
    useCases: string[];
    technicalDetails: string;
  };
}

export interface GuideArticle {
  slug: string;
  title: string;
  description: string;
  readTime: string;
  publishedDate: string;
  category: string;
  relatedToolSlug: string;
  content: {
    intro: string;
    sections: {
      heading: string;
      body: string;
      tips?: string[];
    }[];
    conclusion: string;
  };
}

export type ThemeMode = 'light' | 'dark' | 'system';
