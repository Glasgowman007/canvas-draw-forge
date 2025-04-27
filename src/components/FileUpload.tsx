
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { createAssetFromFile } from '@/utils/canvasUtils';
import { Asset } from '@/types';

interface FileUploadProps {
  onAssetAdd: (asset: Asset) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onAssetAdd }) => {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are supported');
      return;
    }

    try {
      setLoading(true);
      const asset = await createAssetFromFile(file);
      onAssetAdd(asset);
      toast.success(`Added ${file.name} to components`);
    } catch (error) {
      toast.error('Failed to upload file');
      console.error(error);
    } finally {
      setLoading(false);
      // Reset input value so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div>
      <Button 
        variant="default" 
        size="sm" 
        className="w-full bg-green-600 hover:bg-green-700"
        onClick={handleClick}
        disabled={loading}
      >
        <Plus className="mr-1 h-4 w-4" />
        Add Custom Component
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};
