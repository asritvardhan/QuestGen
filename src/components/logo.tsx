import { TestTube2 } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="p-2 bg-primary/20 rounded-lg">
        <TestTube2 className="w-6 h-6 text-primary-foreground" />
      </div>
      <h1 className="text-3xl font-bold font-headline text-foreground">
        QuestGen<span className="text-primary">++</span>
      </h1>
    </div>
  );
}
