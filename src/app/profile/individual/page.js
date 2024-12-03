import { IndividualProfilePage } from "@/components/IndividualProfile"
import NavComponent from '../../../components/NavComponent'
const individualProfileData = {
  name: "Anna Takadii",
  verified: true,
  institution: "Bindura University of Science Education",
  department: "Pharmacology",
  location: "Bindura, Zimbabwe",
  memberSince: "3 years, 11 months and 17 days",
  socialLinks: {
    instagram: "#",
    linkedin: "#",
    twitter: "#",
    website: "#"
  },
  stats: {
    upvotes: 0,
    publications: 0,
    citations: 0,
    hIndex: 0,
    i10Index: 0
  },
  reputation: {
    "Biology": 0.8,
    "Chemistry": 0.6,
    "Economics": 0.4
  },
  recentActivity: [
    {
      type: "comment",
      content: "Tooth decay, Dental Health",
      date: "1 hour ago",
      tags: ["Dental", "Health"]
    }
  ]
}

export default function IndividualProfilePreview() {
  return(
    <div className="min-h-screen bg-gray-100">
    <NavComponent /> 
    <div className="container mx-auto px-4 py-8">
    <IndividualProfilePage data={individualProfileData} />
    </div>
    </div>

  )
}

