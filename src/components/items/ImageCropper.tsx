import React, { useState } from "react";
import { Button, Modal, Slider } from "rsuite";
import Cropper, { Area } from "react-easy-crop";
import { getCroppedImg } from "./cropImage"; // Utility function for cropping

interface ImageCropperModalProps {
  setCroppedImageState: (image: Blob) => void;
  id: string; // Function to set cropped image in parent
}

const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  setCroppedImageState,
  id,
}) => {
  const [open, setOpen] = useState<boolean>(false); // Modal state
  const [imageSrc, setImageSrc] = useState<string | null>(null); // Selected image source
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  // Handle image selection
  const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setImageSrc(reader.result as string); // Set the image for cropping
          setOpen(true); // Open the modal
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle cropping completion
  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area): void => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  // Handle "OK" button click
  const handleCrop = async (): Promise<void> => {
    try {
      if (imageSrc && croppedAreaPixels) {
        const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels); // Crop the image
        setCroppedImageState(croppedImage); // Set cropped image in parent state
        setOpen(false); // Close modal
      }
    } catch (error) {
      console.error("Error cropping the image:", error);
    }
  };

  return (
    <div>
      {/* Image Selection Button */}
      <input
        type="file"
        accept="image/*"
        id={`select-image-${id}`}
        style={{ display: "none" }}
        onChange={handleSelectImage}
      />
      <Button
        appearance="primary"
        onClick={() => document.getElementById(`select-image-${id}`)?.click()}
      >
        Select Image
      </Button>

      {/* Modal */}
      <Modal full open={open} onClose={() => setOpen(false)} size={"full"}>
        <Modal.Header>
          <Modal.Title>Crop Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {imageSrc && (
            <>
              <div
                style={{ position: "relative", width: "100%", height: "80vh" }}
              >
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1.2 / 1} // Set aspect ratio
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                  cropSize={{ height: 210, width: 240 }}
                />
              </div>
              <div className="max-w-96 mx-5">
                <div>Zoom:</div>
                <div>
                  <Slider
                    min={0.1}
                    max={2}
                    step={0.1}
                    onChange={setZoom}
                    defaultValue={zoom}
                  />
                </div>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button appearance="primary" onClick={handleCrop}>
            OK
          </Button>
          <Button appearance="subtle" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ImageCropperModal;
