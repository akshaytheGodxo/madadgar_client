import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function NewHome() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gradient-to-br from-blue-50 to-purple-100 p-6">
            <Card className="max-w-xl w-full p-8 shadow-lg bg-white/90">
                <h1 className="text-3xl font-bold text-center mb-4 text-blue-700">
                    Welcome to Your Personalized AI Learning Assistant
                </h1>
                <p className="text-lg text-gray-700 text-center mb-6">
                    Empower your learning journey with AI-powered tutors tailored to your unique needs. Our platform connects students with intelligent assistants that adapt to your pace, style, and goals—making education more engaging, effective, and fun.
                </p>
                <ul className="list-disc list-inside text-gray-600 mb-6">
                    <li>Personalized lesson plans and study schedules</li>
                    <li>Instant answers and explanations for any subject</li>
                    <li>Progress tracking and smart feedback</li>
                    <li>Interactive quizzes and practice sessions</li>
                </ul>
                <div className="flex justify-center">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-lg font-semibold">
                        Get Started
                    </Button>
                </div>
            </Card>
        </div>
    );
}