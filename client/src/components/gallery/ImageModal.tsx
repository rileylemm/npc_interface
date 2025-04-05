import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GeneratedImage } from "@/types/api";
import { Download, Share, ArrowRightFromLine, X } from "lucide-react";

interface ImageModalProps {
  image: GeneratedImage;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImageModal({ image, isOpen, onClose }: ImageModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Image Details</DialogTitle>
          <DialogDescription className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {image.prompt}
          </DialogDescription>
        </DialogHeader>

        <div className="aspect-[4/3] overflow-hidden rounded-lg">
          <img
            src={image.url}
            alt={image.prompt}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="mt-4 bg-slate-100 dark:bg-slate-700 p-4 rounded-md">
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Prompt Used</h4>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{image.prompt}</p>
        </div>

        <div className="mt-4 flex flex-wrap justify-between items-center">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Generated on {image.date}
          </div>
          <div className="flex space-x-2 mt-2 sm:mt-0">
            <Button variant="outline" size="sm" className="flex items-center">
              <Download className="h-4 w-4 mr-1.5" />
              Download
            </Button>
            <Button variant="outline" size="sm" className="flex items-center">
              <Share className="h-4 w-4 mr-1.5" />
              Share
            </Button>
            <Button variant="outline" size="sm" className="flex items-center">
              <ArrowRightFromLine className="h-4 w-4 mr-1.5" />
              Use in Chat
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
