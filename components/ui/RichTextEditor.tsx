// "use client";

// import { LexicalComposer } from "@lexical/react/LexicalComposer";
// import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
// import { ContentEditable } from "@lexical/react/LexicalContentEditable";
// import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
// import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
// import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
// import { EditorState } from "lexical";
// import { useEffect } from "react";
// import { Card } from "@/components/ui/card";

// function onChange(editorState: EditorState) {
//   console.log("Editor State Changed:", editorState);
// }

// export default function RichTextEditor() {
//   return (
//     <LexicalComposer
//       initialConfig={{
//         namespace: "MyEditor",
//         theme: {},
//         onError: (error) => console.error(error),
//       }}
//     >
//       <Card className="p-4 dark:bg-black">
//         <RichTextPlugin
//           contentEditable={
//             <ContentEditable className="p-2 border rounded-md outline-none text-white bg-gray-900" />
//           }
//           placeholder={<div className="text-gray-500">Start typing...</div>}
//         />
//         <HistoryPlugin />
//         <OnChangePlugin onChange={onChange} />
//       </Card>
//     </LexicalComposer>
//   );
// }
