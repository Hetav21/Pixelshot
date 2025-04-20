import { Navbar } from "@/components/NavBar";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useCounter } from "../hooks/useCounter";

export function Dashboard() {
  const [isCapturing, setIsCapturing] = useState(false);
  const [paths, setPaths] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const counter = useCounter();

  useEffect(() => {
    const fetchPaths = async () => {
      const res = await window.electronAPI.getPaths({
        username: Cookies.get("username")!,
      });

      if (res.success) {
        setPaths(res.info?.filePaths!);

        // Convert to data URLs
        const urls = await Promise.all(
          res.info!.filePaths!.map((path) =>
            window.electronAPI.readImageAsDataUrl(path),
          ),
        );
        setImageUrls(urls);
      } else {
        toast.warning("Error fetching paths", {
          description: res.message,
        });
      }
    };

    fetchPaths();
  }, []);

  return (
    <div className="mx-10">
      <Navbar isCapturing={isCapturing} setIsCapturing={setIsCapturing} />

      <div className="py-32 lg:py-16"></div>

      <div className="pt-20 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {imageUrls.map((src, index) => (
            <div
              key={index}
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
            >
              <img
                src={src}
                alt={`Screenshot ${index + 1}`}
                className="w-full h-48 object-contain bg-gray-100"
              />

              <div className="px-3 py-2 text-sm text-gray-600 truncate">
                {paths[index].replace("file://", "")}
              </div>
            </div>
          ))}
        </div>
      </div>

      {isCapturing && counter !== null && counter > 0 && (
        <div className="fixed top-16 left-0 right-0 bottom-0 flex items-center justify-center bg-white z-40">
          <div className="text-center text-gray-600 font-medium text-2xl">
            Capturing in
            <span className="mx-2 font-semibold text-blue-600">{counter}</span>
            seconds
          </div>
        </div>
      )}
    </div>
  );
}
