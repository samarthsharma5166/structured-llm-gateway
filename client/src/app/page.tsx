"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";

type Answer = {
  summary:string
  confidence:number
}

export default function Home() {
  const [query,setQuery] = useState("");
  const [answer,setAnswer] = useState<Answer[]>([]);
  const [loading,setloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);


  async function handleQuerySubmit(e:React.FormEvent) {
    e.preventDefault();
    setloading(true);
    setError(null);
    try {
      const res = await fetch("/api/ask",{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify({
          query,
          confidenceThreshold:0.5
        })
      });
      
      const data = await res.json();
      setloading(false);

      if (!res.ok) {
        const errorMsg = data.error || `Server responded with status ${res.status}`;
        console.error("API error returned to client:", errorMsg, data);
        setError(errorMsg);
        return;
      }

      if (data.error) {
        console.error("API returned success status but contains error payload:", data.error);
        setError(data.error);
        return;
      }

      if (!data.data) {
        console.error("API success response missing 'data' field:", data);
        setError("Invalid response format received from server");
        return;
      }

      const answerData = Array.isArray(data.data) ? data.data : [data.data];
      setAnswer(prev => [...prev,...answerData]);
      setQuery("")
      inputRef.current?.focus();
    } catch (err: any) {
      console.error("Network/fetch connection error in handleQuerySubmit:", err);
      setloading(false);
      setError(err.message || "Failed to connect to the server. Please check if backend is running.");
    }
  }

  return (
    <div className="min-h-dvh w-full bg-zinc-50 ">
      <div className="mx-auto flex min-h-dvh w-full bg-zinc-50 max-w-2xl flex-col px-4 pb-24 pt-8">
        <header>
          <h1 className="text-4xl font-bold tracking-tight">Hello Agent - Ask anything</h1>
        </header>

        {error && (
          <div className="mb-4 mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 animate-in fade-in duration-200">
            <div className="font-semibold flex items-center gap-2">
              <span>⚠️</span>
              <span>Error Occurred</span>
            </div>
            <div className="mt-1 font-mono text-xs overflow-auto max-h-32 whitespace-pre-wrap">{error}</div>
          </div>
        )}

        <Card className="flex-1 mt-4">
          <CardHeader>
            <CardTitle>Answer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {
              answer.length === 0 ? (
                <p className="text-sm text-zinc-600">
                  No answer yet. Ask a query
                </p>
              ):(
                answer.map((ans,i)=>{
                  return(
                    <div key={i} className="rounded-xl border border-zinc-200 p-3">
                      <div className="text-sm leading-6">
                        <p className="text-sm text-zinc-600">
                          {ans.summary}
                        </p>
                        <p className="text-xs text-zinc-500 pt-2">
                          confidence: {ans.confidence.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  )
                })
              )
            }
          </CardContent>
        </Card>
        <form ref={formRef} onSubmit={handleQuerySubmit} className="fixed inset-x-0 bottom-0  mx-auto w-full max-w-2xl px-4 py-4 backdrop-blur-2xl">
          <div className="flex gap-2">
            <Input disabled={loading} ref={inputRef} value={query} className="h-11" onChange={e=>setQuery(e.target.value)} placeholder="type your question" />
            <Button type="submit" disabled={loading} className="h-11">
              {
                loading?"Thinking.....":"Ask ?"
              }
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
