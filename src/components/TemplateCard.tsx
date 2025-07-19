import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface TemplateCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

export function TemplateCard({ title, description, href, icon }: TemplateCardProps) {
  return (
    <Link href={href} className="group">
      <Card className="h-full transition-all duration-300 hover:shadow-lg hover:border-primary/50 hover:-translate-y-1">
        <CardHeader className="items-center text-center">
          <div className="p-3 rounded-full bg-primary/10 mb-4 transition-colors group-hover:bg-primary/20">
            {icon}
          </div>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-center">{description}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}
