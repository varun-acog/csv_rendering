import Link from 'next/link';
import { FileText } from 'lucide-react';

export default function Home() {
  const demos = [
    { id: 1, title: 'Build-time HTML Table', path: '/build-time-html' },
    { id: 2, title: 'Build-time React Component', path: '/build-time-react' },
    { id: 3, title: 'Run-time HTML Table', path: '/runtime-html' },
    { id: 4, title: 'Run-time React Component', path: '/runtime-react' },
    { id: 5, title: 'User-triggered React Table', path: '/user-triggered' },
    { id: 6, title: 'Streaming HTML Table', path: '/streaming' },
    { id: 7, title: 'Live Updates (SSE)', path: '/sse' },
    { id: 8, title: 'Server-Side Caching', path: '/server-cache' },
    { id: 9, title: 'Browser Caching', path: '/browser-cache' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">
            CSV Data Handling Approaches
          </h1>
          <div className="grid gap-4">
            {demos.map((demo) => (
              <Link
                key={demo.id}
                href={demo.path}
                className="p-4 rounded-lg border bg-card hover:bg-accent transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-medium">{demo.title}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  Demo {demo.id}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}