"use client";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { Textarea } from "@/components/ui/textarea";
import { ChangeEvent, FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Download, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  const [mdCode, setMDCode] = useState<string>(
    "# Hello, 👋 \n Start editing the markdown with **live preview**!",
  );

  async function copyToClipboard(): Promise<void> {
    await navigator.clipboard.writeText(mdCode);
  }

  const handleUpload = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const inputElement = event.currentTarget.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const file = inputElement?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>): void => {
        const text = e.target?.result;
        console.log(text);
        if (typeof text === "string") {
          setMDCode(text);
        }
      };
      reader.readAsText(file);
    }
  };

  function handleFileDownload(): void {
    const blob = new Blob([mdCode], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "markdown.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <main className="font-sans h-screen">
      <section className="my-5">
        <h1 className="text-5xl font-bold flex justify-center items-center">
          Live Markdown Editor
        </h1>
        <div className="flex gap-2 px-3 flex-wrap">
          <Button onClick={copyToClipboard}>
            <Copy />
            Copy
          </Button>
          <Button onClick={handleFileDownload}>
            <Download />
            Download
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Upload />
                Upload
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload file</DialogTitle>
                <DialogDescription className="hidden"></DialogDescription>
              </DialogHeader>
              <form
                onSubmit={(e: FormEvent<HTMLFormElement>): void =>
                  handleUpload(e)
                }
              >
                <Input type="file" accept=".md" required />
                <Button type="submit">Upload</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </section>
      <section className="lg:hidden">
        <Tabs defaultValue="Code">
          <TabsList className="grid grid-cols-2 mx-1">
            <TabsTrigger value="Code">Markdown</TabsTrigger>
            <TabsTrigger value="Preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="Code">
            <div className="h-[40rem]">
              <Textarea
                autoFocus
                className="h-full border border-black"
                style={{ fontSize: 20 }}
                value={mdCode}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>): void =>
                  setMDCode(e.target.value)
                }
              />
            </div>
          </TabsContent>
          <TabsContent value="Preview">
            <div className="h-[40rem]">
              <MarkdownPreview
                className="h-full p-2 rounded-md"
                source={mdCode}
              />
            </div>
          </TabsContent>
        </Tabs>
      </section>
      <section className="hidden lg:grid lg:grid-cols-2 gap-4 mb-5 p-4 h-[40rem]">
        <div>
          <Textarea
            autoFocus
            className="h-full border border-black"
            style={{ fontSize: 20 }}
            value={mdCode}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>): void =>
              setMDCode(e.target.value)
            }
          />
        </div>
        <div>
          <MarkdownPreview className="h-full p-2 rounded-md" source={mdCode} />
        </div>
      </section>
    </main>
  );
}
