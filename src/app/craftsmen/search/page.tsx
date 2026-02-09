"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchPage() {
  const params = useSearchParams();
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    const query = params.toString();
    fetch(`/api/craftsmen/search?${query}`)
      .then(r => r.json())
      .then(d => setResults(d.craftsmen));
  }, [params]);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 mt-20">
      <h1 className="text-3xl font-bold mb-6">نتائج البحث</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {results.map(c => (
          <div key={c._id} className="bg-slate-900 p-4 rounded-2xl">
            <img src={c.profileImage} className="w-full h-40 object-cover rounded-xl mb-3"/>
            <h2 className="font-bold">{c.userId.name}</h2>
            <p className="text-slate-400">{c.jobTitle}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
