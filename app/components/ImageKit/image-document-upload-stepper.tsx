import React, { useState, useRef } from "react";

// Types for props
type CaptureType = boolean | "user" | "environment";
interface UploadStep {
  label: string;
  name: string;
  accept?: string;
  capture?: CaptureType;
}

interface ImageDocumentUploadStepperProps {
  imageSteps: UploadStep[];
  documentSteps: UploadStep[];
  onComplete: (uploadedFiles: Record<string, string>) => void;
}

const fetchAuthParams = async () => {
    const res = await fetch("https://bdicisp.vercel.app/api/v1/auth/imagekit/auth", { method: "POST" });
    if (!res.ok) throw new Error("Failed to fetch upload auth params");
    const data = await res.json(); // Only call .json() once!
    console.log(data);
    return data; // { signature, expire, token, publicKey }
  };

const uploadToImageKit = async (
  file: File,
  authParams: any,
  onProgress?: (percent: number) => void
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileName", file.name);
  formData.append("publicKey", "public_k/7VGHSYTH1q/STxZGOGFWUrsdE=");
  formData.append("signature", authParams.signature);
  formData.append("expire", authParams.expire);
  formData.append("token", authParams.token);
  formData.append("folder", "/service-hub-property-registration-images"); // e.g., "/property-images"

  return new Promise<any>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://upload.imagekit.io/api/v1/files/upload");
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };
    xhr.onload = () => {
      if (xhr.status === 200) {
        const resp = JSON.parse(xhr.responseText);
        resolve({url: resp.url, fileId: resp.fileId});
      } else {
        reject(new Error("Upload failed: " + xhr.statusText));
      }
    };
    xhr.onerror = () => reject(new Error("Upload failed"));
    xhr.send(formData);
  });
};

