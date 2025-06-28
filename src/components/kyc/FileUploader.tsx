/**
 * Composant de téléchargement de fichiers
 * @module components/kyc/FileUploader
 */

import React, { useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploaderProps {
  id: string;
  accept: string;
  maxSize: number;
  multiple?: boolean;
  file?: File | null;
  files?: File[];
  error?: string | null;
  onChange: (file: File | File[] | null) => void;
  maxFiles?: number;
}

/**
 * Composant pour télécharger des fichiers avec drag & drop
 */
const FileUploader: React.FC<FileUploaderProps> = ({
  id,
  accept,
  maxSize,
  multiple = false,
  file,
  files,
  error,
  onChange,
  maxFiles = 10
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Configuration de react-dropzone
  const { getRootProps } = useDropzone({
    accept: accept.split(',').reduce<Record<string, string[]>>((acc, curr) => {
      acc[curr] = [];
      return acc;
    }, {} as Record<string, string[]>),
    maxSize,
    multiple,
    maxFiles,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    onDrop: (acceptedFiles) => {
      setIsDragging(false);
      if (multiple) {
        // Si on a déjà des fichiers, on les ajoute aux nouveaux
        const existingFiles = files || [];
        const newFiles = [...existingFiles, ...acceptedFiles];
        // Limiter le nombre de fichiers si nécessaire
        const limitedFiles = newFiles.slice(0, maxFiles);
        onChange(limitedFiles);
      } else {
        onChange(acceptedFiles[0]);
      }
    },
    onDropRejected: (rejectedFiles) => {
      setIsDragging(false);
      console.error('Fichiers rejetés:', rejectedFiles);
      // On pourrait ajouter une gestion d'erreur spécifique ici
    }
  });

  // Formater la taille du fichier
  const formatFileSize = (size: number): string => {
    if (size < 1024) {
      return `${size} B`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    } else {
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    }
  };

  // Obtenir l'extension du fichier
  const getFileExtension = (filename: string): string => {
    return filename.split('.').pop()?.toLowerCase() || '';
  };

  // Obtenir l'icône en fonction du type de fichier
  const getFileIcon = (file: File): string => {
    const extension = getFileExtension(file.name);
    
    switch (extension) {
      case 'pdf':
        return 'fas fa-file-pdf';
      case 'jpg':
      case 'jpeg':
      case 'png':
        return 'fas fa-file-image';
      default:
        return 'fas fa-file';
    }
  };

  // Supprimer un fichier
  const handleRemoveFile = (fileToRemove: File, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (multiple && files) {
      const newFiles = files.filter(f => f !== fileToRemove);
      onChange(newFiles);
    } else {
      onChange(null);
    }
  };

  // Rendu de la liste des fichiers
  const renderFileList = () => {
    if (multiple && files && files.length > 0) {
      return (
        <div className="file-list">
          {files.map((f, index) => (
            <div key={index} className="file-item">
              <div className="file-icon">
                <i className={getFileIcon(f)}></i>
              </div>
              <div className="file-info">
                <div className="file-name">{f.name}</div>
                <div className="file-size">{formatFileSize(f.size)}</div>
              </div>
              <button 
                type="button" 
                className="file-remove" 
                onClick={(e) => handleRemoveFile(f, e)}
                aria-label="Supprimer le fichier"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          ))}
        </div>
      );
    } else if (!multiple && file) {
      return (
        <div className="file-list">
          <div className="file-item">
            <div className="file-icon">
              <i className={getFileIcon(file)}></i>
            </div>
            <div className="file-info">
              <div className="file-name">{file.name}</div>
              <div className="file-size">{formatFileSize(file.size)}</div>
            </div>
            <button 
              type="button" 
              className="file-remove" 
              onClick={(e) => handleRemoveFile(file, e)}
              aria-label="Supprimer le fichier"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      );
    }
    
    return null;
  };

  // Rendu de la zone de dépôt
  const renderDropzone = () => {
    const hasFiles = (multiple && files && files.length > 0) || (!multiple && file);
    
    return (
      <div 
        {...getRootProps()} 
        className={`dropzone ${!hasFiles ? '' : 'compact'} ${isDragging ? 'dragging' : ''} ${error ? 'is-invalid' : ''}`}
      >
        <input {...getRootProps().inputProps} id={id} ref={fileInputRef} aria-label={multiple ? 'Télécharger des fichiers' : 'Télécharger un fichier'} />
        <div className="dropzone-content">
          {!hasFiles ? (
            <>
              <div className="dropzone-icon">
                <i className="fas fa-cloud-upload-alt"></i>
              </div>
              <div className="dropzone-text">
                <p>Glissez-déposez {multiple ? 'vos fichiers' : 'votre fichier'} ici</p>
                <p>ou</p>
                <button 
                  type="button" 
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Parcourir
                </button>
              </div>
              <div className="dropzone-info">
                {multiple ? (
                  <small>
                    {maxFiles > 1 ? `Maximum ${maxFiles} fichiers` : 'Un seul fichier'}, 
                    {formatFileSize(maxSize)} max par fichier
                  </small>
                ) : (
                  <small>{formatFileSize(maxSize)} maximum</small>
                )}
              </div>
            </>
          ) : (
            <button 
              type="button" 
              className="btn btn-outline-primary btn-sm"
              onClick={() => fileInputRef.current?.click()}
            >
              {multiple ? 'Ajouter d\'autres fichiers' : 'Changer de fichier'}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="file-uploader">
      {renderDropzone()}
      {renderFileList()}
      {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  );
};

export default FileUploader;
