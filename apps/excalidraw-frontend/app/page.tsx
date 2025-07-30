import { Button } from "@repo/ui/button";
import {
  ArrowRight,
  CheckCircle,
  Globe,
  Palette,
  Play,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen  bg-white">
      <section className="pt-32 pb-20 font-base  bg-gradient-to-br from-purple-50 via-blue-50 to-orange-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8 inline-flex items-center space-x-2 rounded-full bg-purple-100 text-purple-700 px-4 py-2">
            <Sparkles className="w-4 h-4" />
            <span>Now with real time collaboration</span>
          </div>

          <h1 className="font-bold text-5xl mb-6 leading-tight lg:text-6xl text-gray-900">
            Create Art
            <span className=" block text-transparent bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text">
              together
            </span>
          </h1>

          <p className="text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto mb-10">
            The most intuitive collaborative drawing platform. Sketch, paint,
            and create with your team in real-time, from anywhere in the world.
          </p>

          <div className="sm:flex-row flex flex-col justify-center mb-12 gap-4">
            <Button
              variant="primary"
              size="lg"
              className="flex items-center justify-center space-x-2"
            >
              Start Creating Now
              <ArrowRight className="ml-1 w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg">
              <Play className="mr-1 w-5 h-5" />
              Watch Demo
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-8 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Free to start</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>No download required</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Unlimited collaborators</span>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 bg-white">
        <div className="mx-auto max-w-6xl  px-4 sm:px-6 lg:px-8 ">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to create together
            </h1>
            <p className="text-xl text-gray-500  max-w-2xl mx-auto ">
              Powerful tools designed for seamless collaboration.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 justify-center bg-gradient-to-r from-purple-500 to-purple-600 flex items-center rounded-2xl mx-auto mb-4">
                <Users className="w-8 h-8 text-white " />
              </div>
              <h2 className="font-bold text-shadow-gray-900 text-xl  leading-relaxed mb-2">
                Real-time Collaboration
              </h2>
              <p className="text-gray-600">
                Work together seamlessly with live cursors and instant updates.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 justify-center bg-gradient-to-r from-blue-500 to-blue-600 flex items-center rounded-2xl mx-auto mb-4">
                <Palette className="w-8 h-8 text-white " />
              </div>
              <h2 className="font-bold text-shadow-gray-900 text-xl  leading-relaxed mb-2">
                Professional Tools
              </h2>
              <p className="text-gray-600">
                Advanced brushes, layers, and everything you need to create.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 justify-center bg-gradient-to-r from-orange-500 to-orange-600 flex items-center rounded-2xl mx-auto mb-4">
                <Globe className="w-8 h-8 text-white " />
              </div>
              <h2 className="font-bold text-shadow-gray-900 text-xl  leading-relaxed mb-2">
                Cloud Sync
              </h2>
              <p className="text-gray-600">
                Access your art from anywhere with automatic saving.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 justify-center bg-gradient-to-r from-green-500 to-green-600 flex items-center rounded-2xl mx-auto mb-4">
                <Zap className="w-8 h-8 text-white " />
              </div>
              <h2 className="font-bold text-shadow-gray-900 text-xl  leading-relaxed mb-2">
                Lightning Fast
              </h2>
              <p className="text-gray-600">
                Smooth drawing experience with zero lag, even with multiple
                users.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="py-20 bg-gradient-to-br from-gray-50 to-blue-50"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4 text-shadow-gray-900">
              Start creating in seconds
            </h1>
            <p className="text-xl text-gray-600">
              No complex setup. Just open your browser and start drawing.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center ">
              <div className=" bg-gradient-to-br from-purple-500 to-blue-500 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-6 ">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h2 className="font-bold text-xl">Create Canvas</h2>
              <p className="text-gray-600">
                Start a new canvas instantly. No account required to get
                started.
              </p>
            </div>

            <div className="text-center ">
              <div className=" bg-gradient-to-br from-blue-500 to-orange-500 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-6 ">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h2 className="font-bold text-xl">Invite Others</h2>
              <p className="text-gray-600">
                Share your canvas link. Others can join instantly from any
                device.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Create Together
              </h3>
              <p className="text-gray-600">
                Draw and create together in real-time. See everyone's work live.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="font-bold text-white text-4xl mb-6">
            Ready to create together?
          </h2>
          <p className="text-purple-100 text-xl mb-8">
            Join thousands of artists and creative teams already using
            DrawTogether.
          </p>
          <Button variant="secondary" size="lg">
            Start Drawing for free
          </Button>
          <p className="text-purple-200 text-sm pt-4">
            No credit card required • Free forever plan available
          </p>
        </div>
      </section>
    </div>
  );
}