const ImageDocumentUploadStepper: React.FC<ImageDocumentUploadStepperProps> = ({
  imageSteps,
  documentSteps,
  onComplete,
}) => {
  const steps = [...imageSteps, ...documentSteps];
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<Record<string, string>>({});
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [fileIds, setFileIds] = useState<Record<string, string>>({});
  const [deleting, setDeleting] = useState<Record<string, boolean>>({});
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const current = steps[step];
  const isImageStep = step < imageSteps.length;
  const accept = current.accept || (isImageStep ? "image/*" : ".pdf,.doc,.docx,.png,.jpg,.jpeg");
  const capture = current.capture;

  const isCurrentStepUploaded = !!urls[current.name];

  // Drag and drop handlers
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setError(null);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    handleFile(file);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // File input handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleFile(file);
  };

  const deletePreviousFile = async (fileId: string) => {
    const res = await fetch(`https://api.imagekit.io/v1/files/${fileId}`, { method: "DELETE", headers: {
   "Authorization": `Basic ${Buffer.from('private_SXhinF5ODmtU7HRonnZ3ipezKJc=:').toString('base64')}`    } });
    if (!res.ok) throw new Error("Failed to delete previous file");
  };

  // Handle file selection (from input or drop)
  const handleFile = async (file: File) => {
    setFiles((prev) => ({ ...prev, [current.name]: file }));
    setProgress((prev) => ({ ...prev, [current.name]: 0 }));
    setError(null);
    // Preview before upload
    if (isImageStep) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreview((prev) => ({ ...prev, [current.name]: ev.target?.result as string }));
      };
      reader.readAsDataURL(file);
    } else {
      setPreview((prev) => ({ ...prev, [current.name]: file.name }));
    }
    setLoadingAuth(true);
    try {
      const authParams = await fetchAuthParams();
      setLoadingAuth(false);
      const resp = await uploadToImageKit(file, authParams, (p) =>
        setProgress((prev) => ({ ...prev, [current.name]: p }))
      );
      // resp may be url or object; support both
      if (typeof resp === 'string') {
        setUrls((prev) => ({ ...prev, [current.name]: resp }));
      } else {
        setUrls((prev) => ({ ...prev, [current.name]: resp.url }));
        setFileIds((prev) => ({ ...prev, [current.name]: resp.fileId }));
      }
    } catch (err: any) {
      setLoadingAuth(false);
      setError(err.message || "Upload failed");
    }
  };

  const handleNext = () => {
    if (!isCurrentStepUploaded) {
      setError("Please upload a file before continuing.");
      return;
    }
    setError(null);
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(urls);
      setUploadSuccess(true);
    }
  };

  const handleBack = () => {
    setError(null);
    setStep((s) => Math.max(0, s - 1));
  };

  // UI for drop area
  const renderDropArea = () => (
    <div
      className={`flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-lg p-6 min-h-[160px] cursor-pointer bg-gray-50 hover:bg-green-50 transition-colors relative ${loadingAuth ? 'opacity-60 pointer-events-none' : ''}`}
      onClick={() => !loadingAuth && fileInputRef.current?.click()}
      onDrop={loadingAuth ? undefined : handleDrop}
      onDragOver={loadingAuth ? undefined : handleDragOver}
    >
      <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4a1 1 0 011-1h8a1 1 0 011 1v12m-4 4v-4m0 0l-2-2m2 2l2-2" />
      </svg>
      <span className="text-gray-600 text-sm mb-1">Drag & drop or click to choose file</span>
      <span className="text-xs text-gray-400">{isImageStep ? "JPG, PNG, JPEG" : "PDF, DOC, DOCX, PNG, JPG, JPEG"}</span>
      <input
        type="file"
        accept={accept}
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        disabled={loadingAuth}
        {...(typeof capture === 'boolean' || capture === 'user' || capture === 'environment' ? { capture } : {})}
      />
      {loadingAuth && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-80 rounded-lg">
          <svg className="animate-spin w-8 h-8 text-green-500 mb-2" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
          <span className="text-green-700 font-medium">Connecting to server...</span>
        </div>
      )}
    </div>
  );

  if (uploadSuccess) {
    return (
      <div className="mx-auto bg-white border border-gray-200 rounded-xl shadow-sm p-6 mt-6">
        <div className="flex flex-col items-center justify-center py-12">
          <svg className="w-20 h-20 text-green-500 mb-4" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" className="text-green-100" fill="currentColor" />
            <path d="M7 13l3 3 7-7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h2 className="text-2xl font-bold text-green-700 mb-2">All images and documents uploaded successfully!</h2>
          {/* Optionally, show a summary of uploaded files here */}
          <ul className="mt-4 space-y-2">
            {Object.entries(urls).map(([name, url]) => (
              <li key={name} className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="currentColor" className="text-green-100" /><path d="M7 13l3 3 7-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <a href={url} target="_blank" rel="noopener noreferrer" className="text-green-700 underline text-sm">{name.replace(/[-_]/g, ' ').replace(/\.[^/.]+$/, '')}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto bg-white border border-gray-200 rounded-xl shadow-sm p-6 mt-6">
      <div className="flex items-center justify-between mb-6">
        {steps.map((s, idx) => (
          <div key={s.name} className="flex-1 flex flex-col items-center">
            <div
              className={`rounded-full w-8 h-8 flex items-center justify-center font-bold text-white transition-all duration-200 border-2 ${
                idx === step
                  ? "bg-green-600 border-green-700 scale-110 shadow-lg"
                  : idx < step
                  ? "bg-green-500 border-green-600"
                  : "bg-gray-300 border-gray-300"
              }`}
            >
              {idx + 1}
            </div>
            <span className={`mt-2 text-xs text-center ${idx === step ? "font-semibold text-green-700" : "text-gray-500"}`}>{s.label}</span>
            {idx < steps.length - 1 && (
              <div
                className={`w-full h-1 mt-2 mb-2 transition-all duration-200 ${
                  idx < step
                    ? "bg-green-500"
                    : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-2">{current.label}</label>
        {/* Preview before upload or after selection */}
        {preview[current.name] && isImageStep && (
          <img
            src={preview[current.name]}
            alt="Preview"
            className="w-full max-h-64 object-contain rounded mb-2 border"
          />
        )}
        {preview[current.name] && !isImageStep && (
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 17V4a1 1 0 011-1h8a1 1 0 011 1v13m-4 4v-4m0 0l-2-2m2 2l2-2" />
            </svg>
            <span className="text-gray-700 text-sm">{preview[current.name]}</span>
          </div>
        )}
        {/* Uploaded file preview (after upload) */}
        {urls[current.name] && (
          <div className="flex items-center gap-2 mb-2">
            {isImageStep ? (
              <>
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-green-700 text-sm">Uploaded!</span>
              </>
            ) : (
              <a href={urls[current.name]} target="_blank" rel="noopener noreferrer" className="text-green-600 underline">View Uploaded Document</a>
            )}
            {/* Change button */}
            <button
              type="button"
              className="ml-3 px-3 py-1 rounded bg-yellow-500 text-white text-xs disabled:opacity-60"
              disabled={deleting[current.name]}
              onClick={async () => {
                if (!fileIds[current.name]) return;
                if (!window.confirm("Replace file? Previous file will be deleted.")) return;
                setDeleting((prev) => ({ ...prev, [current.name]: true }));
                setError(null);
                try {
                  await deletePreviousFile(fileIds[current.name]);
                  // Reset state for this step (remove the key)
                  setUrls((prev) => {
                    const { [current.name]: _, ...rest } = prev;
                    return rest;
                  });
                  setFiles((prev) => {
                    const { [current.name]: _, ...rest } = prev;
                    return rest;
                  });
                  setPreview((prev) => {
                    const { [current.name]: _, ...rest } = prev;
                    return rest;
                  });
                  setFileIds((prev) => {
                    const { [current.name]: _, ...rest } = prev;
                    return rest;
                  });
                  setProgress((prev) => {
                    const { [current.name]: _, ...rest } = prev;
                    return rest;
                  });
                } catch (err: any) {
                  setError("Failed to delete previous file. " + (err.message || ""));
                } finally {
                  setDeleting((prev) => ({ ...prev, [current.name]: false }));
                }
              }}
            >
              {deleting[current.name] ? (
                <span className="flex items-center"><svg className="animate-spin w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>Deleting...</span>
              ) : (
                "Change"
              )}
            </button>
          </div>
        )}
        {/* Drop area (only show if not uploaded yet) */}
        {!urls[current.name] && renderDropArea()}
        {/* Progress bar */}
        {progress[current.name] ? (
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2 mt-2">
            <div
              className="bg-green-600 h-2 rounded-full"
              style={{ width: `${progress[current.name]}%` }}
            />
          </div>
        ) : null}
        {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
      </div>
      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={handleBack}
          disabled={step === 0}
          className="px-4 py-2 rounded border bg-gray-100 text-gray-700 disabled:opacity-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="px-4 py-2 rounded bg-green-600 text-white disabled:opacity-50"
          disabled={!isCurrentStepUploaded}
        >
          {step === steps.length - 1 ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default ImageDocumentUploadStepper; 