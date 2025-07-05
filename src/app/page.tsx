import Header from '@/components/globals/header';

export default function HomePage() {
  return (
    <div className='min-h-screen'>
      <section className="relative hero-background">
        <Header />
      </section>
      <section className="py-20 dark:bg-[#30334e] bg-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Welcome to Our Website</h1>
          <p className="text-lg text-muted-foreground">This is a sample page with a hero section and a content section.</p>
        </div>
      </section>

    </div>
  );
}
