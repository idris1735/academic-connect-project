import { FileText } from 'lucide-react'

export default function PublicationsList() {
  const publications = [
    {
      title: 'Efficient Neural Architecture Search via Parameter Sharing',
      journal: 'Nature Machine Intelligence',
      year: 2023,
      citations: 145,
    },
    {
      title: 'Cross-lingual Language Model Pretraining',
      conference: 'NeurIPS',
      year: 2023,
      citations: 89,
    },
    {
      title: 'Energy-efficient Training of Deep Neural Networks',
      journal: 'Journal of Machine Learning Research',
      year: 2022,
      citations: 234,
    },
    {
      title: 'Scalable Methods for Distributed Machine Learning',
      conference: 'ICML',
      year: 2022,
      citations: 167,
    },
    {
      title: 'Advances in Natural Language Processing for Scientific Text',
      journal: 'Computational Linguistics',
      year: 2021,
      citations: 312,
    },
  ]

  return (
    <div className="space-y-6">
      {publications.map((pub, index) => (
        <div key={index} className="flex gap-4 p-4 rounded-lg hover:bg-gray-50">
          <div className="mt-1">
            <FileText className="w-5 h-5 text-[#6366F1]" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{pub.title}</h3>
            <p className="text-sm text-gray-600 mt-1">
              {pub.journal || pub.conference} · {pub.year}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {pub.citations} citations
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
