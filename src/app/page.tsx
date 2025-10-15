import CTFList from '@/components/CTFList';

export default function Home() {
  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">CTF Challenges</h1>
      </div>
      <CTFList />
    </div>
  );
}
