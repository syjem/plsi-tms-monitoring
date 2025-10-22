// import { useCurrentUserName } from "@/hooks/use-current-user-name";
// import React from "react";

// export function ExtractedFilesList() {
//   const name = useCurrentUserName();
//   const [keys, setKeys] = React.useState("");

//   React.useEffect(() => {
//     for (let i = 0; i < localStorage.length; i++) {
//       const key = localStorage.key(i);
//       setKeys((prevKeys) => (prevKeys ? `${prevKeys}, ${key}` : key));
//     }
//   }, []);

//   return (
//     <div className="w-full max-w-4xl mx-auto py-8 md:pt-10 px-4">
//       <h3 className="text-xl font-semibold mb-4">Extracted Files for {name}</h3>
//       <p className="text-sm text-gray-600">
//         {keys
//           .split(",")
//           .map((key) => key.trim())
//           .join(", ")}
//       </p>
//     </div>
//   );
// }
