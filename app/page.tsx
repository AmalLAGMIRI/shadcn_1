"use client";

import { useEffect, useState, useRef } from "react";
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
  Checkbox
} from "@/components/ui/checkbox";

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
  Pencil,
  X,
} from "lucide-react";

export default function Home() {
  const [fontSize, setFontSize] = useState("16");
  const editableRef = useRef<HTMLDivElement | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageTab, setImageTab] = useState("url"); // "url" or "file"
  const [imageUrl, setImageUrl] = useState("");
  const [imageAltText, setImageAltText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectionRange, setSelectionRange] = useState<Range | null>(null);
  // New state for image dimensions
  const [imageWidth, setImageWidth] = useState("");
  const [imageHeight, setImageHeight] = useState("");
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  // New state for character limit
  const [charRemaining, setCharRemaining] = useState(500);
  const maxChars = 500;

  useEffect(() => {
    const styleOverride = document.createElement("style");
    styleOverride.innerHTML = `
      font[size="1"] { font-size: 10px; }
      font[size="2"] { font-size: 12px; }
      font[size="3"] { font-size: 16px; }
      font[size="4"] { font-size: 20px; }
      font[size="5"] { font-size: 24px; }
      font[size="6"] { font-size: 32px; }
      font[size="7"] { font-size: 48px; }
    `;
    document.head.appendChild(styleOverride);

    return () => {
      // Cleanup the style element when component unmounts
      if (document.head.contains(styleOverride)) {
        document.head.removeChild(styleOverride);
      }
    };
  }, []);

  // Save selection when editor is focused or selection changes
  useEffect(() => {
    const saveSelection = () => {
      const selection = window.getSelection();
      if (selection == null) return;

      if (selection.rangeCount > 0) {
        setSelectionRange(selection.getRangeAt(0));
      }
    };

    const editor = editableRef.current;
    if (editor) {
      editor.addEventListener('mouseup', saveSelection);
      editor.addEventListener('keyup', saveSelection);
      editor.addEventListener('focus', saveSelection);
    }

    return () => {
      if (editor) {
        editor.removeEventListener('mouseup', saveSelection);
        editor.removeEventListener('keyup', saveSelection);
        editor.removeEventListener('focus', saveSelection);
      }
    };
  }, []);

  // Effect to update height when width changes (if maintaining aspect ratio)
  useEffect(() => {
    if (maintainAspectRatio && originalDimensions.width && originalDimensions.height && imageWidth) {
      const aspectRatio = originalDimensions.height / originalDimensions.width;
      const calculatedHeight = Math.round(parseInt(imageWidth) * aspectRatio);
      setImageHeight(calculatedHeight.toString());
    }
  }, [imageWidth, maintainAspectRatio, originalDimensions]);

  // Effect to update width when height changes (if maintaining aspect ratio)
  useEffect(() => {
    if (maintainAspectRatio && originalDimensions.width && originalDimensions.height && imageHeight) {
      const aspectRatio = originalDimensions.width / originalDimensions.height;
      const calculatedWidth = Math.round(parseInt(imageHeight) * aspectRatio);
      setImageWidth(calculatedWidth.toString());
    }
  }, [imageHeight, maintainAspectRatio, originalDimensions]);

  // Add key down event handler to restrict input when limit reached
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const editable = editableRef.current;
      if (!editable) return;

      const text = editable.innerText || "";
      const chars = text.length;

      // Only block if we're at the limit and not pressing control keys, backspace, delete, arrows etc.
      const isActionKey = e.ctrlKey || e.metaKey || e.altKey ||
        e.key === 'Backspace' || e.key === 'Delete' ||
        e.key === 'ArrowLeft' || e.key === 'ArrowRight' ||
        e.key === 'ArrowUp' || e.key === 'ArrowDown' ||
        e.key === 'Home' || e.key === 'End' ||
        e.key === 'Tab' || e.key === 'Escape';

      if (chars >= maxChars && !isActionKey && e.key.length === 1) {
        e.preventDefault();
      }
    };

    const editor = editableRef.current;
    if (editor) {
      editor.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (editor) {
        editor.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [maxChars]);

  // Add paste event handler to restrict pasting when limit reached
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const editable = editableRef.current;
      if (!editable) return;

      e.preventDefault(); // Prevent the default paste

      // Get current text and pasted text
      const text = editable.innerText || "";
      const pastedText = e.clipboardData?.getData('text') || '';

      // Calculate available space
      const remainingSpace = Math.max(0, maxChars - text.length);

      if (remainingSpace <= 0) {
        // No space left, don't paste anything
        return;
      }

      // Truncate pasted text if needed
      const truncatedPaste = pastedText.substring(0, remainingSpace);

      // Insert at cursor position
      const selection = window.getSelection();

      if (selection == null) return;
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(truncatedPaste));

        // Move cursor to end of inserted text
        range.setStartAfter(range.endContainer);
        range.setEndAfter(range.endContainer);
        selection.removeAllRanges();
        selection.addRange(range);

        updatePreview();
      }
    };

    const editor = editableRef.current;
    if (editor) {
      editor.addEventListener('paste', handlePaste);
    }

    return () => {
      if (editor) {
        editor.removeEventListener('paste', handlePaste);
      }
    };
  }, [maxChars]);

  // Add input event handler to enforce character limit after any content changes
  useEffect(() => {
    const handleInput = () => {
      const editable = editableRef.current;
      if (!editable) return;

      const text = editable.innerText || "";

      if (text.length > maxChars) {
        // Save selection
        const selection = window.getSelection();
        if (selection == null) return;

        const selectionOffset = selection.focusOffset;

        // Truncate text
        editable.innerText = text.substring(0, maxChars);

        // Try to restore cursor at a valid position
        try {
          if (selectionOffset <= maxChars) {
            const range = document.createRange();
            if (editable.firstChild) {
              range.setStart(editable.firstChild, Math.min(selectionOffset, maxChars));
              range.collapse(true);
              selection.removeAllRanges();
              selection.addRange(range);
            }
          }
        } catch (e) {
          console.error("Could not restore selection:", e);
        }

        updatePreview();
      }
    };

    const editor = editableRef.current;
    if (editor) {
      // Use 'input' event to catch all content changes
      editor.addEventListener('input', handleInput);
    }

    return () => {
      if (editor) {
        editor.removeEventListener('input', handleInput);
      }
    };
  }, [maxChars]);

  const applyFontSizeGlobally = (newSize: string): void => {
    const editable = document.querySelector('[contenteditable="true"]') as HTMLElement | null;
    if (editable) {
      editable.style.fontSize = `${newSize}px`;
    }
  };

  const updatePreview = () => {
    const editable = editableRef.current;
    const preview = document.getElementById("preview");
    const charCount = document.getElementById("charCount");

    if (preview && editable) {
      preview.innerHTML = editable.innerHTML;
    }

    if (editable) {
      const text = editable.innerText || "";
      const words = text.trim().split(/\s+/).filter(Boolean).length;
      const chars = text.length;

      // Update remaining characters
      const remaining = Math.max(0, maxChars - chars);
      setCharRemaining(remaining);

      // Update character counter
      if (charCount) {
        charCount.textContent = `${remaining} characters  | ${words} words`;
      }
    }
  };

  // Format functions for paragraph dropdown
  // Update the applyFormatting function
  const applyFormatting = (format: string) => {
    const editable = editableRef.current;
    if (!editable) return;

    // Save selection
    const selection = window.getSelection();
    if (selection == null) return;
    if (selection.rangeCount === 0) return;

    // Make sure we have focus
    editable.focus();

    switch (format) {
      case 'p':
        document.execCommand('formatBlock', false, 'P');
        break;
      case 'h1':
        document.execCommand('formatBlock', false, 'H1');
        break;
      case 'h2':
        document.execCommand('formatBlock', false, 'H2');
        break;
      case 'h3':
        document.execCommand('formatBlock', false, 'H3');
        break;
      case 'h4':
        document.execCommand('formatBlock', false, 'H4');
        break;
      default:
        break;
    }

    updatePreview();
  };

  // Load image dimensions when URL changes
  const loadImageDimensions = (url: string | null) => {
    if (!url) return;

    const img = new Image();
    img.onload = () => {
      setOriginalDimensions({ width: img.width, height: img.height });
      setImageWidth(img.width.toString());
      setImageHeight(img.height.toString());
    };
    img.onerror = () => {
      console.error("Error loading image");
      setOriginalDimensions({ width: 0, height: 0 });
    };
    img.src = url;
  };

  // Load image dimensions when file changes
  const loadFileDimensions = (file: File | null) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height });
        setImageWidth(img.width.toString());
        setImageHeight(img.height.toString());
      };
      if (e.target?.result) {
        img.src = e.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  // Image Modal functionality
  const openImageModal = () => {
    // Save selection before opening modal
    const selection = window.getSelection();
    if (selection == null) return;
    if (selection.rangeCount > 0) {
      setSelectionRange(selection.getRangeAt(0));
    }

    setImageUrl("");
    setImageAltText("");
    setSelectedFile(null);
    setImageTab("url");
    setImageWidth("");
    setImageHeight("");
    setOriginalDimensions({ width: 0, height: 0 });
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      loadFileDimensions(file);
    }
  };

  const handleImageUrlChange = (url: string) => {
    setImageUrl(url);
    if (isValidImageUrl(url)) {
      loadImageDimensions(url);
    }
  };

  const insertImageFromModal = () => {
    const editable = editableRef.current;
    if (!editable || !selectionRange) return;

    // Restore selection
    const selection = window.getSelection();
    if (selection == null) return;

    selection.removeAllRanges();
    selection.addRange(selectionRange);

    if (imageTab === "url" && imageUrl) {
      // Create image element
      const img = document.createElement("img");
      img.src = imageUrl;
      img.alt = imageAltText || "Image";

      // Apply dimensions if provided
      if (imageWidth) img.width = parseInt(imageWidth);
      if (imageHeight) img.height = parseInt(imageHeight);

      // Insert image at cursor position
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(img);

      // Move cursor after image
      range.setStartAfter(img);
      range.setEndAfter(img);
      selection.removeAllRanges();
      selection.addRange(range);

      updatePreview();
      closeImageModal();
    } else if (imageTab === "file" && selectedFile) {
      // Handle file upload
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement("img");
        if (e.target?.result) {
          img.src = e.target.result as string;
        }
        img.alt = imageAltText || "Uploaded image";

        // Apply dimensions if provided
        if (imageWidth) img.width = parseInt(imageWidth);
        if (imageHeight) img.height = parseInt(imageHeight);

        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(img);

        // Move cursor after image
        range.setStartAfter(img);
        range.setEndAfter(img);
        selection.removeAllRanges();
        selection.addRange(range);

        updatePreview();
      };
      reader.readAsDataURL(selectedFile);
      closeImageModal();
    }
  };

  // Insert table functionality
  const insertTable = () => {
    const rows = prompt("Enter number of rows:", "3");
    const cols = prompt("Enter number of columns:", "3");

    if (rows && cols) {
      const numRows = parseInt(rows, 10);
      const numCols = parseInt(cols, 10);

      if (isNaN(numRows) || isNaN(numCols) || numRows < 1 || numCols < 1) {
        alert("Please enter valid numbers for rows and columns.");
        return;
      }

      let tableHTML = '<table style="border-collapse: collapse; width: 100%; margin: 10px 0;">';

      // Create header row
      tableHTML += '<thead><tr>';
      for (let j = 0; j < numCols; j++) {
        tableHTML += '<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Header ' + (j + 1) + '</th>';
      }
      tableHTML += '</tr></thead><tbody>';

      // Create table body
      for (let i = 0; i < numRows - 1; i++) {
        tableHTML += '<tr>';
        for (let j = 0; j < numCols; j++) {
          tableHTML += '<td style="border: 1px solid #ddd; padding: 8px;">Cell ' + (i + 1) + '-' + (j + 1) + '</td>';
        }
        tableHTML += '</tr>';
      }

      tableHTML += '</tbody></table>';

      // Check if adding the table would exceed the character limit
      const editable = editableRef.current;
      if (editable) {
        const currentText = editable.innerText || "";
        const tableText = "Table"; // Approximate table text contribution

        if (currentText.length + tableText.length <= maxChars) {
          document.execCommand('insertHTML', false, tableHTML);
          updatePreview();
        } else {
          alert("Adding this table would exceed the character limit.");
        }
      }
    }
  };

  // Insert code block functionality
  const insertCodeBlock = () => {
    const language = prompt("Enter programming language (optional):", "javascript");

    const codeBlockHTML = `
      <pre style="background-color: #282c34; color: #abb2bf; padding: 10px; border-radius: 5px; overflow-x: auto; margin: 10px 0;">
        <code${language ? ` class="language-${language}"` : ''}>// Your code here</code>
      </pre>
    `;

    // Check if adding the code block would exceed the character limit
    const editable = editableRef.current;
    if (editable) {
      const currentText = editable.innerText || "";
      const codeBlockText = "// Your code here"; // Approximate code block text contribution

      if (currentText.length + codeBlockText.length <= maxChars) {
        document.execCommand('insertHTML', false, codeBlockHTML);
        updatePreview();
      } else {
        alert("Adding this code block would exceed the character limit.");
      }
    }
  };

  // Function to validate URL
  const isValidImageUrl = (url: string) => {
    return url && (
      url.startsWith("http://") ||
      url.startsWith("https://") ||
      url.startsWith("data:")
    );
  };

  return (
    <div className="min-h-screen flex flex-col justify-center w-full items-center bg-black p-4 space-y-4 text-white">
      {/* Preview Area */}
      <div
        className="min-h-[200px] w-[90%] border border-gray-700 rounded-md p-4 bg-zinc-950 text-white whitespace-pre-wrap overflow-auto max-h-[400px]"
        style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
        id="preview"
      >
      </div>
      <div className="w-[90%] bg-zinc-900 rounded-xl shadow-md p-4 space-y-4">

        {/* Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="ghost" size="icon" onClick={() => { document.execCommand("undo") }}><Undo className="w-4 h-4" /></Button>
          <Button variant="ghost" size="icon" onClick={() => { document.execCommand("redo") }} ><Redo className="w-4 h-4" /></Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-transparent" variant="outline">Paragraph</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => applyFormatting('h1')}>Heading 1</DropdownMenuItem>
              <DropdownMenuItem onClick={() => applyFormatting('h2')}>Heading 2</DropdownMenuItem>
              <DropdownMenuItem onClick={() => applyFormatting('h3')}>Heading 3</DropdownMenuItem>
              <DropdownMenuItem onClick={() => applyFormatting('h4')}>Heading 4</DropdownMenuItem>
              <DropdownMenuItem onClick={() => applyFormatting('p')}>Paragraph</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-transparent" variant="outline">Arial</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => document.execCommand('fontName', false, 'Arial')}>Arial</DropdownMenuItem>
              <DropdownMenuItem onClick={() => document.execCommand('fontName', false, 'Courier')}>Courier</DropdownMenuItem>
              <DropdownMenuItem onClick={() => document.execCommand('fontName', false, 'Georgia')}>Georgia</DropdownMenuItem>
              <DropdownMenuItem onClick={() => document.execCommand('fontName', false, 'Times New Roman')}>Times New Roman</DropdownMenuItem>
              <DropdownMenuItem onClick={() => document.execCommand('fontName', false, 'Verdana')}>Verdana</DropdownMenuItem>
              <DropdownMenuItem onClick={() => document.execCommand('fontName', false, 'Comic Sans MS')}>Comic Sans MS</DropdownMenuItem>
              <DropdownMenuItem onClick={() => document.execCommand('fontName', false, 'Impact')}>Impact</DropdownMenuItem>
              <DropdownMenuItem onClick={() => document.execCommand('fontName', false, 'Tahoma')}>Tahoma</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Font Size Input */}
          <Input
            type="number"
            min="8"
            max="72"
            value={fontSize}
            onChange={(e) => {
              const newSize = e.target.value;
              setFontSize(newSize);
              applyFontSizeGlobally(newSize);
            }}
            className="w-20"
          />

          {/* Font Styles */}
          <ToggleGroup type="multiple" className="flex gap-1">
            <ToggleGroupItem value="bold" onClick={() => document.execCommand("bold")}>
              <Bold className="w-4 h-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" onClick={() => document.execCommand("italic")}>
              <Italic className="w-4 h-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" onClick={() => document.execCommand("underline")}>
              <Underline className="w-4 h-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="strike" onClick={() => document.execCommand("strikeThrough")}>
              <Strikethrough className="w-4 h-4" />
            </ToggleGroupItem>
          </ToggleGroup>

          <Button variant="ghost" size="icon" onClick={() => {
            const url = prompt("Enter URL");
            if (url) document.execCommand("createLink", false, url);
          }}>
            <Link className="w-4 h-4" />
          </Button>

          {/* Alignment */}
          <ToggleGroup type="single" className="flex gap-1">
            <ToggleGroupItem value="left" onClick={() => document.execCommand("justifyLeft")}>
              <AlignLeft className="w-4 h-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="center" onClick={() => document.execCommand("justifyCenter")}>
              <AlignCenter className="w-4 h-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="right" onClick={() => document.execCommand("justifyRight")}>
              <AlignRight className="w-4 h-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="justify" onClick={() => document.execCommand("justifyFull")}>
              <AlignJustify className="w-4 h-4" />
            </ToggleGroupItem>
          </ToggleGroup>

          {/* Lists */}
          <ToggleGroup type="single" className="flex gap-1">
            <ToggleGroupItem value="ul" onClick={() => document.execCommand("insertUnorderedList")}>
              <List className="w-4 h-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="ol" onClick={() => document.execCommand("insertOrderedList")}>
              <ListOrdered className="w-4 h-4" />
            </ToggleGroupItem>
          </ToggleGroup>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-transparent" variant="outline"><Plus className="w-4 h-4 mr-1" /> Insert</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={openImageModal}>Image</DropdownMenuItem>
              <DropdownMenuItem onClick={insertTable}>Table</DropdownMenuItem>
              <DropdownMenuItem onClick={insertCodeBlock}>Code Block</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Character Counter */}
        <div className={`text-sm ${charRemaining < 50 ? "text-red-500 font-bold" : charRemaining < 100 ? "text-yellow-500" : "text-gray-400"} mb-1`}>
          {charRemaining} characters remaining
        </div>

        {/* Editable Area */}
        <div
          ref={editableRef}
          
          className="min-h-[200px] border border-gray-700 rounded-md p-4 bg-zinc-950 text-white overflow-auto max-h-[400px]"
          contentEditable
          suppressContentEditableWarning={true}
          onInput={updatePreview}
          style={{ wordBreak: "break-word" }}
        >
          Hello World 🚀
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-1 text-sm text-gray-500">
          <span id="charCount" className="flex justify-center items-center text-center w-full">
            {charRemaining} characters | 0 words
          </span>

          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => alert("Mic input not implemented")}>
              <Mic className="h-4 w-4 text-white" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => {
              const editable = editableRef.current;
              const content = editable?.innerText;
              console.log("Sent content:", content);
            }}>
              <Send className="h-4 w-4 text-white" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => document.getElementById("fileUpload")?.click()}>
              <Upload className="h-4 w-4 text-white" />
            </Button>
            <input
              id="fileUpload"
              type="file"
              accept=".txt"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () => {
                    const editable = editableRef.current;
                    if (editable) {
                      // Check if file content would exceed character limit
                      const content = reader?.result?.toString() || "";
                      if (content.length <= maxChars) {
                        editable.innerText = content;
                      } else {
                        editable.innerText = content.substring(0, maxChars);
                        alert(`File content was trimmed to ${maxChars} characters.`);
                      }
                      updatePreview();
                    }
                  };
                  reader.readAsText(file);
                }
              }}
            />
            <Button variant="ghost" size="icon" onClick={() => {
              const editable = editableRef.current;
              const content = editable?.innerText;
              if (!content) return;
              const blob = new Blob([content], { type: "text/plain" });
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = "document.txt";
              link.click();
            }}>
              <Download className="h-4 w-4 text-white" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => {
              const editable = editableRef.current;
              if (editable) {
                const text = editable.innerText || "";
                console.log(text);
                const words = text.trim().split(/\s+/).filter(Boolean).length;
                const chars = text.length;
                alert(`${maxChars - chars} characters | ${words} words`);
              }
            }}>
              <FileText className="h-4 w-4 text-white" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => {
              const editable = editableRef.current;
              if (editable) editable.contentEditable = editable.contentEditable === "true" ? "false" : "true";
            }}>
              <Lock className="h-4 w-4 text-white" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => {
              const editable = document.querySelector('[contenteditable="true"]');
              if (editable) {
                editable.innerHTML = "";
                updatePreview();
              }
            }}>
              <Trash className="h-4 w-4 text-white" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => {
              const editable = editableRef.current;
              if (editable) editable.contentEditable = "true";
            }}>
              <Pencil className="h-4 w-4 text-white" />
            </Button>
          </div>
        </div>
      </div>

      {/* Image Insert Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-zinc-900 rounded-md p-4 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Insert Image</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeImageModal}
                className="h-6 w-6"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Tab Navigation */}
            <div className="flex mb-4">
              <Button
                className={`flex-1 rounded-r-none ${imageTab === 'url' ? 'bg-zinc-800 text-white' : 'bg-zinc-950 text-gray-400'}`}
                onClick={() => setImageTab('url')}
              >
                URL
              </Button>
              <Button
                className={`flex-1 rounded-l-none ${imageTab === 'file' ? 'bg-zinc-800 text-white' : 'bg-zinc-950 text-gray-400'}`}
                onClick={() => setImageTab('file')}
              >
                File
              </Button>
            </div>

            {/* URL Input */}
            {imageTab === 'url' && (
              <div className="mb-4">
                <p className="text-sm text-gray-400 mb-2">Image URL</p>
                <Input
                  type="text"
                  placeholder="i.e. https://source.unsplash.com/random"
                  value={imageUrl}
                  onChange={(e) => handleImageUrlChange(e.target.value)}
                  className="bg-zinc-950 border-zinc-700"
                />
                {imageUrl && !isValidImageUrl(imageUrl) && (
                  <p className="text-red-500 text-xs mt-1">
                    Please enter a valid URL starting with http:// or https://
                  </p>
                )}
              </div>
            )}

            {/* File Input */}
            {imageTab === 'file' && (
              <div className="mb-4">
                <p className="text-sm text-gray-400 mb-2">Image Upload</p>
                <Button
                  variant="outline"
                  className="w-full bg-zinc-950 border-zinc-700 flex justify-between"
                  onClick={() => document.getElementById("imageFileUpload")?.click()}
                >
                  <span>Choose File</span>
                  <span className="text-gray-400">
                    {selectedFile ? selectedFile.name : "No file chosen"}
                  </span>
                </Button>
                <input
                  type="file"
                  id="imageFileUpload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            )}

            {/* Alt Text */}
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-2">Alt Text</p>
              <Input
                type="text"
                placeholder="Descriptive alternative text"
                value={imageAltText}
                onChange={(e) => setImageAltText(e.target.value)}
                className="bg-zinc-950 border-zinc-700"
              />
            </div>

            {/* Image Dimensions */}
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-2">Image Dimensions</p>
              <div className="flex gap-2 items-center">
                <div className="flex-1">
                  <p className="text-xs text-gray-400 mb-1">Width (px)</p>
                  <Input
                    type="number"
                    placeholder="Auto"
                    value={imageWidth}
                    onChange={(e) => setImageWidth(e.target.value)}
                    className="bg-zinc-950 border-zinc-700"
                  />
                </div>
                <span className="text-gray-400 mt-6">×</span>
                <div className="flex-1">
                  <p className="text-xs text-gray-400 mb-1">Height (px)</p>
                  <Input
                    type="number"
                    placeholder="Auto"
                    value={imageHeight}
                    onChange={(e) => setImageHeight(e.target.value)}
                    className="bg-zinc-950 border-zinc-700"
                  />
                </div>
                <span className="text-gray-400 mt-6">×</span>
                <div className="flex-1">
                  <p className="text-xs text-gray-400 mb-1">Height (px)</p>
                  <Input
                    type="number"
                    placeholder="Auto"
                    value={imageHeight}
                    onChange={(e) => setImageHeight(e.target.value)}
                    className="bg-zinc-950 border-zinc-700"
                  />
                </div>
              </div>

              {/* Maintain aspect ratio checkbox */}
              <div className="flex items-center mt-2">
                <Checkbox
                  id="maintainAspectRatio"
                  checked={maintainAspectRatio}
                  onCheckedChange={(checked) => setMaintainAspectRatio(checked === true)}
                  className="mr-2"
                />
                <label
                  htmlFor="maintainAspectRatio"
                  className="text-sm text-gray-400 cursor-pointer"
                >
                  Maintain aspect ratio
                </label>
              </div>

              {/* Reset dimensions button */}
              {originalDimensions.width > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 text-xs bg-zinc-950 border-zinc-700"
                  onClick={() => {
                    setImageWidth(originalDimensions.width.toString());
                    setImageHeight(originalDimensions.height.toString());
                  }}
                >
                  Reset to original ({originalDimensions.width}×{originalDimensions.height})
                </Button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end">
              <Button
                onClick={insertImageFromModal}
                className={`px-4 bg-zinc-700 hover:bg-zinc-600`}
                disabled={(imageTab === 'url' && (!imageUrl || !isValidImageUrl(imageUrl))) ||
                  (imageTab === 'file' && !selectedFile)}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}