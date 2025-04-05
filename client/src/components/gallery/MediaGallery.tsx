import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ImageCard from "./ImageCard";
import ImageModal from "./ImageModal";
import { GeneratedImage } from "@/types/api";

// Example image data - would come from API in real implementation
const sampleImages: GeneratedImage[] = [
  { id: "1", prompt: 'a serene forest landscape with a small cabin, digital art style', url: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Zm9yZXN0JTIwY2FiaW58ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60', date: '2023-11-14' },
  { id: "2", prompt: 'futuristic cityscape with flying cars and neon lights', url: 'https://images.unsplash.com/photo-1534120247760-c44c3e4a62f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGZ1dHVyaXN0aWMlMjBjaXR5fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60', date: '2023-11-13' },
  { id: "3", prompt: 'fantasy character portrait of an elven archer', url: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGZhbnRhc3klMjBhcmNoZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60', date: '2023-11-12' },
  { id: "4", prompt: 'underwater scene with coral reef and tropical fish', url: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y29yYWwlMjByZWVmfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60', date: '2023-11-10' },
  { id: "5", prompt: 'steampunk airship flying through clouds', url: 'https://images.unsplash.com/photo-1518429401329-606988433cf3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGFpcnNoaXB8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60', date: '2023-11-09' },
  { id: "6", prompt: 'magical library with floating books and ethereal light', url: 'https://images.unsplash.com/photo-1549383028-df014bd3f444?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bGlicmFyeXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60', date: '2023-11-07' }
];

export default function MediaGallery() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [images] = useState<GeneratedImage[]>(sampleImages);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openImageModal = (image: GeneratedImage) => {
    setSelectedImage(image);
    setModalOpen(true);
  };

  const filteredImages = images.filter(image => {
    if (searchQuery) {
      return image.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">Media Gallery</h1>
          <div className="flex space-x-2">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search prompts..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute left-3 top-2.5 text-slate-400">
                <Search className="h-5 w-5" />
              </div>
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter images" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Images</SelectItem>
                <SelectItem value="recent">Recent</SelectItem>
                <SelectItem value="favorites">Favorites</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((image) => (
            <ImageCard key={image.id} image={image} onClick={() => openImageModal(image)} />
          ))}
        </div>

        {selectedImage && (
          <ImageModal
            image={selectedImage}
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
