"use client";

import { useState, useRef, useCallback } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../lib/firebaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageIcon, X, Crop, Upload } from "lucide-react";
import ReactCrop, { Crop as CropType, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { getAuth } from "firebase/auth";

interface ImageUploadProps {
  onImageUpload: (url: string) => void;
  currentImageUrl?: string;
  companyId?: string; // 求人サムネイル用
  userId?: string;    // ユーザーアイコン用
  mode?: 'job-thumbnail' | 'user-icon'; // どちらの用途か
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

export default function ImageUpload({ onImageUpload, currentImageUrl, companyId, userId, mode = 'user-icon' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const [crop, setCrop] = useState<CropType>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [imgSrc, setImgSrc] = useState('');
  const [showCrop, setShowCrop] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined)
      const reader = new FileReader()
      reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''))
      reader.readAsDataURL(e.target.files[0])
      setShowCrop(true)
    }
  }

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    if (aspect) {
      const { width, height } = e.currentTarget
      setCrop(centerAspectCrop(width, height, aspect))
    }
  }, [])

  const aspect = mode === 'job-thumbnail' ? 4 / 3 : 1; // job-thumbnailは4:3, user-iconは1:1

  // 画像を圧縮する関数
  const compressImage = (file: File, maxSizeKB: number = 100): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // アスペクト比に応じてトリミング
        const targetAspect = mode === 'job-thumbnail' ? 4 / 3 : 1; // 4:3 or 1:1
        let cropWidth, cropHeight, offsetX, offsetY;
        
        if (targetAspect === 1) {
          // 正方形の場合
        const size = Math.min(img.width, img.height);
          cropWidth = size;
          cropHeight = size;
          offsetX = (img.width - size) / 2;
          offsetY = (img.height - size) / 2;
        } else {
          // 4:3の場合
          const imgAspect = img.width / img.height;
          if (imgAspect > targetAspect) {
            // 画像が横長の場合、高さに合わせる
            cropHeight = img.height;
            cropWidth = img.height * targetAspect;
            offsetX = (img.width - cropWidth) / 2;
            offsetY = 0;
          } else {
            // 画像が縦長の場合、幅に合わせる
            cropWidth = img.width;
            cropHeight = img.width / targetAspect;
            offsetX = 0;
            offsetY = (img.height - cropHeight) / 2;
          }
        }
        
        canvas.width = cropWidth;
        canvas.height = cropHeight;
        
        ctx?.drawImage(img, offsetX, offsetY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
        
        // 品質を調整して圧縮
        let quality = 0.9;
        let blob: Blob;
        
        const compress = () => {
          canvas.toBlob((b) => {
            if (b) {
              blob = b;
              if (blob.size <= maxSizeKB * 1024 || quality <= 0.1) {
                resolve(blob);
              } else {
                quality -= 0.1;
                compress();
              }
            }
          }, 'image/jpeg', quality);
        };
        
        compress();
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  // トリミングされた画像を圧縮してアップロード
  const getCroppedImg = async (): Promise<Blob> => {
    if (!imgRef.current || !completedCrop) {
      throw new Error('No image or crop data');
    }

    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;

    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height,
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        }
      }, 'image/jpeg', 0.9);
    });
  };

  const handleCropComplete = async () => {
    if (!completedCrop) return;

    setUploading(true);
    try {
      // トリミングされた画像を取得
      const croppedBlob = await getCroppedImg();
      
      // 100KB以下に圧縮
      const maxSizeKB = mode === 'job-thumbnail' ? 500 : 100;
      const compressedBlob = await compressImage(croppedBlob as File, maxSizeKB);
      
      // Firebase Storageにアップロード
      let storageRef;
      if (mode === 'job-thumbnail') {
        if (!companyId) throw new Error("companyIdが指定されていません");
        const imageId = `${Date.now()}-cropped.jpg`;
        storageRef = ref(storage, `job-thumbnails/${companyId}/${imageId}`);
      } else {
        // user-icon
        const auth = getAuth();
        const currentUser = auth.currentUser;
        const uid = userId || (currentUser && currentUser.uid);
        if (!uid) throw new Error("ユーザーが認証されていません");
        storageRef = ref(storage, `user-icons/${uid}/icon.jpg`);
      }
      const snapshot = await uploadBytes(storageRef, compressedBlob);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      onImageUpload(downloadURL);
      setPreviewUrl(downloadURL);
      setShowCrop(false);
      setImgSrc('');
      setCrop(undefined);
      setCompletedCrop(undefined);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error("画像アップロードエラー:", error);
      alert("画像のアップロードに失敗しました");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onImageUpload("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCancelCrop = () => {
    setShowCrop(false);
    setImgSrc('');
    setCrop(undefined);
    setCompletedCrop(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <label className="block font-bold mb-1">アイコン画像</label>
      
      {previewUrl && !showCrop && (
        <div className="relative inline-block">
          <img
            src={previewUrl}
            alt="プレビュー"
            className="w-32 h-32 object-cover rounded-lg border"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {showCrop && imgSrc && (
        <div className="space-y-4">
          <div className="border rounded-lg p-4 bg-gray-50">
            <p className="text-sm text-gray-600 mb-2">
              {mode === 'job-thumbnail' 
                ? '4:3の横長にトリミングしてください（500KB以下に自動圧縮されます）'
                : '正方形にトリミングしてください（100KB以下に自動圧縮されます）'
              }
            </p>
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspect}
              minWidth={100}
              minHeight={100}
            >
              <img
                ref={imgRef}
                alt="Crop me"
                src={imgSrc}
                onLoad={onImageLoad}
                className="max-w-full max-h-96 object-contain"
              />
            </ReactCrop>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={handleCropComplete}
              disabled={uploading || !completedCrop}
              className="bg-main-600 hover:bg-main-700"
            >
              <Upload size={16} className="mr-2" />
              {uploading ? "アップロード中..." : "トリミングしてアップロード"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancelCrop}
              disabled={uploading}
            >
              キャンセル
            </Button>
          </div>
        </div>
      )}

      {!showCrop && (
        <div className="flex items-center space-x-2">
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onSelectFile}
            disabled={uploading}
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Crop size={16} className="mr-2" />
            {uploading ? "アップロード中..." : "画像を選択"}
          </Button>
        </div>
      )}
    </div>
  );
} 