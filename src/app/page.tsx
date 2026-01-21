import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase, CheckCircle2, TrendingUp } from "lucide-react";
import Link from "next/link";
import HeroImages from "@/components/HeroImages";

const Home = () => {
  const featureText = [
    {
      title: "Organize Applications",
      icon: <Briefcase className="text-primary h-6 w-6" />,
      description:
        "Create custom boards and columns to track your job applications at every stage of the process.",
    },
    {
      title: "Track Progress",
      icon: <TrendingUp className="text-primary h-6 w-6" />,
      description:
        "Monitor your application status from applied to interview to offer with visual Kanban boards.",
    },
    {
      title: "Stay Organized",
      icon: <CheckCircle2 className="text-primary h-6 w-6" />,
      description:
        "SNever lose track of an application. Keep all your job search information in one centralized place.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <main className="flex-1">
        {/* main hero section */}
        <section className="container mx-auto px-4 py-32">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-black mb-6 text-6xl font-bold ">
              A better way to track your job application.
            </h1>
            <p className="text-muted-foreground mb-10 text-xl">
              Capture, organize, and manage your job search in one place.
            </p>
            <div className="flex flex-col items-center gap-4">
              <Link href="/sign-up">
                <Button size="lg" className="h-12 px-8 text-lg font-medium">
                  Start for free <ArrowRight className="ml-2" />
                </Button>
              </Link>
              <p className="text-muted-foreground text-sm">
                Free forever. No credit card required.
              </p>
            </div>
          </div>
        </section>

        {/* hero images */}
        <HeroImages />

        {/* feature section */}
        <section className="container mx-auto  py-24 border-t border-gray-200">
          <div className="container px-4 mx-auto">
            <div className="grid gap-12 md:grid-cols-3">
              {featureText.map(({ title, icon, description }) => (
                <div
                  key={title}
                  className="flex flex-col items-start gap-4 flex-1"
                >
                  <div className="h-12 w-12 flex justify-center items-center bg-primary/10 rounded-lg">
                    {icon}
                  </div>
                  <h2 className="text-2xl font-semibold ">{title}</h2>
                  <p className="max-w-md text-muted-foreground">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
