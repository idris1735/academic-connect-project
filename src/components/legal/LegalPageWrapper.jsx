'use client'

import { useState, useEffect, useRef } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  ChevronUp,
  Printer,
  FileDown,
  Globe,
  Menu,
  Loader2,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { translations } from '@/translations/legal'
import { generatePDF } from '@/utils/pdfGenerator'
import { translateContent } from '@/services/translationService'

export function LegalPageWrapper({ title, lastUpdated, children }) {
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('English')
  const [translatedContent, setTranslatedContent] = useState(null)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [isPrinting, setIsPrinting] = useState(false)
  const contentRef = useRef(null)

  const languages = [
    { name: 'English', code: 'en' },
    { name: 'Français', code: 'fr' },
    { name: 'Español', code: 'es' },
    { name: 'العربية', code: 'ar' },
    { name: '中文', code: 'zh' },
  ]

  useEffect(() => {
    // Set initial content
    setTranslatedContent(children)
  }, [children])

  const handleScroll = (e) => {
    setShowBackToTop(e.target.scrollTop > 100)
  }

  const scrollToTop = () => {
    document.querySelector('.scroll-area')?.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const handleLanguageChange = async (langCode) => {
    try {
      const newLang = languages.find((l) => l.code === langCode)
      setSelectedLanguage(newLang.name)

      // Get translated content
      const pageType = title.toLowerCase().includes('privacy')
        ? 'privacy'
        : 'terms'
      const translation = translations[langCode]?.[pageType]

      if (translation) {
        // If translation exists, render it with the same structure as the original content
        setTranslatedContent(
          <section className='prose max-w-none'>
            <div className='bg-blue-50 border-l-4 border-blue-500 p-4 mb-8'>
              <p className='text-blue-700'>{translation.introduction.text}</p>
            </div>
            {/* Add other translated sections here */}
          </section>
        )
      } else {
        // Fallback to original content
        setTranslatedContent(children)
      }
    } catch (error) {
      console.error('Language change error:', error)
      setTranslatedContent(children)
    }
  }

  const handlePrint = () => {
    setIsPrinting(true)
    try {
      // Create a new window for printing
      const printContent = contentRef.current.innerHTML
      const printWindow = window.open('', '', 'height=600,width=800')

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${title}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
              }
              h1 {
                font-size: 24px;
                color: #111;
                margin-bottom: 20px;
              }
              h2 {
                font-size: 20px;
                color: #222;
                margin-top: 30px;
              }
              h3 {
                font-size: 16px;
                color: #444;
              }
              p {
                margin-bottom: 16px;
              }
              .section {
                margin-bottom: 30px;
              }
              .header {
                text-align: center;
                margin-bottom: 40px;
                padding-bottom: 20px;
                border-bottom: 1px solid #eee;
              }
              .date {
                color: #666;
                font-size: 14px;
              }
              @media print {
                body {
                  padding: 20px;
                }
                .no-print {
                  display: none;
                }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${title}</h1>
              <div class="date">Last updated: ${lastUpdated}</div>
            </div>
            <div class="content">
              ${printContent}
            </div>
          </body>
        </html>
      `)

      printWindow.document.close()

      // Wait for resources to load
      printWindow.onload = function () {
        printWindow.focus()
        printWindow.print()
        printWindow.onafterprint = function () {
          printWindow.close()
          setIsPrinting(false)
        }
      }
    } catch (error) {
      console.error('Print error:', error)
      setIsPrinting(false)
    }
  }

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true)
    try {
      const langCode = languages.find((l) => l.name === selectedLanguage)?.code
      await generatePDF(title, contentRef.current, langCode)
    } catch (error) {
      console.error('PDF download error:', error)
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white py-12'>
      <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8'>
        <Card className='border-none shadow-xl bg-white/80 backdrop-blur-sm'>
          <CardContent className='p-8 md:p-12'>
            {/* Header */}
            <div className='flex justify-between items-center mb-8'>
              <div className='text-center flex-1'>
                <h1 className='text-4xl font-bold text-gray-900 mb-4'>
                  {title}
                </h1>
                <p className='text-gray-600'>Last updated: {lastUpdated}</p>
              </div>
              <div className='flex gap-2'>
                {/* Language Selector */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='outline' size='sm'>
                      <Globe className='h-4 w-4 mr-2' />
                      {selectedLanguage}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {languages.map((lang) => (
                      <DropdownMenuItem
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                      >
                        {lang.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Print Button */}
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handlePrint}
                  disabled={isPrinting}
                >
                  {isPrinting ? (
                    <>
                      <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                      Printing...
                    </>
                  ) : (
                    <>
                      <Printer className='h-4 w-4 mr-2' />
                      Print
                    </>
                  )}
                </Button>

                {/* Download PDF */}
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleDownloadPDF}
                  disabled={isGeneratingPDF}
                >
                  {isGeneratingPDF ? (
                    <>
                      <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileDown className='h-4 w-4 mr-2' />
                      PDF
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Table of Contents Toggle */}
            <div className='md:hidden mb-4'>
              <Button variant='outline' className='w-full'>
                <Menu className='h-4 w-4 mr-2' />
                Table of Contents
              </Button>
            </div>

            <div className='flex gap-6'>
              {/* Table of Contents - Desktop */}
              <div className='hidden md:block w-64 shrink-0'>
                <div className='sticky top-4 bg-gray-50 p-4 rounded-lg'>
                  <h2 className='font-semibold mb-4'>Table of Contents</h2>
                  {/* TOC content will be generated from sections */}
                </div>
              </div>

              {/* Main Content */}
              <ScrollArea
                className='h-[70vh] flex-1 pr-6 scroll-area'
                onScroll={handleScroll}
              >
                <div className='space-y-8 text-gray-600' ref={contentRef}>
                  {translatedContent}
                </div>
              </ScrollArea>
            </div>

            {/* Back to Top Button */}
            {showBackToTop && (
              <Button
                className='fixed bottom-8 right-8 rounded-full'
                size='icon'
                onClick={scrollToTop}
              >
                <ChevronUp className='h-4 w-4' />
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-content,
          .print-content * {
            visibility: visible;
          }
          .print-content {
            position: absolute;
            left: 0;
            top: 0;
          }
        }
      `}</style>
    </div>
  )
}
