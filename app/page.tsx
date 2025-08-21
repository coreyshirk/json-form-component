import { JsonFormComponent } from "@/components/json-form"

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">JSON Form Builder</h1>
        <JsonFormComponent />
      </div>
    </main>
  )
}
