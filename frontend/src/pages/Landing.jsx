import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, Headphones, Zap } from "lucide-react"
import { Link } from "react-router-dom"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-purple-500">
      <header className="container mx-auto px-4 py-8">
        <nav className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">ParallelStream</h1>
          <Button asChild variant="outline">
            <Link to="/home">Try It Now</Link>
          </Button>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-16">
        <section className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Experience Text and Audio in Perfect Harmony
          </h2>
          <p className="text-xl text-white mb-8">
            Parallel Word Streaming brings your text to life with synchronized audio and visual highlighting.
          </p>
          <Button asChild size="lg" className="text-lg">
            <Link to="/home">Get Started</Link>
          </Button>
        </section>

        <section className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mic className="mr-2" />
                Text-to-Speech
              </CardTitle>
            </CardHeader>
            <CardContent>
              Convert your text into natural-sounding speech with our advanced AI technology.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Headphones className="mr-2" />
                Audio Synchronization
              </CardTitle>
            </CardHeader>
            <CardContent>
              Experience perfect synchronization between the spoken words and the highlighted text.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="mr-2" />
                Real-time Highlighting
              </CardTitle>
            </CardHeader>
            <CardContent>
              Watch as each word is highlighted in real-time, enhancing comprehension and engagement.
            </CardContent>
          </Card>
        </section>

        <section className="bg-white rounded-lg shadow-xl p-8 mb-16">
          <h3 className="text-2xl font-bold mb-4">How It Works</h3>
          <ol className="list-decimal list-inside space-y-2">
            <li>Enter your text in the provided textarea.</li>
            <li>Click the "Convert Paragraph to Speech" button.</li>
            <li>Listen to the audio playback while following the highlighted text.</li>
            <li>Enjoy an immersive reading and listening experience!</li>
          </ol>
        </section>

        <section className="text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to Transform Your Reading Experience?
          </h3>
          <Button asChild size="lg" className="text-lg">
            <Link to="/home">Try ParallelStream Now</Link>
          </Button>
        </section>
      </main>

      <footer className="container mx-auto px-4 py-8 text-center text-white">
        <p>&copy; 2024 ParallelStream. All rights reserved.</p>
      </footer>
    </div>
  )
}