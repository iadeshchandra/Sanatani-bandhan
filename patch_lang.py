with open('src/context/LanguageContext.tsx', 'r') as f:
    content = f.read()

content = content.replace("t: (key: string) => string;", "t: (key: string) => string;\n  safeTranslate: (key: string, en: string, bn: string, hi: string) => string;")

safe_trans_impl = """  const safeTranslate = (key: string, en: string, bn: string, hi: string): string => {
    switch (language) {
      case 'bn': return bn;
      case 'hi': return hi;
      case 'en':
      default: return en;
    }
  };

  const getTaxonomy"""

content = content.replace("  const getTaxonomy", safe_trans_impl)

content = content.replace("value={{ language, setLanguage, t, getTaxonomy }}", "value={{ language, setLanguage, t, safeTranslate, getTaxonomy }}")

with open('src/context/LanguageContext.tsx', 'w') as f:
    f.write(content)
