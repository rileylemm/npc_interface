import { GeneratedImage } from "@/types/api";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Share, Eye } from "lucide-react";

interface ImageCardProps {
  image: GeneratedImage;
  onClick: () => void;
}

export default function ImageCard({ image, onClick }: ImageCardProps) {
  return (
    <Card className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
      <div className="relative pb-[75%] overflow-hidden group">
        <img
          src={image.url}
          alt={image.prompt}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
          <div className="p-4 w-full">
            <div className="flex justify-between items-center">
              <p className="text-white text-sm line-clamp-1">{image.prompt}</p>
              <button
                onClick={onClick}
                className="p-1.5 bg-white/20 rounded-full hover:bg-white/30 text-white"
              >
                <Eye className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
          {image.prompt}
        </p>
        <div className="mt-2 flex justify-between items-center">
          <span className="text-xs text-slate-500 dark:text-slate-500">
            {image.date}
          </span>
          <div className="flex space-x-2">
            <button className="text-slate-400 hover:text-primary-500">
              <Download className="h-5 w-5" />
            </button>
            <button className="text-slate-400 hover:text-primary-500">
              <Share className="h-5 w-5" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
