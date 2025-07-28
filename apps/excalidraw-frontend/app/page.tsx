import { Button } from "@repo/ui/button";
import { ArrowRight, CheckCircle, Play, Sparkles } from "lucide-react";
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
        </div>
      </section>
    </div>
  );
}
