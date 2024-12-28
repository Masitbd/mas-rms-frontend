import React, { Dispatch, SetStateAction, useState } from "react";
import { Button, Modal, Uploader, Grid, Row, Col } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import { ImageUploaderProps, TFIle } from "./TypesAndDefault";
import Image from "next/image";
import Swal from "sweetalert2";
import { ENUM_MODE } from "@/enums/EnumMode";

const ImageUploader: React.FC<ImageUploaderProps> = ({
  existingImages,
  onUpdate,
  images,
  setImages,
  delFn,
  id,
  mode,
}) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);

  // Handle new file uploads
  const handleUpload = (fileList: File[]): void => {
    const newImages = fileList.map((file) => ({
      url: URL.createObjectURL(file),
      file: file,
    }));
    const updatedImages = [...newImages];
    setImages(updatedImages);
    if (onUpdate) {
      onUpdate(updatedImages);
    }
  };

  // Handle removing an image
  const handleRemove = async (imageId: string) => {
    const willDelete = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
    try {
      if (willDelete?.isConfirmed) {
        const result = await delFn({ id: id, publicUrl: imageId }).unwrap();
        if (result?.success) {
          Swal.fire("Success", "Image deleted successfully", "success");
        }
      }
    } catch (error) {
      Swal.fire("Error", (error ?? "Something went wrong") as string, "error");
    }
  };

  // Open fullscreen preview
  const handlePreview = (image: string): void => {
    setPreviewImage(image);
    setIsPreviewOpen(true);
  };

  return (
    <div className="border border-stone-400 rounded-lg my-5 bg-white p-2">
      {/* Uploader Component */}
      <div className={`${mode == ENUM_MODE.VIEW ? "invisible" : "visible"}`}>
        <Uploader
          autoUpload={false}
          multiple
          listType="picture-text"
          onChange={(fileList) =>
            handleUpload(fileList.map((file) => file.blobFile!))
          }
          accept="image/*"
          action={""}
          size="lg"
          className="items-center justify-center"
        >
          <Button appearance="primary" size="lg">
            Upload Images
          </Button>
        </Uploader>
      </div>
      {/* Display Existing or Uploaded Images */}
      <div className="grid grid-cols-10 my-5 gap-5">
        {existingImages?.map((image: TFIle, index) => (
          <div
            key={index}
            style={{ position: "relative" }}
            className="border border-stone-200 rounded-lg"
          >
            <Image
              src={image?.secure_url}
              alt={`Uploaded ${index}`}
              style={{ width: "100%", cursor: "pointer", borderRadius: "8px" }}
              onClick={() => handlePreview(image.secure_url)}
              height={20}
              width={20}
            />
            <Button
              appearance="primary"
              size="xs"
              style={{ position: "absolute", top: 5, right: 5 }}
              onClick={() => handleRemove(image?.public_id)}
              color="red"
              className={`${mode == ENUM_MODE.VIEW ? "invisible" : "visible"}`}
            >
              Delete
            </Button>
          </div>
        ))}
      </div>

      {/* Fullscreen Preview Modal */}
      <Modal
        open={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        size="lg"
      >
        <Modal.Header>
          <Modal.Title>Image Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img
            src={previewImage || ""}
            alt="Preview"
            style={{ width: "100%", borderRadius: "8px" }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setIsPreviewOpen(false)} appearance="primary">
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ImageUploader;
