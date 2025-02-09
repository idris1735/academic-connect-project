import { translations } from '@/translations/legal'

export const translateContent = async (content, language) => {
  try {
    // Get the page type (privacy or terms) from the content
    const pageType = content.toLowerCase().includes('privacy')
      ? 'privacy'
      : 'terms'

    // Return the predefined translation if available
    if (translations[language]?.[pageType]) {
      return translations[language][pageType]
    }

    // Fallback to English if translation not available
    return content
  } catch (error) {
    console.error('Translation error:', error)
    return content
  }
}
