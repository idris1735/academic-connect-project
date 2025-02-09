import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import html2canvas from 'html2canvas'

export const generatePDF = async (title, content, language = 'en') => {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
      putOnlyUsedFonts: true,
      floatPrecision: 16,
    })

    // Use default fonts instead of loading external ones
    if (language === 'ar') {
      doc.setR2L(true)
    }

    // Convert content to canvas
    const canvas = await html2canvas(content, {
      scale: 2,
      useCORS: true,
      logging: false,
    })

    const contentWidth = doc.internal.pageSize.getWidth()
    const contentHeight = doc.internal.pageSize.getHeight()
    const imageData = canvas.toDataURL('image/png')

    // Add header
    doc.setFontSize(20)
    doc.text(title, 20, 20)
    doc.setFontSize(10)
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 30)

    // Add content as image
    doc.addImage(imageData, 'PNG', 0, 40, contentWidth, contentHeight - 40)

    // Add page numbers
    const pageCount = doc.internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(10)
      doc.text(
        `Page ${i} of ${pageCount}`,
        contentWidth - 30,
        contentHeight - 10
      )
    }

    // Save PDF
    doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}.pdf`)
  } catch (error) {
    console.error('PDF generation error:', error)
    throw new Error('Failed to generate PDF')
  }
}

export const generateTermsPDF = (content) => {
  const doc = new jsPDF()

  // Add title
  doc.setFontSize(20)
  doc.text('Terms of Service', 20, 20)

  // Add last updated date
  doc.setFontSize(12)
  doc.text(`Last Updated: ${new Date().toLocaleDateString()}`, 20, 30)

  // Add content
  doc.setFontSize(10)
  doc.setFont('helvetica')

  const splitText = doc.splitTextToSize(content, 170)
  doc.text(splitText, 20, 40)

  // Save the PDF
  doc.save('academic-connect-terms.pdf')
}

export const generatePrivacyPDF = (content) => {
  const doc = new jsPDF()

  // Add title
  doc.setFontSize(20)
  doc.text('Privacy Policy', 20, 20)

  // Add last updated date
  doc.setFontSize(12)
  doc.text(`Last Updated: ${new Date().toLocaleDateString()}`, 20, 30)

  // Add content
  doc.setFontSize(10)
  doc.setFont('helvetica')

  const splitText = doc.splitTextToSize(content, 170)
  doc.text(splitText, 20, 40)

  // Save the PDF
  doc.save('academic-connect-privacy.pdf')
}
