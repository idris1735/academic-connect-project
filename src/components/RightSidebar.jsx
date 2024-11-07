import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function RightSidebar() {
  return (
    <aside className="hidden xl:block xl:col-span-1">
      <Card>
        <CardHeader>
          <h3 className="font-semibold">Research Topics to Follow</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full justify-start text-left"
            >
              Machine Learning
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-left"
            >
              Quantum Computing
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-left"
            >
              Climate Science
            </Button>
          </div>
        </CardContent>
      </Card>
    </aside>
  )
}