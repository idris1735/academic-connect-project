import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import PublicationsList from "./PublicationsList"

export default function ProfileContent() {
  const researchInterests = [
    "Machine Learning",
    "Natural Language Processing",
    "Computer Vision",
    "Deep Learning",
    "Artificial Intelligence"
  ]

  const currentProjects = [
    {
      title: "Neural Architecture Search",
      description: "Developing efficient methods for automated machine learning model design"
    },
    {
      title: "Cross-lingual Transfer Learning",
      description: "Improving language models' performance across multiple languages"
    },
    {
      title: "Sustainable AI",
      description: "Research on energy-efficient deep learning architectures"
    }
  ]

  return (
    <Tabs defaultValue="about" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="about">About</TabsTrigger>
        <TabsTrigger value="publications">Publications</TabsTrigger>
        <TabsTrigger value="projects">Projects</TabsTrigger>
      </TabsList>
      
      <TabsContent value="about">
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Research Overview</h3>
              <p className="text-gray-600">
                Leading research in machine learning and artificial intelligence, with a focus on developing
                scalable and efficient algorithms for real-world applications. Experienced in both theoretical
                foundations and practical implementations of AI systems.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Research Interests</h3>
              <div className="flex flex-wrap gap-2">
                {researchInterests.map(interest => (
                  <Badge key={interest} className="bg-[#6366F1]">{interest}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="publications">
        <Card>
          <CardHeader>
            <CardTitle>Publications</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <PublicationsList />
            </ScrollArea>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="projects">
        <Card>
          <CardHeader>
            <CardTitle>Current Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              {currentProjects.map(project => (
                <div key={project.title} className="border-b pb-6 last:border-0">
                  <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
                  <p className="text-gray-600">{project.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}