
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Edit3, Lock, Globe, MessageSquareHeart } from 'lucide-react';
import placeholderImages from '@/lib/placeholder-images.json';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center text-center space-y-12 py-8">
      <section className="space-y-4">
        <h1 className="text-5xl font-bold font-headline tracking-tight text-primary">
          Welcome to MyGene
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Preserving legacies, one profile at a time. MyGene helps you create, share, and remember the stories of your loved ones.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Link href="/signup" passHref>
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">Get Started</Button>
          </Link>
          <Link href="/profiles" passHref>
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
              Explore Profiles
            </Button>
          </Link>
        </div>
      </section>

      <section className="w-full max-w-5xl grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
        {[
          { icon: <Edit3 className="h-10 w-10 text-accent" />, title: "Create Profiles", description: "Easily submit and manage detailed profiles of deceased family members, capturing their life stories and memories." },
          { icon: <Users className="h-10 w-10 text-accent" />, title: "Share with Family", description: "Securely share profiles with family members, creating a collective digital space for remembrance." },
          { icon: <Lock className="h-10 w-10 text-accent" />, title: "Unique & Permanent", description: "Each profile receives a unique, anonymized code, ensuring a lasting and accessible legacy." },
          { icon: <Globe className="h-10 w-10 text-accent" />, title: "Geolocation Aware", description: "Connect with your heritage through country-specific sections, tailored to your location." },
          { icon: <MessageSquareHeart className="h-10 w-10 text-accent" />, title: "AI Ancestor Q&A", description: "Engage with an AI to ask questions about your ancestors and learn more from their profiles." },
          { icon: <Users className="h-10 w-10 text-accent" />, title: "Community Focused", description: "Connect with others sharing and preserving their family histories in a respectful environment." },
        ].map(feature => (
          <Card key={feature.title} className="text-left shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="p-3 bg-accent/20 rounded-full w-fit mb-3">{feature.icon}</div>
              <CardTitle className="font-headline text-primary">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </section>
      
      <section className="w-full max-w-4xl py-12">
        <Card className="bg-primary/10 border-primary shadow-xl">
          <CardHeader className="items-center">
            <Image 
              src={placeholderImages.familyTree.url} 
              alt="Family Tree" 
              width={placeholderImages.familyTree.width} 
              height={placeholderImages.familyTree.height} 
              className="rounded-lg shadow-md"
              data-ai-hint="family tree" 
            />
            <CardTitle className="text-3xl font-headline text-primary pt-6">Discover Your Roots</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-lg text-muted-foreground mb-6">
              MyGene is more than an archive; it's a living tribute to the lives that shaped us. Start building your family's digital legacy today.
            </p>
            <Link href="/submit-profile" passHref>
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">Add a Profile Now</Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
