import { OrganizationProfilePage } from "@/components/OrganisationProfile"
import NavComponent from '../../../components/NavComponent'
const organizationProfileData = {
  name: "BioTech Research Institute",
  verified: true,
  institution: "BioTech Research Institute",
  location: "New York, USA",
  memberSince: "5 years, 2 months and 8 days",
  socialLinks: {
    linkedin: "#",
    twitter: "#",
    website: "#"
  },
  stats: {
    upvotes: 1250,
    publications: 87,
    citations: 3420,
    hIndex: 22,
    i10Index: 45
  },
  reputation: {
    "Biotechnology": 0.9,
    "Genetics": 0.85,
    "Molecular Biology": 0.8
  },
  recentActivity: [
    {
      type: "publication",
      content: "New findings in CRISPR gene editing",
      date: "2 days ago",
      tags: ["CRISPR", "Gene Editing"]
    }
  ],
  members: [
    { name: "Dr. Jane Smith", role: "Lead Researcher" },
    { name: "Dr. John Doe", role: "Senior Scientist" },
    { name: "Alice Johnson", role: "Research Assistant" }
  ]
}

export default function OrganizationProfilePreview() {
  return(
    <div className="min-h-screen bg-gray-100">
    <NavComponent /> 
    <div className="container mx-auto px-4 py-8">
    <OrganizationProfilePage data={organizationProfileData} />
    </div>
    </div>

  )
}

