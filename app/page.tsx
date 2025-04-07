// import { Button } from "@/components/ui/button";

"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";

import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Redo,
  Undo,
  Link,
  Plus,
  Mic,
  Send,
  Upload,
  Download,
  FileText,
  Lock,
  Trash,
  Pencil
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-black p-4 space-y-4 text-white">
      
      {/* Editor Section */}
      <div className="w-full max-w-5xl bg-zinc-900 rounded-xl shadow-md p-4 space-y-4">
        
        {/* Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="ghost" size="icon"><Undo className="w-4 h-4" /></Button>
          <Button variant="ghost" size="icon"><Redo className="w-4 h-4" /></Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Paragraph</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Heading</DropdownMenuItem>
              <DropdownMenuItem>Paragraph</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Arial</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Arial</DropdownMenuItem>
              <DropdownMenuItem>Courier</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <span className="px-2">16</span>

          <ToggleGroup type="multiple" className="flex gap-1">
            <ToggleGroupItem value="bold"><Bold className="w-4 h-4" /></ToggleGroupItem>
            <ToggleGroupItem value="italic"><Italic className="w-4 h-4" /></ToggleGroupItem>
            <ToggleGroupItem value="underline"><Underline className="w-4 h-4" /></ToggleGroupItem>
            <ToggleGroupItem value="strike"><Strikethrough className="w-4 h-4" /></ToggleGroupItem>
          </ToggleGroup>

          <Button variant="ghost" size="icon"><Link className="w-4 h-4" /></Button>

          <ToggleGroup type="single" className="flex gap-1">
            <ToggleGroupItem value="left"><AlignLeft className="w-4 h-4" /></ToggleGroupItem>
            <ToggleGroupItem value="center"><AlignCenter className="w-4 h-4" /></ToggleGroupItem>
            <ToggleGroupItem value="right"><AlignRight className="w-4 h-4" /></ToggleGroupItem>
            <ToggleGroupItem value="justify"><AlignJustify className="w-4 h-4" /></ToggleGroupItem>
          </ToggleGroup>

          <ToggleGroup type="single" className="flex gap-1">
            <ToggleGroupItem value="ul"><List className="w-4 h-4" /></ToggleGroupItem>
            <ToggleGroupItem value="ol"><ListOrdered className="w-4 h-4" /></ToggleGroupItem>
          </ToggleGroup>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline"><Plus className="w-4 h-4 mr-1" /> Insert</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Image</DropdownMenuItem>
              <DropdownMenuItem>Table</DropdownMenuItem>
              <DropdownMenuItem>Code Block</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Editable Area */}
        <div
          className="min-h-[150px] border border-gray-700 rounded-md p-4 bg-zinc-950 text-white"
          contentEditable
        >
          Hello World 🚀
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-1 text-sm text-gray-500">
          <span>14 characters | 3 words</span>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon"><Mic className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon"><Send className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon"><Upload className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon"><FileText className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon"><Lock className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon"><Trash className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>
    </div>
  );
}
